"""Algolia service for search functionality"""
from algoliasearch.search.client import SearchClient
from config.settings import ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY, ALGOLIA_INDEX_NAME
from utils.logging_config import logger
import asyncio
import concurrent.futures
from typing import List, Dict, Any

class AlgoliaService:
    """Service for managing Algolia search operations"""
    
    def __init__(self):
        if not ALGOLIA_APP_ID or not ALGOLIA_ADMIN_API_KEY:
            raise ValueError("Algolia configuration not found. Please set ALGOLIA_APP_ID and ALGOLIA_ADMIN_API_KEY environment variables.")
        
        self.client = SearchClient(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY)
        self.index_name = ALGOLIA_INDEX_NAME
    
    def _run_async_safely(self, coro):
        """Safely run async operations in sync context"""
        # For now, skip async operations entirely to avoid event loop issues
        # and rely on the synchronous fallback
        logger.warning("Skipping async operation to avoid event loop issues, using sync fallback")
        return False
    
    async def save_objects_async(self, objects: List[Dict[str, Any]]) -> bool:
        """Save objects to Algolia asynchronously"""
        try:
            await self.client.save_objects(
                index_name=self.index_name,
                objects=objects
            )
            logger.info(f"Successfully saved {len(objects)} objects to Algolia")
            return True
        except Exception as e:
            logger.error(f"Error saving objects to Algolia: {str(e)}")
            return False
    
    def save_objects(self, objects: List[Dict[str, Any]]) -> bool:
        """Save objects to Algolia synchronously"""
        # Try async approach first
        async def _save():
            return await self.save_objects_async(objects)
        
        result = self._run_async_safely(_save())
        if result:
            return result
        
        # Fallback: Use synchronous approach if async fails
        logger.warning("Async save failed, trying synchronous fallback")
        return self._save_objects_sync(objects)
    
    def _clean_data_for_algolia(self, obj: Dict[str, Any]) -> Dict[str, Any]:
        """Clean data for Algolia by removing large fields that cause payload issues"""
        cleaned = obj.copy()
        
        # Debug logging
        logger.info(f"Cleaning data for Algolia - Original keys: {list(obj.keys())}")
        logger.info(f"Images field: {obj.get('images', 'NOT_FOUND')}")
        
        # Handle images - keep only the first image as thumbnail for search results
        if 'images' in cleaned and cleaned['images']:
            images = cleaned['images']
            logger.info(f"Images found: {len(images)} images, first: {images[0] if images else 'None'}")
            if isinstance(images, list) and len(images) > 0:
                # Keep only the first image as thumbnail, but filter out blob URLs
                first_image = images[0]
                if not first_image.startswith('blob:'):
                    cleaned['thumbnail'] = first_image
                    logger.info(f"Set thumbnail: {first_image}")
                else:
                    cleaned['thumbnail'] = None
                    logger.info("Filtered out blob URL thumbnail")
            else:
                cleaned['thumbnail'] = None
                logger.info("No valid images for thumbnail")
            del cleaned['images']  # Remove the full images array
        else:
            logger.info("No images field found or images is empty")
        
        logger.info(f"Final cleaned data keys: {list(cleaned.keys())}")
        logger.info(f"Final thumbnail: {cleaned.get('thumbnail', 'NOT_FOUND')}")
        
        # Remove other large fields that can cause Algolia payload issues
        fields_to_remove = ['application_form', 'additional_info']
        for field in fields_to_remove:
            if field in cleaned:
                del cleaned[field]
        
        # Truncate very long text fields
        text_fields = ['description', 'benefits', 'eligibility', 'application_process']
        for field in text_fields:
            if field in cleaned and cleaned[field] and len(str(cleaned[field])) > 1000:
                cleaned[field] = str(cleaned[field])[:1000] + "..."
        
        return cleaned

    def _save_objects_sync(self, objects: List[Dict[str, Any]]) -> bool:
        """Synchronous fallback for saving objects to Algolia"""
        try:
            # Use the synchronous client if available
            import requests
            import json
            
            url = f"https://{ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/{self.index_name}/batch"
            headers = {
                'X-Algolia-API-Key': ALGOLIA_ADMIN_API_KEY,
                'X-Algolia-Application-Id': ALGOLIA_APP_ID,
                'Content-Type': 'application/json'
            }
            
            # Prepare batch operations with cleaned data
            operations = []
            for obj in objects:
                cleaned_obj = self._clean_data_for_algolia(obj)
                operations.append({
                    "action": "addObject",
                    "body": cleaned_obj
                })
            
            payload = {"requests": operations}
            
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            
            logger.info(f"Successfully saved {len(objects)} objects to Algolia (sync fallback)")
            return True
            
        except Exception as e:
            logger.error(f"Sync fallback also failed: {str(e)}")
            return False
    
    async def delete_objects_async(self, object_ids: List[str]) -> bool:
        """Delete objects from Algolia asynchronously"""
        try:
            await self.client.delete_objects(
                index_name=self.index_name,
                object_ids=object_ids
            )
            logger.info(f"Successfully deleted {len(object_ids)} objects from Algolia")
            return True
        except Exception as e:
            logger.error(f"Error deleting objects from Algolia: {str(e)}")
            return False
    
    def delete_objects(self, object_ids: List[str]) -> bool:
        """Delete objects from Algolia synchronously"""
        async def _delete():
            return await self.delete_objects_async(object_ids)
        
        return self._run_async_safely(_delete())
    
    async def sync_all_async(self, opportunities: List[Dict[str, Any]]) -> int:
        """Sync all opportunities to Algolia asynchronously"""
        try:
            # Prepare objects for Algolia
            objects = []
            for opp in opportunities:
                algolia_obj = opp.copy()
                algolia_obj['objectID'] = opp.get('id', opp.get('objectID'))
                algolia_obj['id'] = opp.get('id', opp.get('objectID'))  # Ensure id field matches objectID
                
                # Convert datetime objects to ISO strings
                if 'createdAt' in algolia_obj and algolia_obj['createdAt']:
                    if hasattr(algolia_obj['createdAt'], 'isoformat'):
                        algolia_obj['createdAt'] = algolia_obj['createdAt'].isoformat()
                    else:
                        algolia_obj['createdAt'] = str(algolia_obj['createdAt'])
                
                objects.append(algolia_obj)
            
            if objects:
                await self.client.save_objects(
                    index_name=self.index_name,
                    objects=objects
                )
                logger.info(f"Successfully synced {len(objects)} opportunities to Algolia")
                return len(objects)
            else:
                logger.info("No opportunities to sync to Algolia")
                return 0
                
        except Exception as e:
            logger.error(f"Error syncing opportunities to Algolia: {str(e)}")
            return 0
    
    def sync_all(self, opportunities: List[Dict[str, Any]]) -> int:
        """Sync all opportunities to Algolia synchronously"""
        # Try async approach first
        async def _sync():
            return await self.sync_all_async(opportunities)
        
        result = self._run_async_safely(_sync())
        if result is not False and result is not None:
            return result
        
        # Fallback: Use synchronous approach if async fails
        logger.warning("Async sync_all failed, trying synchronous fallback")
        return self._sync_all_sync(opportunities)
    
    def _sync_all_sync(self, opportunities: List[Dict[str, Any]]) -> int:
        """Synchronous fallback for syncing all opportunities to Algolia"""
        try:
            # Prepare objects for Algolia
            objects = []
            for opp in opportunities:
                algolia_obj = opp.copy()
                algolia_obj['objectID'] = opp.get('id', opp.get('objectID'))
                algolia_obj['id'] = opp.get('id', opp.get('objectID'))
                
                # Convert datetime objects to ISO strings
                if 'createdAt' in algolia_obj and algolia_obj['createdAt']:
                    if hasattr(algolia_obj['createdAt'], 'isoformat'):
                        algolia_obj['createdAt'] = algolia_obj['createdAt'].isoformat()
                
                if 'deadline' in algolia_obj and algolia_obj['deadline']:
                    if hasattr(algolia_obj['deadline'], 'isoformat'):
                        algolia_obj['deadline'] = algolia_obj['deadline'].isoformat()
                
                # Clean the object for Algolia (remove large fields)
                cleaned_obj = self._clean_data_for_algolia(algolia_obj)
                objects.append(cleaned_obj)
            
            if not objects:
                logger.warning("No objects to sync to Algolia")
                return 0
            
            # Use the synchronous save method
            success = self._save_objects_sync(objects)
            if success:
                logger.info(f"Successfully synced {len(objects)} opportunities to Algolia (sync fallback)")
                return len(objects)
            else:
                logger.error("Failed to sync opportunities to Algolia (sync fallback)")
                return 0
                
        except Exception as e:
            logger.error(f"Error in sync_all fallback: {str(e)}")
            return 0
    
    async def clear_index_async(self) -> bool:
        """Clear all objects from the Algolia index"""
        try:
            # Use the client's clear_objects method directly
            await self.client.clear_objects(index_name=self.index_name)
            logger.info(f"Cleared all objects from Algolia index: {self.index_name}")
            return True
        except Exception as e:
            logger.error(f"Error clearing Algolia index: {str(e)}")
            return False
    
    def clear_index(self) -> bool:
        """Clear all objects from the Algolia index synchronously"""
        async def _clear():
            return await self.clear_index_async()
        
        return self._run_async_safely(_clear())

# Global instance
algolia_service = AlgoliaService()
