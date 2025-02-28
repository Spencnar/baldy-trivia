// app/admin/edit-question/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminQuestionForm from '@/components/AdminQuestionForm';
import { IQuestion } from '@/models/Question';

// @ts-expect-error - Ignoring type mismatch with Next.js 15.2.0
export default function EditQuestion({ params }) {
  const router = useRouter();
  const [question, setQuestion] = useState<Partial<IQuestion> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        setLoading(true);
        const response = await fetch(`/api/question/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Question not found');
          } else {
            throw new Error('Failed to fetch question');
          }
        }

        const data = await response.json();
        setQuestion(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [params.id]);

  const handleSuccess = () => {
    // Optionally navigate back to the admin dashboard
    // router.push('/admin');
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-6 bg-gray-200 rounded w-2/4 mb-10"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-md text-red-800">
        <p>{error}</p>
        <button
          onClick={() => router.push('/admin')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center">
        <p>Question not found</p>
        <button
          onClick={() => router.push('/admin')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Question</h1>
        <p className="text-gray-600">Update this trivia question</p>
      </div>

      <AdminQuestionForm initialQuestion={question} onSuccess={handleSuccess} />
    </div>
  );
}