// app/api/admin/questions/route.ts - for admin to get all questions
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    // Verify admin access
    if (!currentUser?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get questions with pagination
    const questions = await Question.find()
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Question.countDocuments();

    return NextResponse.json({
      questions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}