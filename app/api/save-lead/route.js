import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // This route is now just a fallback for the client-side storage
    return NextResponse.json({ message: 'Lead saved successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error saving lead' },
      { status: 500 }
    );
  }
}