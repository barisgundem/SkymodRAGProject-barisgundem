import React, { useState } from 'react';
import Input from './components/Input';
import Answer from './components/Answer';
import './App.css';  // Import the CSS file

const App = () => {
  const [uploadMessage, setUploadMessage] = useState('');

  return (
    <div className="app-container">
      <div className="header">
        <img src="/bot.png" alt="Logo" className="logo" />
        <h1>CHATPDF</h1>
      </div>
      <div className="chat-interface">
        <Answer />
        <Input setUploadMessage={setUploadMessage} />
      </div>
      {uploadMessage && <div className="upload-message">{uploadMessage}</div>}
    </div>
  );
};

export default App;
