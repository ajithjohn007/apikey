'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
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
        alert('Login successful! Check console for details.');
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Debug User',
          email: 'debug@example.com',
          password: 'debugpassword123'
        }),
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
        <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testLogin}
            disabled={loading}
            className="btn btn-primary mr-4"
          >
            {loading ? 'Testing...' : 'Test Login (test@example.com)'}
          </button>
          
          <button
            onClick={testRegistration}
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? 'Testing...' : 'Test Registration'}
          </button>
        </div>

        {result && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">API Response</h3>
            </div>
            <div className="card-body">
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {result}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold">Quick Test Credentials</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p><strong>Email:</strong> test@example.com</p>
            <p><strong>Password:</strong> testpassword123</p>
          </div>
          
          <h2 className="text-2xl font-bold">Steps to Test</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Click "Test Login" to verify the API works</li>
            <li>If successful, go to <a href="/login" className="text-blue-600 hover:underline">/login</a></li>
            <li>Use the credentials above to sign in</li>
            <li>Check browser console (F12) for any errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
