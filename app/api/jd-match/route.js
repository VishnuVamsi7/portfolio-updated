import { NextResponse } from 'next/server';
import { matchJD, enhancePitchWithLLM } from '../../lib/jd-matcher';

export async function POST(request) {
  try {
    const body = await request.json();
    const jdText = (body.jdText || body.message || '').trim();

    if (!jdText || jdText.length < 20) {
      return NextResponse.json(
        { error: 'Please paste a job description (at least 20 characters) or list 3–5 required skills.' },
        { status: 400 }
      );
    }

    if (jdText.length > 12000) {
      return NextResponse.json({ error: 'Job description is too long. Please paste up to ~12,000 characters.' }, { status: 400 });
    }

    let result = matchJD(jdText);
    // The LLM enhancer only ever sees the scored requirement table, never
    // the raw JD (untrusted text — see jd-matcher.js).
    result = await enhancePitchWithLLM(result.requirements, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('JD match error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze job description. Please try again.' },
      { status: 500 }
    );
  }
}
