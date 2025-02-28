// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import QuestionDisplay from '@/components/QuestionDisplay';
import SubmissionForm from '@/components/SubmissionForm';
import RecentSubmissions from '@/components/RecentSubmissions';

export default function Home() {
  const [todayQuestion, setTodayQuestion] = useState(null);
  const [refreshSubmissions, setRefreshSubmissions] = useState(0);

  useEffect(() => {
    async function fetchTodaysQuestion() {
      try {
        const response = await fetch('/api/question');
        
        if (response.ok) {
          const data = await response.json();
          setTodayQuestion(data);
        }
      } catch (err) {
        console.error('Error fetching today\'s question:', err);
      }
    }

    fetchTodaysQuestion();
  }, []);

  const handleSubmissionComplete = () => {
    // Trigger a refresh of the submissions list
    setRefreshSubmissions(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Baldy Trivia Challenge</h1>
        <p className="text-gray-600">Test your knowledge with a new question every day!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <QuestionDisplay />
          
          {todayQuestion && (
            <SubmissionForm 
              question={todayQuestion} 
              onSubmissionComplete={handleSubmissionComplete} 
            />
          )}
        </div>
        
        <div>
          <RecentSubmissions key={refreshSubmissions} />
        </div>
      </div>
    </div>
  )
}