// components/QuestionDisplay.tsx
import { useState, useEffect } from 'react';
import { IQuestion } from '@/models/Question';

export default function QuestionDisplay() {
  const [question, setQuestion] = useState<Partial<IQuestion> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  useEffect(() => {
    async function fetchTodaysQuestion() {
      try {
        setLoading(true);
        const response = await fetch('/api/question');
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('No question available today.');
          } else {
            setError('Failed to fetch today\'s question.');
          }
          return;
        }

        const data = await response.json();
        setQuestion(data);
      } catch (err) {
        setError('An error occurred while fetching the question.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTodaysQuestion();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <p>No question available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Today&apos;s Question:</h2>
      <p className="text-lg mb-4">{question.question}</p>
      
      {question.hint && (
        <div className="mt-4">
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Need a hint?
            </button>
          ) : (
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <p className="text-sm text-gray-700"><strong>Hint:</strong> {question.hint}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}