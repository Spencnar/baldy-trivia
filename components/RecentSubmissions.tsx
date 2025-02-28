// components/RecentSubmissions.tsx
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Submission {
  _id: string;
  name: string;
  correct: boolean;
  createdAt: string;
}

export default function RecentSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/submission');
      
      if (!response.ok) {
        if (response.status !== 404) { // 404 might mean no question today
          setError('Failed to fetch recent submissions.');
        }
        return;
      }

      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      setError('An error occurred while fetching submissions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    
    // Set up polling every 30 seconds to get new submissions
    const interval = setInterval(fetchSubmissions, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && submissions.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error && submissions.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
        <p>No submissions yet. Be the first to answer!</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
      <ul className="space-y-2">
        {submissions.map((submission) => (
          <li 
            key={submission._id}
            className="flex items-center justify-between border-b pb-2"
          >
            <div className="flex items-center">
              <span className="mr-2 text-lg">
                {submission.correct ? '✅' : '❌'}
              </span>
              <span className="font-medium">{submission.name}</span>
            </div>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}