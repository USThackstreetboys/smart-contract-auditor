#!/usr/bin/env python3
"""
Smart Contract AI Auditor - Backend Runner
"""

import os
import sys
import uvicorn
from dotenv import load_dotenv

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

def main():
    """Main entry point for the application"""
    
    # Load environment variables
    load_dotenv()
    
    # Check for required environment variables
    required_vars = ['OPENAI_API_KEY']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ ERROR: Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n📋 Please create a .env file with your API keys:")
        print("   OPENAI_API_KEY=your_key_here")
        print("\n🔗 Get your OpenAI API key from: https://platform.openai.com/api-keys")
        sys.exit(1)
    
    # Configuration
    config = {
        'app': 'app.main:app',
        'host': '0.0.0.0',
        'port': 8000,
        'reload': True,
        'log_level': 'info',
        'access_log': True
    }
    
    # Development vs Production settings
    if os.getenv('APP_ENV') == 'production':
        config.update({
            'reload': False,
            'workers': 4
        })
    
    print("🚀 Starting Smart Contract AI Auditor Backend...")
    print(f"📡 Server will run on: http://localhost:{config['port']}")
    print("📋 API Documentation: http://localhost:8000/docs")
    print("🔄 Health Check: http://localhost:8000/health")
    print("\n💡 Sample endpoints:")
    print("   POST /analyze - Upload and analyze contracts")
    print("   GET /sample-contracts - Get demo contracts")
    print("\n⚠️  Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        # Start the server
        uvicorn.run(**config)
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Server error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()