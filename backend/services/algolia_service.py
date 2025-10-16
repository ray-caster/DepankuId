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
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # If we're already in an event loop, create a new thread with a new event loop
                def run_in_new_loop():
                    new_loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(new_loop)
                    try:
                        return new_loop.run_until_complete(coro)
                    finally:
                        new_loop.close()
                
                with concurrent.futures.ThreadPoolExecutor() as executor:
                    future = executor.submit(run_in_new_loop)
                    return future.result(timeout=30)  # 30 second timeout
            else:
                return loop.run_until_complete(coro)
        except RuntimeError as e:
            if "Event loop is closed" in str(e):
                # Event loop was closed, create a new one
                new_loop = asyncio.new_event_loop()
                asyncio.set_event_loop(new_loop)
                try:
                    return new_loop.run_until_complete(coro)
                finally:
                    new_loop.close()
            else:
                # No event loop exists, create a new one
                return asyncio.run(coro)
    
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
        async def _save():
            return await self.save_objects_async(objects)
        
        return self._run_async_safely(_save())
    
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
        async def _sync():
            return await self.sync_all_async(opportunities)
        
        return self._run_async_safely(_sync())

# Global instance
algolia_service = AlgoliaService()
