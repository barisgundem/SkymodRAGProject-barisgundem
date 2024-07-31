# Skymod RAG Project
# ChatPDF Query Application

ChatPDF is a web application that allows users to upload PDF files and interact with a chatbot to query the contents of the PDF. The application uses a Flask backend to handle file uploads and queries, and a React frontend to provide a user interface.

available at: http://3.84.248.88:5173/ (deployed on aws ec2)
If your question is not answered, wait a few more seconds. The Pinecone side is a bit slow.
<img width="1087" alt="Ekran Resmi 2024-07-31 21 24 05" src="https://github.com/user-attachments/assets/055cd6ee-8caa-4627-ae4e-ae5c292035e9">

## Features
- Upload PDF files to the server
- Query the contents of the uploaded PDF through a chatbot interface
- Real-time progress updates during PDF upload
- User-friendly interface with immediate feedback

## Technologies Used

- Frontend: React, Vite, Redux Toolkit
- Backend: Flask, Python
- Vector Store: Pinecone
- Language Model: OpenAI (via Langchain)
- PDF Processing: PyPDFLoader (via Langchain)
- Embeddings: OpenAIEmbeddings (via Langchain)

## Setup Instructions

### Prerequisites

- Node.js and npm
- Python 3.8+
- Pinecone API key
- OpenAI API key

### Backend Setup

1. **Clone the repository:**

    ```sh
    git clone 
    ```

2. **Navigate to the backend directory:**

    ```sh
    cd backend
    ```

3. **Create and activate a virtual environment:**

    ```sh
    python3 -m venv venv
    source venv/bin/activate
    ```

4. **Install dependencies:**

    ```sh
    pip install -r requirements.txt
    ```

5. **Run the backend server:**

    ```sh
    python app.py
    ```

### Frontend Setup

1. **Open a new terminal:**

2. **Navigate to the frontend directory:**

    ```sh
   cd frontend
    ```

3. **Install dependencies:**

    ```sh
    npm install
    ```

4. **Run the frontend server:**

    ```sh
    npm run dev
    ```

## Running the Application

1. **Start the backend server:**

    Ensure your backend server is running by following the steps in the Backend Setup section.

2. **Start the frontend server:**

    Ensure your frontend server is running by following the steps in the Frontend Setup section.

3. **Access the application:**

    Open your web browser and navigate to port where the frontend is running

## Usage

1. **Upload a PDF:**

    Click on the "Upload PDF" button and select a PDF file from your computer. Wait for the upload to complete. The progress will be shown on the button, and it will change to "Ready" once the upload is complete.
    You can upload a new pdf by clicking the same button again, and make queries for the new pdf.
**Information about previously uploaded PDFs does not affect new queries.**
3. **Ask a question:**

    Enter your question in the input field and click "Submit." Your question will appear in the chat interface immediately, and the chatbot's response will follow shortly.

4. **Receive responses:**

    The chatbot will provide answers based on the contents of the uploaded PDF. If no PDF is uploaded, the chatbot will prompt you to upload a PDF.


