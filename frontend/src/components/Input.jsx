import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuestion, addQuestionToHistory, fetchAnswer } from '../redux/questionSlice';
import axios from 'axios';
import './Input.css';

const Input = ({ setUploadMessage }) => {
  const dispatch = useDispatch();
  const question = useSelector((state) => state.question.currentQuestion);
  const [inputValue, setInputValue] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('Upload PDF');
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const truncatedName = selectedFile.name.length > 10 ? selectedFile.name.substring(0, 10) + '...' : selectedFile.name;
      setFileName(truncatedName);
      setProgress(0);
      setIsReady(false);

      for (let i = 0; i <= 100; i++) {
        setTimeout(() => {
          setProgress(i);
          if (i === 100) {
            setIsReady(true);
          }
        }, i * 50); // Faster increment for testing
      }

      // Handle file upload and processing
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('File uploaded and processed successfully');
      } catch (error) {
        console.error('Error uploading the file', error);
        setUploadMessage('Error uploading the file');
      }
    } else {
      setFileName('Upload PDF');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputValue.trim()) {
      dispatch(setQuestion(inputValue));
      dispatch(addQuestionToHistory());
      dispatch(fetchAnswer(inputValue));
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        id="file-upload"
        style={{ display: 'none' }}
      />
      <label htmlFor="file-upload" className="upload-button">
        {isReady ? 'Ready' : progress > 0 ? `${fileName} ${progress}%` : 'Upload PDF'}
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Ask a question"
        className="input-field"
      />
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default Input;
