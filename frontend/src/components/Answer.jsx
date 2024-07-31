import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import './Answer.css';

const Answer = () => {
  const { currentQuestion, currentAnswer, history, status, error } = useSelector((state) => state.question);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <div className="chat-container">
      {history.map((entry, index) => (
        <div key={index} className={`chat-bubble ${entry.type === 'bot' ? 'bot-bubble' : 'user-bubble'}`}>
          {entry.type === 'bot' && <img src="/bot.png" alt="Bot Logo" className="bot-icon" />}
          <p>{entry.message}</p>
        </div>
      ))}
      {status === 'loading' && (
        <div className="chat-bubble bot-bubble">
          <img src="/bot.png" alt="Bot Logo" className="bot-icon" />
          <p>Generating reply....</p>
        </div>
      )}
      {status === 'failed' && (
        <div className="chat-bubble bot-bubble">
          <img src="/bot.png" alt="Bot Logo" className="bot-icon" />
          <p>Error: {error}</p>
        </div>
      )}
      <div ref={chatEndRef}></div>
    </div>
  );
};

export default Answer;
