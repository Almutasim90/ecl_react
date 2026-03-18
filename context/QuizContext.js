import React, { createContext, useContext, useReducer, useCallback } from 'react';

const QuizContext = createContext(null);

const initialState = {
  type: null,           // 'listening' | 'reading'
  formNumber: null,
  questions: [],
  currentIndex: 0,
  answers: {},          // { [qno]: selectedOption (1-4) }
  isComplete: false,
};

function quizReducer(state, action) {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...initialState,
        type: action.payload.type,
        formNumber: action.payload.formNumber,
        questions: action.payload.questions,
        currentIndex: action.payload.currentIndex ?? 0,
        answers: action.payload.answers ?? {},
      };
    case 'ANSWER_QUESTION':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.qno]: action.payload.selectedOption,
        },
      };
    case 'NEXT_QUESTION':
      if (state.currentIndex < state.questions.length - 1) {
        return { ...state, currentIndex: state.currentIndex + 1 };
      }
      return state;
    case 'PREV_QUESTION':
      if (state.currentIndex > 0) {
        return { ...state, currentIndex: state.currentIndex - 1 };
      }
      return state;
    case 'FINISH_QUIZ':
      return { ...state, isComplete: true };
    case 'RESET_QUIZ':
      return initialState;
    default:
      return state;
  }
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const startQuiz = useCallback(({ type, formNumber, questions, currentIndex = 0, answers = {} }) => {
    dispatch({ type: 'START_QUIZ', payload: { type, formNumber, questions, currentIndex, answers } });
  }, []);

  const answerQuestion = useCallback((qno, selectedOption) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: { qno, selectedOption } });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const prevQuestion = useCallback(() => {
    dispatch({ type: 'PREV_QUESTION' });
  }, []);

  const finishQuiz = useCallback(() => {
    dispatch({ type: 'FINISH_QUIZ' });
  }, []);

  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' });
  }, []);

  // Computed values
  const currentQuestion = state.questions[state.currentIndex] || null;
  const currentAnswer = currentQuestion ? state.answers[currentQuestion.qno] : null;
  const totalQuestions = state.questions.length;
  const answeredCount = Object.keys(state.answers).length;

  const calculateScore = () => {
    let correct = 0;
    state.questions.forEach((q) => {
      if (state.answers[q.qno] === q.correctoption) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <QuizContext.Provider
      value={{
        // State
        ...state,
        currentQuestion,
        currentAnswer,
        totalQuestions,
        answeredCount,
        // Actions
        startQuiz,
        answerQuestion,
        nextQuestion,
        prevQuestion,
        finishQuiz,
        resetQuiz,
        calculateScore,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}
