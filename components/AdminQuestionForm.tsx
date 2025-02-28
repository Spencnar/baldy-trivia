// components/AdminQuestionForm.tsx
import { useState, FormEvent } from 'react';
import { IQuestion } from '@/models/Question';

interface AdminQuestionFormProps {
  initialQuestion?: Partial<IQuestion>;
  onSuccess: () => void;
}

export default function AdminQuestionForm({ initialQuestion, onSuccess }: AdminQuestionFormProps) {
  const [formData, setFormData] = useState({
    question: initialQuestion?.question || '',
    answer: initialQuestion?.answer || '',
    hint: initialQuestion?.hint || '',
    publishDate: initialQuestion?.publishDate 
      ? new Date(initialQuestion.publishDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    active: initialQuestion?.active ?? true,
  });
  
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim() || !formData.publishDate) {
      setError('Question, answer, and publish date are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const url = initialQuestion?._id
        ? `/api/question/${initialQuestion._id}`
        : '/api/question';
      
      const method = initialQuestion?._id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save question.');
      }

      setSuccess(initialQuestion?._id
        ? 'Question updated successfully!'
        : 'Question created successfully!'
      );
      
      // If it's a new question, reset the form
      if (!initialQuestion?._id) {
        setFormData({
          question: '',
          answer: '',
          hint: '',
          publishDate: new Date().toISOString().split('T')[0],
          active: true,
        });
      }
      
      // Notify parent component about success
      onSuccess();
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">
        {initialQuestion?._id ? 'Edit Question' : 'Create New Question'}
      </h2>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-800 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-4 mb-4 bg-green-100 text-green-800 rounded">
          <p>{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            Question Text
          </label>
          <textarea
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
            Answer
          </label>
          <input
            type="text"
            id="answer"
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="hint" className="block text-sm font-medium text-gray-700 mb-1">
            Hint (Optional)
          </label>
          <input
            type="text"
            id="hint"
            name="hint"
            value={formData.hint}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
            Publish Date
          </label>
          <input
            type="date"
            id="publishDate"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Only active questions will be displayed to users.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              if (initialQuestion?._id) {
                // Reset to initial values if editing
                setFormData({
                  question: initialQuestion?.question || '',
                  answer: initialQuestion?.answer || '',
                  hint: initialQuestion?.hint || '',
                  publishDate: initialQuestion?.publishDate 
                    ? new Date(initialQuestion.publishDate).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
                  active: initialQuestion?.active ?? true,
                });
              } else {
                // Clear form if creating new
                setFormData({
                  question: '',
                  answer: '',
                  hint: '',
                  publishDate: new Date().toISOString().split('T')[0],
                  active: true,
                });
              }
              setError(null);
              setSuccess(null);
            }}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            disabled={submitting}
          >
            Reset
          </button>
          
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : initialQuestion?._id ? 'Update Question' : 'Create Question'}
          </button>
        </div>
      </form>
    </div>
  );
}