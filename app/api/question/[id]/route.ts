import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import { getCurrentUser } from '@/lib/auth';

// GET - Get single question by ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    // Verify admin access
    if (!currentUser?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const question = await Question.findById(params.id);

    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update question (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    // Verify admin access
    if (!currentUser?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    
    const updatedQuestion = await Question.findByIdAndUpdate(
      params.id,
      {
        question: data.question,
        answer: data.answer,
        hint: data.hint,
        publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
        active: data.active,
      },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove question (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    
    // Verify admin access
    if (!currentUser?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const deletedQuestion = await Question.findByIdAndDelete(params.id);

    if (!deletedQuestion) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}