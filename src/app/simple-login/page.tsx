'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('testpassword123');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    console.log('=== LOGIN ATTEMPT START ===');
    console.log('Email:', email);
    console.log('Password:', password);

    try {
      console.log('Making API request...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        console.log('Login successful! Storing data...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Data stored, redirecting...');
        setResult('✅ Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        console.log('Login failed:', data.message);
        setResult('❌ Login failed: ' + data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setResult('❌ Error: ' + error);
    } finally {
      setLoading(false);
      console.log('=== LOGIN ATTEMPT END ===');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Simple Login Test</h1>
        
        <form onSubmit={handleLogin} className="card">
          <div className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800">{result}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Open browser console (F12) to see detailed logs
          </p>
        </div>
      </div>
    </div>
  );
}
