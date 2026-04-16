import { db } from '@/lib/db/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    return NextResponse.json(
      {
        data: [
          { audio: 'example_audio.mp3', transcript: 'Example transcript' },
          { audio: 'example_audio.mp3', transcript: 'Example transcript' },
          { audio: 'example_audio.mp3', transcript: 'Example transcript' },
          { audio: 'example_audio.mp3', transcript: 'Example transcript' },
          { audio: 'example_audio.mp3', transcript: 'Example transcript' },
          { audio: 'example_audio.mp3', transcript: 'Example transcript' },
        ],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to load recordings';
    return NextResponse.json(
      { error: message },
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { audio, transcript } = await req.json();
    return NextResponse.json(
      { message: 'Recording added successfully', audio, transcript },
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to add recording';
    return NextResponse.json(
      { error: message },
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};
