import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromImage } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { imageData, mimeType } = await request.json();

    if (!imageData || !mimeType) {
      return NextResponse.json(
        { error: 'Missing image data or mime type' },
        { status: 400 }
      );
    }

    const extractedText = await extractTextFromImage(imageData, mimeType);

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error('OCR API error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
