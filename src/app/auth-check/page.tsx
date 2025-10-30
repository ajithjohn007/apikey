'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCheckPage() {
  const [authStatus, setAuthStatus] = useState('Loading...');
  const [userData, setUserData] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    setDebugInfo({
      token: token ? 'Present' : 'Missing',
      userData: user ? 'Present' : 'Missing',
      currentUrl: window.location.href
    });
    
    if (!token) {
      setAuthStatus('❌ No token found');
      return;
    }
    
    if (!user) {
      setAuthStatus('❌ No user data found');
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
      setAuthStatus('✅ Authentication data found');
    } catch (error) {
      setAuthStatus('❌ Error parsing user data: ' + error);
    }
  }, []);

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthStatus('');
    setUserData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Check</h1>
        
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Authentication Status</h3>
          </div>
          <div className="card-body">
            <p className="text-lg mb-4">{authStatus}</p>
            
            {userData && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">User Data:</h4>
                <pre className="text-sm">{JSON.stringify(userData, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        <div className="space-x-4">
          <button onClick={goToDashboard} className="btn btn-primary">
            Go to Dashboard
          </button>
          <button onClick={clearAuth} className="btn btn-danger">
            Clear Authentication
          </button>
          <a href="/login" className="btn btn-secondary">
            Go to Login
          </a>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Debug Information</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Token:</strong> {debugInfo.token || 'Loading...'}</p>
            <p><strong>User Data:</strong> {debugInfo.userData || 'Loading...'}</p>
            <p><strong>Current URL:</strong> {debugInfo.currentUrl || 'Loading...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
