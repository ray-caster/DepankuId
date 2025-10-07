"""Input validation utilities"""
import re
from typing import Dict, Any, Optional, List

class ValidationError(Exception):
    """Custom validation error"""
    pass

class Validator:
    """Input validation utilities"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        if not email or not isinstance(email, str):
            raise ValidationError("Email is required")
        
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, email):
            raise ValidationError("Invalid email format")
        
        if len(email) > 255:
            raise ValidationError("Email is too long")
        
        return True
    
    @staticmethod
    def validate_password(password: str) -> bool:
        """Validate password strength"""
        if not password or not isinstance(password, str):
            raise ValidationError("Password is required")
        
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters long")
        
        if len(password) > 128:
            raise ValidationError("Password is too long")
        
        # Check for at least one uppercase, one lowercase, one digit
        if not re.search(r'[A-Z]', password):
            raise ValidationError("Password must contain at least one uppercase letter")
        
        if not re.search(r'[a-z]', password):
            raise ValidationError("Password must contain at least one lowercase letter")
        
        if not re.search(r'\d', password):
            raise ValidationError("Password must contain at least one number")
        
        return True
    
    @staticmethod
    def validate_name(name: str) -> bool:
        """Validate name format"""
        if not name or not isinstance(name, str):
            raise ValidationError("Name is required")
        
        name = name.strip()
        
        if len(name) < 2:
            raise ValidationError("Name must be at least 2 characters long")
        
        if len(name) > 100:
            raise ValidationError("Name is too long")
        
        # Allow letters, spaces, hyphens, and apostrophes
        if not re.match(r"^[a-zA-Z\s\-']+$", name):
            raise ValidationError("Name contains invalid characters")
        
        return True
    
    @staticmethod
    def sanitize_string(value: str, max_length: int = 1000) -> str:
        """Sanitize string input"""
        if not isinstance(value, str):
            return ""
        
        # Remove null bytes and control characters
        value = re.sub(r'[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]', '', value)
        
        # Trim whitespace
        value = value.strip()
        
        # Limit length
        if len(value) > max_length:
            value = value[:max_length]
        
        return value
    
    @staticmethod
    def validate_url(url: str) -> bool:
        """Validate URL format"""
        if not url:
            return True  # Optional field
        
        if not isinstance(url, str):
            raise ValidationError("Invalid URL format")
        
        pattern = r'^https?://[a-zA-Z0-9\-._~:/?#\[\]@!$&\'()*+,;=]+$'
        if not re.match(pattern, url):
            raise ValidationError("Invalid URL format")
        
        if len(url) > 2048:
            raise ValidationError("URL is too long")
        
        return True
    
    @staticmethod
    def validate_token(token: str) -> bool:
        """Validate token format"""
        if not token or not isinstance(token, str):
            raise ValidationError("Token is required")
        
        # Tokens should be alphanumeric with hyphens and underscores
        if not re.match(r'^[a-zA-Z0-9\-_]+$', token):
            raise ValidationError("Invalid token format")
        
        if len(token) < 16 or len(token) > 256:
            raise ValidationError("Invalid token length")
        
        return True
    
    @staticmethod
    def validate_uid(uid: str) -> bool:
        """Validate Firebase UID format"""
        if not uid or not isinstance(uid, str):
            raise ValidationError("UID is required")
        
        # Firebase UIDs are alphanumeric
        if not re.match(r'^[a-zA-Z0-9]+$', uid):
            raise ValidationError("Invalid UID format")
        
        if len(uid) < 10 or len(uid) > 128:
            raise ValidationError("Invalid UID length")
        
        return True

def validate_signup_data(data: Dict[str, Any]) -> Dict[str, str]:
    """Validate signup data"""
    email = data.get('email', '')
    password = data.get('password', '')
    name = data.get('name', '')
    
    Validator.validate_email(email)
    Validator.validate_password(password)
    Validator.validate_name(name)
    
    return {
        'email': email.lower().strip(),
        'password': password,
        'name': Validator.sanitize_string(name, 100)
    }

def validate_signin_data(data: Dict[str, Any]) -> Dict[str, str]:
    """Validate signin data"""
    email = data.get('email', '')
    
    Validator.validate_email(email)
    
    return {
        'email': email.lower().strip()
    }

def validate_verification_data(data: Dict[str, Any]) -> Dict[str, str]:
    """Validate email verification data"""
    token = data.get('token', '')
    uid = data.get('uid', '')
    
    Validator.validate_token(token)
    Validator.validate_uid(uid)
    
    return {
        'token': token,
        'uid': uid
    }

