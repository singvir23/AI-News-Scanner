import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('API route hit - received request');
  try {
    console.log('Parsing request body...');
    const body = await request.json();
    console.log('Request body:', body);
    const { prompt } = body;
    
    console.log('Initializing OpenAI with prompt:', prompt);
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    console.log('Making OpenAI API call...');
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // or gpt-3.5-turbo for faster, cheaper responses
      messages: [
        { role: "system", content: "You are a helpful assistant specializing in news analysis and information retrieval." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
    });
    
    console.log('Received OpenAI response');
    // Return the response
    return NextResponse.json({ 
      message: completion.choices[0].message.content 
    });
    
  } catch (error) {
    console.error('Detailed error in API route:', error);
    return NextResponse.json(
      { error: 'Error processing your request: ' + error.message },
      { status: 500 }
    );
  }
}