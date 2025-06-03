"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth';

export default function AuthTest() {
  const { user, login, register, logout, isLoading, error } = useAuth();
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('password123');
  const [testName, setTestName] = useState('Test User');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleRegisterTest = async () => {
    try {
      setTestResult('Registering user...');
      setSuccess(null);
      await register(testName, testEmail, testPassword);
      setTestResult('Registration successful!');
      setSuccess(true);
    } catch (error) {
      setTestResult(`Registration failed: ${error}`);
      setSuccess(false);
    }
  };

  const handleLoginTest = async () => {
    try {
      setTestResult('Logging in...');
      setSuccess(null);
      await login(testEmail, testPassword);
      setTestResult('Login successful!');
      setSuccess(true);
    } catch (error) {
      setTestResult(`Login failed: ${error}`);
      setSuccess(false);
    }
  };

  const handleLogoutTest = async () => {
    try {
      setTestResult('Logging out...');
      setSuccess(null);
      await logout();
      setTestResult('Logout successful!');
      setSuccess(true);
    } catch (error) {
      setTestResult(`Logout failed: ${error}`);
      setSuccess(false);
    }
  };

  useEffect(() => {
    if (error) {
      setTestResult(`Error: ${error}`);
      setSuccess(false);
    }
  }, [error]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Auth State</h2>
        <div className="bg-white p-4 rounded shadow-sm">
          <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-48">
            {JSON.stringify({ user, isLoading, error }, null, 2)}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Register Test</h2>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          <button
            onClick={handleRegisterTest}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            Test Register
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Login Test</h2>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          <button
            onClick={handleLoginTest}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-green-300"
          >
            Test Login
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Logout Test</h2>
          <p className="mb-4">Click the button below to test the logout functionality.</p>
          <button
            onClick={handleLogoutTest}
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:bg-red-300"
          >
            Test Logout
          </button>
        </div>
      </div>

      {testResult && (
        <div className={`mt-8 p-4 rounded-lg ${success ? 'bg-green-100 text-green-800' : success === false ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
          <h3 className="font-semibold mb-2">Test Result</h3>
          <p>{testResult}</p>
        </div>
      )}
    </div>
  );
}
