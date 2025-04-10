### Running Backend Tests

Ensure you are in the backend project directory (`hotel_dashboard_backend`) and have activated the Python virtual environment.

1.  **Activate Virtual Environment** (if not already active):
    ```bash
    # On Linux/macOS
    source venv/bin/activate
    # On Windows (CMD/PowerShell)
    # .\venv\Scripts\activate
    ```

2.  **Install Dependencies** (if running for the first time or after cloning):
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run Pytest:**
    Use the following command to run all tests with verbose output:
    ```bash
    pytest -v
    ```
    *Note: To clear the pytest cache before running, use `pytest -v --cache-clear`.*