import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRoom } from '../lib/db';
import useAIGenerator from './useAIGenerator';

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export default function useCreateQuiz() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [settings, setSettings] = useState({
    title: '',
    description: '',
    globalTimerEnabled: true,
    globalTimer: 10,
    leaderboardEnabled: true,
    isPublic: false,
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: 'MCQ',
      text: '',
      options: ['', '', '', ''],
      correct: 0,
      tag: '',
      points: 1
    }
  ]);

  const aiGenerator = useAIGenerator(setQuestions);

  const handleSettingsChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        type: 'MCQ',
        text: '',
        options: ['', '', '', ''],
        correct: 0,
        tag: '',
        points: 1
      }
    ]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId, optIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const moveQuestion = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === questions.length - 1)) return;
    const newQuestions = [...questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index + direction];
    newQuestions[index + direction] = temp;
    setQuestions(newQuestions);
  };

  const handleNextStep = () => {
    setFormError('');
    if (step === 1) {
      if (!settings.title.trim()) {
        setFormError("Quiz title cannot be empty.");
        return;
      }
    } else if (step === 2) {
      if (questions.length === 0) {
        setFormError("You must add at least one question.");
        return;
      }
      for (let i = 0; i < questions.length; i++) {
        if (!questions[i].text || !questions[i].text.trim()) {
          setFormError(`Question ${i + 1} text cannot be empty.`);
          return;
        }
      }
    }
    setStep(step + 1);
  };

  const handleLaunch = async () => {
    setIsSubmitting(true);
    const roomCode = generateRoomCode();
    
    try {
      await createRoom({
        id: roomCode,
        title: settings.title,
        description: settings.description,
        hostId: currentUser?.uid || 'anonymous',
        hostName: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User',
        status: "waiting",
        settings: settings,
        questions: questions
      });
      
      navigate(`/room/${roomCode}/host`, { replace: true });
    } catch (error) {
      console.error("Error creating room:", error);
      setIsSubmitting(false);
    }
  };

  return {
    step, setStep,
    settings, handleSettingsChange,
    questions, addQuestion, updateQuestion, updateOption, removeQuestion, moveQuestion,
    isSubmitting, formError, setFormError,
    handleNextStep, handleLaunch,
    aiGenerator
  };
}
