"""Environment variable validation"""
import os
import sys
from typing import List, Dict

class EnvironmentError(Exception):
    """Custom environment error"""
    pass

class EnvValidator:
    """Validate required environment variables"""
    
    REQUIRED_VARS = [
        'FIREBASE_SERVICE_ACCOUNT_KEY',
        'ALGOLIA_APP_ID',
        'ALGOLIA_ADMIN_API_KEY',
        'GEMINI_API_KEY',
        'BREVO_API_KEY',
    ]
    
    OPTIONAL_VARS = {
        'BREVO_SENDER_EMAIL': 'verify@depanku.id',
        'BREVO_SENDER_NAME': 'Depanku Verification',
        'FRONTEND_URL': 'http://localhost:3000',
        'PORT': '5000',
        'FLASK_ENV': 'development',
        'FLASK_DEBUG': 'True',
    }
    
    @classmethod
    def validate(cls) -> Dict[str, str]:
        """Validate all required environment variables"""
        missing_vars = []
        warnings = []
        
        # Check required variables
        for var in cls.REQUIRED_VARS:
            value = os.getenv(var)
            if not value:
                missing_vars.append(var)
            elif var == 'FIREBASE_SERVICE_ACCOUNT_KEY' and len(value) < 100:
                warnings.append(f"{var} seems too short - ensure it's a valid JSON string")
        
        # Set defaults for optional variables
        for var, default in cls.OPTIONAL_VARS.items():
            if not os.getenv(var):
                os.environ[var] = default
                warnings.append(f"{var} not set, using default: {default}")
        
        # Report errors
        if missing_vars:
            error_msg = f"Missing required environment variables: {', '.join(missing_vars)}"
            raise EnvironmentError(error_msg)
        
        # Return status
        return {
            'status': 'success',
            'warnings': warnings
        }
    
    @classmethod
    def validate_production(cls) -> bool:
        """Additional validation for production environment"""
        if os.getenv('FLASK_ENV') == 'production':
            prod_checks = []
            
            # Check FRONTEND_URL is HTTPS
            frontend_url = os.getenv('FRONTEND_URL', '')
            if not frontend_url.startswith('https://'):
                prod_checks.append('FRONTEND_URL should use HTTPS in production')
            
            # Check DEBUG is disabled
            if os.getenv('FLASK_DEBUG', '').lower() in ['true', '1', 'yes']:
                prod_checks.append('FLASK_DEBUG should be False in production')
            
            if prod_checks:
                print("[WARNING] Production environment warnings:")
                for check in prod_checks:
                    print(f"  - {check}")
                return False
        
        return True

def validate_environment():
    """Validate environment on startup"""
    try:
        result = EnvValidator.validate()
        
        print("[OK] Environment validation passed")
        
        if result['warnings']:
            print("\n[WARNING] Environment warnings:")
            for warning in result['warnings']:
                print(f"  - {warning}")
        
        # Production-specific checks
        if not EnvValidator.validate_production():
            print("\n[WARNING] Consider fixing production warnings before deployment")
        
        return True
        
    except EnvironmentError as e:
        print(f"\n[ERROR] Environment validation failed: {str(e)}")
        print("\nPlease check your .env file and ensure all required variables are set.")
        print("See backend/ENV_TEMPLATE.md for reference.")
        sys.exit(1)

if __name__ == '__main__':
    validate_environment()

