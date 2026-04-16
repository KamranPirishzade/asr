import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const myResponse = `Example response for audio with ID: ${id}`;
    return NextResponse.json(myResponse, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to load recording';
    return NextResponse.json(
      { error: message },
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};
