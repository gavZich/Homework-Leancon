# IFC Viewer – Backend + Frontend App

A simple web-based system for parsing and displaying IFC (Industry Foundation Classes) data.

------------------------------------------------------------------------------------------------------------

## Project Structure

- **Backend** – FastAPI service that parses IFC files and exposes API endpoints.
- **`data/` folder** – Contains `.ifc` files used for parsing and testing.
- **`requirements.txt`** – Lists all Python dependencies for the backend.
- **`test_parser.py`** – Simple test script that verifies core backend functionality.
- **Frontend** – React app that (currently) displays IFC data in a table.
- **`components/`** – Contains all UI components, structured by feature.
  - **`3Dstructure/`** – Placeholder for future Three.js IFC model viewer. ****Not yet updated and running
  - **`Table/`** – Includes table-related components for displaying IFC data.
- **`pages/`** – Includes one page `MainPage.jsx`.
- **`App.js`** – Main app component, contains layout and routing logic.



------------------------------------------------------------------------------------

## ▶️ How to Run the Project

### Backend

#### 1. Open a terminal and set up a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate        # For Linux/macOS
venv\Scripts\activate           # For Windows

**update the requirements file -**
pip install -r requirements.txt

**run from folder `Backend` -**
uvicorn main:app --reload

**run tasts -**
python tests/test_parser.py


### Frontend

#### 2. Open a terminal and write:
cd frontend
**install - **
npm install

**run from folder `Backend` -**
npm start


