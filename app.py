# Copyright (c) 2026 Amitesh Kumar Yadav. All rights reserved.
# Bridge file to run the backend from the root directory.

import sys
import os

# Add backend directory to sys.path so we can import app.py
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.append(backend_path)

# Import the Flask app instance from backend/app.py
from app import app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)))
