// app/api/question/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import { getCurrentUser } from '@/lib/auth';

// GET - Get today's question
export async function GET() {
  try {
    await dbConnect();

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the question for today
    const question = await Question.findOne({
      publishDate: { $lte: today },
      active: true,
    })
      .sort({ publishDate: -1 })
      .select('-answer'); // Don't send the answer to the client

    if (!question) {
      return NextResponse.json({ message: 'No question available today' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching today\'s question:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new question (admin only)
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/question - started");
    const currentUser = await getCurrentUser();
    
    // Add more detailed logging
    console.log("Current user:", currentUser ? JSON.stringify({
      id: currentUser.id,
      email: currentUser.email,
      isAdmin: currentUser.isAdmin
    }) : "No user found");
    
    // Verify admin access
    if (!currentUser?.isAdmin) {
      console.log("Unauthorized: User is not admin");
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    console.log("Request data:", JSON.stringify(data));
    
    // Validate required fields
    if (!data.question || !data.answer || !data.publishDate) {
      return NextResponse.json(
        { message: 'Question, answer, and publishDate are required' },
        { status: 400 }
      );
    }

    // Create new question
    const newQuestion = await Question.create({
      question: data.question,
      answer: data.answer,
      hint: data.hint,
      publishDate: new Date(data.publishDate),
      active: data.active !== undefined ? data.active : true,
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}