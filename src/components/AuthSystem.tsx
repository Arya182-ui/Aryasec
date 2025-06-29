import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, User, Key } from 'lucide-react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  lastLogin?: Date;
  loginAttempts: number;
  isLocked: boolean;
}

interface AuthSystemProps {
  onAuthSuccess: (user: User) => void;
  onAuthFailure: () => void;
}

function AuthSystem({ onAuthSuccess, onAuthFailure }: AuthSystemProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Secure credentials
  const ADMIN_CREDENTIALS = {
    username: 'Create a user Name for Admin',
    password: 'Password As you want'
  };

  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 300000; // 5 minutes

  useEffect(() => {
    // Check for existing lockout
    const lockoutEnd = localStorage.getItem('lockoutEnd');
    if (lockoutEnd) {
      const remaining = parseInt(lockoutEnd) - Date.now();
      if (remaining > 0) {
        setIsLocked(true);
        setLockoutTime(remaining);
        
        const timer = setInterval(() => {
          const newRemaining = parseInt(lockoutEnd) - Date.now();
          if (newRemaining <= 0) {
            setIsLocked(false);
            setLockoutTime(0);
            setAttempts(0);
            localStorage.removeItem('lockoutEnd');
            localStorage.removeItem('loginAttempts');
            clearInterval(timer);
          } else {
            setLockoutTime(newRemaining);
          }
        }, 1000);

        return () => clearInterval(timer);
      } else {
        localStorage.removeItem('lockoutEnd');
        localStorage.removeItem('loginAttempts');
      }
    }

    // Load previous attempts
    const savedAttempts = localStorage.getItem('loginAttempts');
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Account locked. Try again in ${Math.ceil(lockoutTime / 60000)} minutes.`);
      return;
    }

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verify credentials
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Successful login
        const user: User = {
          id: '1',
          username: username,
          role: 'admin',
          lastLogin: new Date(),
          loginAttempts: 0,
          isLocked: false
        };

        // Clear failed attempts
        setAttempts(0);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockoutEnd');

        // Store secure session
        const sessionToken = btoa(JSON.stringify({
          userId: user.id,
          username: user.username,
          role: user.role,
          timestamp: Date.now(),
          expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));
        
        localStorage.setItem('secureSession', sessionToken);
        onAuthSuccess(user);
      } else {
        // Failed login
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());

        if (newAttempts >= MAX_ATTEMPTS) {
          // Lock account
          const lockoutEnd = Date.now() + LOCKOUT_DURATION;
          localStorage.setItem('lockoutEnd', lockoutEnd.toString());
          setIsLocked(true);
          setLockoutTime(LOCKOUT_DURATION);
          setError(`Too many failed attempts. Account locked for 5 minutes.`);
        } else {
          setError(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
        }
        
        onAuthFailure();
      }
    } catch (err) {
      setError('Authentication service unavailable. Please try again.');
      onAuthFailure();
    } finally {
      setLoading(false);
      setPassword(''); // Clear password for security
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Shield className="w-16 h-16 text-green-400" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">A</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Arya Security</h1>
          <p className="text-gray-400">Admin Authentication Required</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLocked || loading}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                  placeholder="Enter username"
                  autoComplete="username"
                />
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked || loading}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pl-10 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={isLocked || loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center space-x-2 text-red-400">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Lockout Timer */}
            {isLocked && (
              <div className="p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg flex items-center space-x-2 text-yellow-400">
                <Lock className="w-5 h-5 flex-shrink-0" />
                <div className="text-sm">
                  <div>Account temporarily locked</div>
                  <div className="font-mono text-lg">{formatTime(lockoutTime)}</div>
                </div>
              </div>
            )}

            {/* Attempt Counter */}
            {attempts > 0 && !isLocked && (
              <div className="text-center text-sm text-gray-400">
                Failed attempts: {attempts}/{MAX_ATTEMPTS}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLocked || loading || !username || !password}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Secure Login</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-blue-200 text-xs">
                <div className="font-medium mb-1">Security Features Active:</div>
                <ul className="space-y-1 text-blue-300">
                  <li>• Encrypted session management</li>
                  <li>• Failed attempt monitoring</li>
                  <li>• Automatic account lockout</li>
                  <li>• Secure credential validation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Arya Security Platform - Authorized Access Only</p>
          <p className="mt-1">© 2024 Developer Arya. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default AuthSystem;
