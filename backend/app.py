from flask import Flask, request, jsonify
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from pinecone import Pinecone
import os

# Initialize the Flask application
app = Flask(__name__)

# Load environment variables from a .env file
from dotenv import load_dotenv
load_dotenv()

# Set API keys for OpenAI and Pinecone from environment variables
os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
os.environ['PINECONE_API_KEY'] = os.getenv('PINECONE_API_KEY')

# Initialize Pinecone client
pinecone_client = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))

# Define the index name for Pinecone
index_name = "pinecone-queryapp"


# Initialize embeddings and language model
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = None

# Initialize the language model with specific settings
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
qa = None

# Function to clear existing records in the Pinecone index
def clear_pinecone_index_if_exists():
    index = pinecone_client.Index(index_name)
    stats = index.describe_index_stats()

    # Inspect the stats structure
    print(stats)  

    # Check if there are any existing records
    total_vector_count = stats.get('namespaces', {}).get('', {}).get('vector_count', 0)
    if total_vector_count > 0:
        index.delete(deleteAll=True)

# Endpoint to handle PDF file uploads
@app.route('/api/upload', methods=['POST'])
def upload_pdf():
    global vectorstore, qa

    # Check if a file is part of the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    # Check if a file was selected
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Process the file if it's a PDF
    if file and file.filename.endswith('.pdf'):
        file_path = os.path.join('/tmp', file.filename)
        file.save(file_path)

        # Clear the existing Pinecone index if there are existing records
        clear_pinecone_index_if_exists()

        # Load and process the new PDF document
        loader = PyPDFLoader(file_path)
        doc = loader.load()
        text_splitter = RecursiveCharacterTextSplitter()
        split_docs = text_splitter.split_documents(doc)

        # Initialize the vector store with the split documents and embeddings
        vectorstore = PineconeVectorStore.from_documents(split_docs, embeddings, index_name=index_name)

        # Initialize the QA chain with the vector store retriever
        qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=vectorstore.as_retriever())

        return jsonify({'message': 'File uploaded and processed successfully'}), 200
    
    # Return an error if the file type is not valid
    return jsonify({'error': 'Invalid file type'}), 400

# Endpoint to handle queries
@app.route('/api/query', methods=['POST'])
def query():
    global qa

    # Check if the QA system is initialized
    if qa is None:
        return jsonify({'error': 'No PDF loaded'}), 400

    data = request.json
    question = data.get('question')

    # Check if a question was provided in the request
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    
    # Invoke the QA system to get an answer to the question
    answer = qa.invoke(question)
    
    # Get the result from the answer
    result = answer.get('result', 'No result available')

    return jsonify({'answer': result})

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
