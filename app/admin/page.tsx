// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Question {
  _id: string;
  question: string;
  publishDate: string;
  active: boolean;
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function AdminDashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/questions?page=${page}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setPagination(data.pagination);
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
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchQuestions(newPage);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <Link
          href="/admin/add-question"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Question
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 p-4 rounded-md text-red-800 mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Questions</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your daily trivia questions
          </p>
        </div>
        
        {loading && questions.length === 0 ? (
          <div className="p-4 text-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className="px-4 py-5 text-center">
            <p>No questions found. Add your first question!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publish Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((question) => (
                  <tr key={question._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="truncate max-w-xs">
                        {question.question}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(question.publishDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        question.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {question.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/edit-question/${question._id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this question?')) {
                            try {
                              const response = await fetch(`/api/question/${question._id}`, {
                                method: 'DELETE',
                              });
                              
                              if (!response.ok) {
                                throw new Error('Failed to delete question');
                              }
                              
                              // Refresh the list
                              fetchQuestions(pagination.page);
                            } catch (err) {
                              console.error('Error deleting question:', err);
                              alert('Failed to delete question');
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.page === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}