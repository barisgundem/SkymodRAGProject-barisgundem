import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAnswer = createAsyncThunk(
  'question/fetchAnswer',
  async (question) => {
    try {
      const response = await axios.post('/api/query', { question });
      return response.data.answer;
    } catch (error) {
      // Check if the error is a 400 response, indicating no PDF uploaded
      if (error.response && error.response.status === 400) {
        return 'You can start asking questions by uploading a PDF.';
      }
      // Re-throw the error if it's a different issue
      throw error;
    }
  }
);

const questionSlice = createSlice({
  name: 'question',
  initialState: {
    currentQuestion: '',
    currentAnswer: 'What would you like to ask me about the pdf?',
    history: [{ type: 'bot', message: 'What would you like to ask me about the pdf?' }],
    status: 'succeeded',
    error: null,
  },
  reducers: {
    setQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    addQuestionToHistory: (state) => {
      state.history.push({ type: 'user', message: state.currentQuestion });
      state.currentQuestion = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAnswer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentAnswer = action.payload;
        state.history.push({ type: 'bot', message: action.payload });
      })
      .addCase(fetchAnswer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setQuestion, addQuestionToHistory } = questionSlice.actions;

export default questionSlice.reducer;
