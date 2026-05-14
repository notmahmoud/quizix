import { useState } from 'react';

export default function useAIGenerator(setQuestions) {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiCount, setAiCount] = useState(5);
  const [aiType, setAiType] = useState('MCQ');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuccess, setAiSuccess] = useState('');

  const generate = async () => {
    if (!aiTopic.trim()) {
      setAiError('Please enter a topic.');
      return;
    }

    setIsGenerating(true);
    setAiError('');
    setAiSuccess('');

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    const typeInstruction =
      aiType === 'True or False'
        ? 'All questions must be True or False type.'
        : aiType === 'Mixed'
        ? 'Mix MCQ and True or False questions.'
        : 'All questions must be MCQ. You MUST provide exactly 4 options for each MCQ.';

    const prompt = `Generate ${aiCount} ${aiDifficulty} quiz questions about "${aiTopic}". ${typeInstruction}
Return ONLY a valid JSON array with no explanation. Each object must have:
- "text": the question string
- "type": "MCQ" or "True or False"
- "options": array of strings (4 for MCQ, ["True","False"] for T/F)
- "correct": index of the correct option (0-based)
- "tag": a short topic tag
- "points": 10`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error?.message || 'Groq API error');
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content || '';

      // Extract JSON array from response
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No valid JSON array found in response.');

      const parsed = JSON.parse(jsonMatch[0]);

      const newQuestions = parsed.map((q, i) => {
        let type = q.type || 'MCQ';
        let options = q.options || [];

        // Auto-fix if AI returned an MCQ but with True/False options or fewer than 3 options
        if (type === 'MCQ') {
          if (options.length < 3 || (options.length === 2 && options.includes('True'))) {
            type = 'True or False';
          } else {
            // pad or trim options to exactly 4
            while (options.length < 4) options.push('');
            options = options.slice(0, 4);
          }
        }

        if (type === 'True or False') {
          options = ['True', 'False'];
          if (q.correct > 1) q.correct = 0;
        }

        return {
          id: Date.now() + i,
          type,
          text: q.text || '',
          options,
          correct: q.correct ?? 0,
          tag: aiTopic.trim().charAt(0).toUpperCase() + aiTopic.trim().slice(1),
          points: 1,
        };
      });

      setQuestions((prev) => [...prev.filter(q => q.text.trim() !== ''), ...newQuestions]);
      setAiSuccess(`${newQuestions.length} questions generated successfully!`);
      setAiTopic('');
    } catch (err) {
      setAiError(err.message || 'Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    aiPanelOpen, setAiPanelOpen,
    aiTopic, setAiTopic,
    aiDifficulty, setAiDifficulty,
    aiCount, setAiCount,
    aiType, setAiType,
    isGenerating,
    aiError, aiSuccess,
    generate,
  };
}
