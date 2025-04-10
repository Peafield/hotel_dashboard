# Hotel Dashboard - Peter J Coles

A simple monorepo containing the frontend and backend for Hotel Dashboard.

## Structure

-   `/hotel_dashboard_frontend`: Contains the React frontend application.
-   `/hotel_dashboard_backend`: Contains the FastAPI backend application.

## Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [Python](https://www.python.org/) (3.8+ recommended)
-   [pip](https://pip.pypa.io/en/stable/installation/)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Peafield/hotel_dashboard.git
    cd hotel_dashboard
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd hotel_dashboard_frontend
    npm install
    # or: yarn install
    cd ..
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd hotel_dashboard_backend
    # Create and activate a virtual environment (recommended)
    python -m venv venv
    # On macOS/Linux:
    source venv/bin/activate
    # On Windows:
    # .\venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
    ```

4.  **Run Both Applications Concurrently:**

    * **Terminal 1: Run Frontend**
        ```bash
        cd hotel_dashboard_frontend
        npm run dev
        # or: yarn dev
        ```
        The frontend should now be running on `http://localhost:3000` or similar (check terminal output).

    * **Terminal 2: Run Backend**
        ```bash
        cd hotel_dashboard_backend
        # Activate virtual environment if not already active
        source venv/bin/activate # macOS/Linux
        # .\venv\Scripts\activate # Windows
        uvicorn app.main:app --reload --port 8000
        # Replace main:app with your actual Python file and FastAPI app instance
        # Adjust --port if needed
        ```
        The backend API should now be running, typically on `http://localhost:8000` (check terminal output).

See the README files inside the `/frontend` and `/backend` directories for more specific details on each part.