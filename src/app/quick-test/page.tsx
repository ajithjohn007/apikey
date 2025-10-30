'use client';

import { useState } from 'react';

export default function QuickTestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing login...');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword123'
        }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setResult(prev => prev + '\n\n✅ Login successful! Data stored in localStorage.');
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const goToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const clearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setResult('Storage cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Quick Test Page</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testLogin}
            disabled={loading}
            className="btn btn-primary mr-4"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
          
          <button
            onClick={goToDashboard}
            className="btn btn-secondary mr-4"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={clearStorage}
            className="btn btn-danger"
          >
            Clear Storage
          </button>
        </div>

        {result && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Test Result</h3>
            </div>
            <div className="card-body">
              <pre className="bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Test Login" to verify the API works</li>
            <li>If successful, click "Go to Dashboard"</li>
            <li>If you get stuck, click "Clear Storage" and try again</li>
            <li>Check browser console (F12) for any errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
