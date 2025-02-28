// components/SubmissionForm.tsx
import { useState, FormEvent } from 'react';
import { IQuestion } from '@/models/Question';

interface SubmissionFormProps {
  question: Partial<IQuestion>;
  onSubmissionComplete: () => void;
}

export default function SubmissionForm({ question, onSubmissionComplete }: SubmissionFormProps) {
  const [name, setName] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ correct: boolean } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !answer.trim()) {
      setError('Please provide both your name and answer.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: question._id,
          name,
          answer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit your answer.');
      }

      const data = await response.json();
      setResult(data);
      
      // Clear form if submission was successful
      setName('');
      setAnswer('');
      
      // Notify parent component about completion
      onSubmissionComplete();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Submit Your Answer</h2>
      
      {result && (
        <div className={`p-4 mb-4 rounded ${result.correct ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          <p>
            {result.correct 
              ? '🎉 Congratulations! Your answer is correct!' 
              : 'Nice try! Your answer is incorrect. Feel free to try again tomorrow!'}
          </p>
        </div>
      )}
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-800 rounded">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={submitting || result?.correct}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
            Your Answer
          </label>
          <input
            type="text"
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={submitting || result?.correct}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={submitting || result?.correct || !name.trim() || !answer.trim()}
        >
          {submitting ? 'Submitting...' : 'Submit Answer'}
        </button>
      </form>
    </div>
  );
}