// app/api/submission/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import Submission from '@/models/Submission';

// POST - Submit an answer
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Validate required fields
    if (!data.questionId || !data.name || !data.answer) {
      return NextResponse.json(
        { message: 'QuestionId, name, and answer are required' },
        { status: 400 }
      );
    }

    // Find the question
    const question = await Question.findById(data.questionId);
    
    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    // Check if user has already submitted an answer for this question
    const existingSubmission = await Submission.findOne({
      questionId: data.questionId,
      name: data.name,
    });

    if (existingSubmission) {
      return NextResponse.json(
        { message: 'You have already submitted an answer for this question' },
        { status: 400 }
      );
    }

    // Check if the answer is correct (case insensitive)
    const isCorrect = data.answer.trim().toLowerCase() === question.answer.trim().toLowerCase();

    // Create new submission
    const newSubmission = await Submission.create({
      questionId: data.questionId,
      name: data.name,
      answer: data.answer,
      correct: isCorrect,
    });

    return NextResponse.json({
      correct: isCorrect,
      submission: {
        id: newSubmission._id,
        name: newSubmission.name,
        createdAt: newSubmission.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// GET - Get submissions for today's question (recent ones only)
export async function GET() {
  try {
    await dbConnect();

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the question for today
    const todayQuestion = await Question.findOne({
      publishDate: { $lte: today },
      active: true,
    }).sort({ publishDate: -1 });

    if (!todayQuestion) {
      return NextResponse.json({ message: 'No question available today' }, { status: 404 });
    }

    // Get recent submissions for this question
    const submissions = await Submission.find({ questionId: todayQuestion._id })
      .select('name correct createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}