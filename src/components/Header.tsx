import React from 'react';
import { Shield, Menu, X, ArrowLeft, Github, Twitter, Linkedin, LogOut, User } from 'lucide-react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  lastLogin?: Date;
  loginAttempts: number;
  isLocked: boolean;
}

interface HeaderProps {
  onBackClick?: () => void;
  currentTool?: string;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  user?: User | null;
  onLogout?: () => void;
}

function Header({ onBackClick, currentTool, sidebarOpen, setSidebarOpen, user, onLogout }: HeaderProps) {
  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-4">
            {onBackClick ? (
              <button
                onClick={onBackClick}
                className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <Shield className="w-6 h-6" />
                <span className="font-bold text-lg">Arya Security</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 text-green-400">
                <Shield className="w-6 h-6" />
                <span className="font-bold text-lg">Arya Security</span>
              </div>
            )}
            
            {currentTool && (
              <>
                <div className="hidden md:block text-gray-400">|</div>
                <div className="hidden md:block text-gray-300 font-medium">
                  {currentTool}
                </div>
              </>
            )}
          </div>

          {/* Center - Status Indicators */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">CVE Feed Active</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Arya Tools Online</span>
            </div>
            {user && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Secure Session</span>
              </div>
            )}
          </div>

          {/* Right Side - User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            {user && (
              <div className="hidden md:flex items-center space-x-3 bg-gray-700 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <div className="text-white font-medium">{user.username}</div>
                  <div className="text-gray-400 text-xs capitalize">{user.role}</div>
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="hidden md:flex items-center space-x-3">
              <a
                href="https://github.com/Arya182-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/ayush-gangwar-3b3526237/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Logout Button */}
            {user && onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline text-sm">Logout</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            {setSidebarOpen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-gray-400 hover:text-gray-300 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;