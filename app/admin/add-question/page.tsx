// app/admin/add-question/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import AdminQuestionForm from '@/components/AdminQuestionForm';

export default function AddQuestion() {
  const router = useRouter();

  const handleSuccess = () => {
     router.push('/admin');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Question</h1>
        <p className="text-gray-600">Create a new daily trivia question</p>
      </div>

      <AdminQuestionForm onSuccess={handleSuccess} />
    </div>
  );
}