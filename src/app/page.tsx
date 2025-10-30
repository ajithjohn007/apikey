'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Key, Shield, BarChart3, Zap } from 'lucide-react';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
          router.push('/dashboard');
        } else {
          setLoading(false);
        }
      }
    };

    // Small delay to prevent hydration issues
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Key className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">API Key Manager</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link href="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Secure API Key Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Store, rotate, and monitor your API keys with enterprise-grade security. 
            Get instant access to your keys with comprehensive analytics and alerts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn btn-primary text-lg px-8 py-3">
              Start Free Trial
            </Link>
            <Link href="/login" className="btn btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to manage API keys
          </h2>
          <p className="text-lg text-gray-600">
            Built with security and developer experience in mind
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card">
            <div className="card-body text-center">
              <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
              <p className="text-gray-600">
                Your API keys are encrypted at rest and in transit with industry-standard encryption.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <Zap className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Rotation</h3>
              <p className="text-gray-600">
                Rotate your API keys instantly with a single click. No downtime, no hassle.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <BarChart3 className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics & Monitoring</h3>
              <p className="text-gray-600">
                Track usage patterns, monitor performance, and get insights into your API key usage.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <Key className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
              <p className="text-gray-600">
                Simple REST API to fetch and manage your keys programmatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to secure your API keys?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of developers who trust our platform
            </p>
            <Link href="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
              Get Started Now
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Key className="h-8 w-8 text-primary-400 mx-auto mb-4" />
            <p className="text-gray-400">
              © 2024 API Key Manager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
