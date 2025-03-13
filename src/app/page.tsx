'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    console.log('Making fetch request to /api');
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      
      console.log('Received response with status:', res.status);
      console.log('Response headers:', Object.fromEntries([...res.headers]));
      
      // Try to get the raw text first
      const rawText = await res.text();
      console.log('Raw response text:', rawText);
      
      // Only try to parse as JSON if it looks like JSON
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        setError('Received invalid JSON response from server');
        setLoading(false);
        return;
      }
      
      if (res.ok) {
        setResponse(data.message);
      } else {
        setError(data.error || 'Something went wrong');
        console.error('Error from API:', data);
      }
    } catch (err) {
      console.error('Fetch error details:', err);
      setError('Failed to communicate with the server: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-50">
      <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">AI News Scanner</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-black mb-1">
              Enter your question or topic
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              rows={4}
              placeholder="What would you like to know about?"
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 transition-colors"
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
        
        {response && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Response:</h2>
            <div className="p-4 bg-gray-100 rounded-md whitespace-pre-line text-black">
              {response}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}