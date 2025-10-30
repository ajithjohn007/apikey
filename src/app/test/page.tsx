'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/init');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'testpassword123'
        })
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Key Manager - Test Page</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testDatabase}
            disabled={loading}
            className="btn btn-primary mr-4"
          >
            {loading ? 'Testing...' : 'Test Database Init'}
          </button>
          
          <button
            onClick={testAuth}
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? 'Testing...' : 'Test Auth Registration'}
          </button>
        </div>

        {result && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Test Result</h3>
            </div>
            <div className="card-body">
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {result}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold">Quick Start Guide</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Test Database Init" to initialize the database</li>
            <li>Click "Test Auth Registration" to test user registration</li>
            <li>Go to <a href="/login" className="text-primary-600 hover:underline">/login</a> to sign in</li>
            <li>Go to <a href="/dashboard" className="text-primary-600 hover:underline">/dashboard</a> to manage API keys</li>
            <li>Go to <a href="/analytics" className="text-primary-600 hover:underline">/analytics</a> to view usage statistics</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
