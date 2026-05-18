import { useState } from 'react';

/**
 * useAIGenerator — sub-hook for AI-assisted question generation
 *
 * Manages the state of the AI panel inside the quiz creation page and
 * handles the full lifecycle of calling the Groq API (LLaMA model):
 *   build prompt → call API → parse JSON response → normalize questions → append to list
 *
 * This hook accepts setQuestions from useCreateQuiz so it can append
 * generated questions directly into the parent hook's state without
 * needing any shared global state or context.
 *
 * @param {Function} setQuestions - state setter from useCreateQuiz
 */
export default function useAIGenerator(setQuestions) {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);  // controls panel visibility
  const [aiTopic, setAiTopic] = useState('');              // topic entered by the user
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiCount, setAiCount] = useState(5);               // number of questions to generate
  const [aiType, setAiType] = useState('MCQ');             // 'MCQ' | 'True/False' | 'Mixed'
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

    // API key is loaded from the environment variable — never hardcoded in source
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    // Build a type-specific instruction to include in the prompt.
    // Being explicit about the expected format reduces hallucination from the LLM.
    const typeInstruction =
      aiType === 'True/False' || aiType === 'TF' || aiType === 'True or False'
        ? 'All questions must be True or False type. Use "type": "TF".'
        : aiType === 'Mixed'
          ? 'Mix MCQ and True or False questions.'
          : 'All questions must be strictly Multiple Choice (MCQ). You MUST provide exactly 4 options for each question. Do NOT generate True or False questions. Use "type": "MCQ".';

    // The prompt tells the model exactly what JSON schema to follow.
    // Asking for "ONLY a valid JSON array with no explanation" minimizes
    // the extra text the model wraps around its output, which we strip out anyway.
    const prompt = `Generate ${aiCount} ${aiDifficulty} quiz questions about "${aiTopic}". ${typeInstruction}
Return ONLY a valid JSON array with no explanation. Each object must have:
- "text": the question string
- "type": "MCQ" or "TF"
- "options": array of strings (4 for MCQ, ["True","False"] for TF)
- "correct": index of the correct option (0-based)
- "tag": a short topic tag
- "points": 1`;

    try {
      // Call the Groq API using the OpenAI-compatible chat completions endpoint
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // fast, lightweight model suitable for structured output
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7, // moderate creativity — lower = more deterministic, higher = more varied
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error?.message || 'Groq API error');
      }

      const data = await response.json();
      // Extract the model's text reply from the standard OpenAI response shape
      const raw = data.choices?.[0]?.message?.content || '';

      // The model sometimes wraps the JSON in markdown code fences or adds prose.
      // This regex finds the first [...] block in the response, regardless of surrounding text.
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No valid JSON array found in response.');

      const parsed = JSON.parse(jsonMatch[0]);

      // Normalize each question returned by the model to match our internal schema
      const newQuestions = parsed.map((q, i) => {
        let type = q.type || 'MCQ';
        let options = Array.isArray(q.options) ? q.options : [];

        // Override the model's type if the user explicitly selected MCQ or TF
        // (models sometimes ignore type instructions)
        if (aiType === 'MCQ') {
          type = 'MCQ';
        } else if (aiType === 'True or False' || aiType === 'TF' || aiType === 'True/False') {
          type = 'TF';
        }

        // Auto-fix: if the model returned an MCQ with True/False options or fewer than 3 options,
        // treat it as a TF question instead of padding it with placeholder options
        if (type === 'MCQ') {
          if (aiType === 'Mixed' && (options.length < 3 || (options.length === 2 && options.includes('True')))) {
            type = 'TF';
          } else {
            // Ensure exactly 4 options: pad with placeholders if too few, trim if too many
            while (options.length < 4) options.push(`Option ${options.length + 1}`);
            options = options.slice(0, 4);
          }
        }

        // Normalize any TF variant to the canonical 'TF' type with standard options
        if (type === 'True or False' || type === 'TF') {
          type = 'TF';
          options = ['True', 'False'];
          // Clamp the correct index to 0 or 1 — anything else is invalid for TF
          if (q.correct > 1 || q.correct == null) q.correct = 0;
        }

        return {
          id: Date.now() + i, // unique id — +i prevents collision when multiple questions are created at the same millisecond
          type,
          text: q.text || '',
          options,
          correct: q.correct ?? 0,
          // Capitalize the topic tag using the user's input rather than the model's tag
          // to keep tags consistent with what the user typed
          tag: aiTopic.trim().charAt(0).toUpperCase() + aiTopic.trim().slice(1),
          points: 1,
        };
      });

      // Merge with existing questions: remove any blank placeholder questions first,
      // then append the newly generated ones
      setQuestions((prev) => [...prev.filter(q => q.text.trim() !== ''), ...newQuestions]);
      setAiSuccess(`${newQuestions.length} questions generated successfully!`);
      setAiTopic(''); // clear the topic field for the next generation
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
