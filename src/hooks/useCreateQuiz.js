import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRoom } from '../lib/db';
import useAIGenerator from './useAIGenerator';

/**
 * Generates a random 6-character alphanumeric room code (uppercase).
 * Math.random().toString(36) produces a base-36 string like "0.k3x9z2".
 * substring(2, 8) strips the "0." prefix and takes 6 characters.
 * Example output: "K3X9Z2"
 */
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * useCreateQuiz — data hook for the multi-step quiz creation flow.
 *
 * Step 1 — Quiz settings (title, description, timer, leaderboard, visibility)
 * Step 2 — Question builder (add/edit/remove/reorder questions manually or via AI)
 * Step 3 — Review & Launch (confirm everything before publishing the room)
 *
 * On launch: generates a room code, writes the room to Firebase, navigates to the lobby.
 */
export default function useCreateQuiz() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);             // current wizard step (1, 2, or 3)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Quiz settings — matches the structure stored under rooms/{id}/settings in Firebase
  const [settings, setSettings] = useState({
    title: '',
    description: '',
    globalTimerEnabled: true,  // whether the countdown timer is active
    globalTimer: 10,           // timer duration in minutes
    leaderboardEnabled: true,
    isPublic: false,           // whether this quiz appears on the public Explore page
  });

  // Questions array — each question has a unique id, type, text, options array,
  // correct answer index, topic tag, and point value.
  // Initialized with one blank MCQ so the form isn't empty on first open.
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: 'MCQ',
      text: '',
      options: ['', '', '', ''],
      correct: 0,  // index into the options array
      tag: '',
      points: 1
    }
  ]);

  // useAIGenerator is a sub-hook for the AI panel and Groq API call.
  // It receives setQuestions so it can append AI-generated questions directly to the list.
  const aiGenerator = useAIGenerator(setQuestions);

  // Generic settings change handler — works for text inputs and checkboxes
  const handleSettingsChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  // Appends a blank MCQ to the list.
  // Date.now() as id guarantees uniqueness even when questions are added rapidly.
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

  // Updates a single field on a specific question without mutating the others
  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  // Updates a single option text for a specific question at a given index
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

  // Removes a question. Enforces a minimum of 1 question in the quiz.
  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  // Moves a question up (direction = -1) or down (direction = 1).
  // Guards against moving out-of-bounds, then swaps adjacent elements.
  const moveQuestion = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === questions.length - 1)) return;
    const newQuestions = [...questions];
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[index + direction];
    newQuestions[index + direction] = temp;
    setQuestions(newQuestions);
  };

  // Validates the current step before advancing.
  // Step 1: quiz must have a non-empty title.
  // Step 2: every question must have non-empty text.
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

  // Called on Step 3 when the host clicks "Launch Quiz".
  // Generates a unique room code, writes the full room to Firebase,
  // then navigates the host to the lobby for that room.
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
        status: "waiting",  // students can join but the quiz hasn't started yet
        settings: settings,
        questions: questions
      });
      
      // replace: true prevents the Back button from returning to the creation form
      navigate(`/room/${roomCode}/host`, { replace: true });
    } catch (error) {
      console.error("Error creating room:", error);
      setIsSubmitting(false); // allow retry on failure
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
