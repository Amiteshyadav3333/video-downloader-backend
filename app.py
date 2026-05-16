# Copyright (c) 2026 Amitesh Kumar Yadav. All rights reserved.
# Robust bridge file to avoid circular imports.

import sys
import os
import importlib.util

# 1. Define the absolute path to the actual backend app.py
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
backend_file = os.path.join(backend_dir, 'app.py')

# 2. Add backend to path for internal relative imports in app.py
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

# 3. Load the module using a unique name to avoid circular import with "app.py"
spec = importlib.util.spec_from_file_location("actual_backend_app", backend_file)
backend_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backend_module)

# 4. Expose the Flask 'app' instance so gunicorn finds it as "app:app"
app = backend_module.app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
