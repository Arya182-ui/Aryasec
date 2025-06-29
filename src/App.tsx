import React, { useState, useEffect } from 'react';
import { Shield, Globe, FileText, AlertTriangle, Menu, X, Wifi, Lock, Search, Bug, Zap, Eye, BookOpen, Activity, Network, Key, LogOut, Settings } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import SubdomainFinder from './components/SubdomainFinder';
import HeaderAnalyzer from './components/HeaderAnalyzer';
import CORSTester from './components/CORSTester';
import CVEDashboard from './components/CVEDashboard';
import PortScanner from './components/PortScanner';
import SSLAnalyzer from './components/SSLAnalyzer';
import SQLInjectionTester from './components/SQLInjectionTester';
import XSSScanner from './components/XSSScanner';
import Solutions from './components/Solutions';
import BlogSystem from './components/BlogSystem';
import NetworkMapper from './components/NetworkMapper';
import HashAnalyzer from './components/HashAnalyzer';
import AuthSystem from './components/AuthSystem';

type ToolType = 'dashboard' | 'subdomain' | 'headers' | 'cors' | 'cve' | 'ports' | 'ssl' | 'sqli' | 'xss' | 'solutions' | 'blog' | 'network' | 'hash' | 'admin';

interface Tool {
  id: ToolType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'dashboard' | 'reconnaissance' | 'vulnerability' | 'analysis' | 'solutions' | 'intelligence' | 'admin';
  requiresAuth?: boolean;
}

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  lastLogin?: Date;
  loginAttempts: number;
  isLocked: boolean;
}

const tools: Tool[] = [
  // {
  //   id: 'dashboard',
  //   name: 'Security Dashboard',
  //   description: 'Real-time security monitoring and threat intelligence',
  //   icon: <Activity className="w-6 h-6" />,
  //   color: 'from-blue-500 to-indigo-500',
  //   category: 'dashboard'
  // },
  {
    id: 'subdomain',
    name: 'Arya Subdomain Finder',
    description: 'Discover subdomains and attack surface',
    icon: <Globe className="w-6 h-6" />,
    color: 'from-cyan-500 to-blue-500',
    category: 'reconnaissance'
  },
  {
    id: 'network',
    name: 'Arya Network Mapper',
    description: 'Visualize network topology and devices',
    icon: <Network className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    category: 'reconnaissance'
  },
  {
    id: 'ports',
    name: 'Arya Port Scanner',
    description: 'Scan for open ports and services',
    icon: <Wifi className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-500',
    category: 'reconnaissance'
  },
  {
    id: 'headers',
    name: 'Arya Header Analyzer',
    description: 'Analyze security headers and misconfigurations',
    icon: <FileText className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    category: 'analysis'
  },
  {
    id: 'ssl',
    name: 'Arya SSL/TLS Analyzer',
    description: 'Test SSL/TLS configuration and certificates',
    icon: <Lock className="w-6 h-6" />,
    color: 'from-teal-500 to-cyan-500',
    category: 'analysis'
  },
  {
    id: 'hash',
    name: 'Arya Hash Analyzer',
    description: 'Calculate and verify file integrity hashes',
    icon: <Key className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-500',
    category: 'analysis'
  },
  {
    id: 'cors',
    name: 'Arya CORS Tester',
    description: 'Test CORS policies and identify misconfigurations',
    icon: <Shield className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    category: 'vulnerability'
  },
  {
    id: 'sqli',
    name: 'Arya SQL Injection Tester',
    description: 'Test for SQL injection vulnerabilities',
    icon: <Bug className="w-6 h-6" />,
    color: 'from-red-500 to-rose-500',
    category: 'vulnerability'
  },
  {
    id: 'xss',
    name: 'Arya XSS Scanner',
    description: 'Scan for Cross-Site Scripting vulnerabilities',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    category: 'vulnerability'
  },
  {
    id: 'cve',
    name: 'Arya CVE Dashboard',
    description: 'Real-time CVE monitoring and alerts',
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'from-orange-500 to-red-500',
    category: 'analysis'
  },
  {
    id: 'solutions',
    name: 'Arya Security Solutions',
    description: 'Remediation guides and security fixes',
    icon: <Eye className="w-6 h-6" />,
    color: 'from-emerald-500 to-green-500',
    category: 'solutions'
  },
  {
    id: 'blog',
    name: 'Security Intelligence Hub',
    description: 'Latest cybersecurity insights and research',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-blue-500 to-indigo-500',
    category: 'intelligence'
  },
  // {
  //   id: 'admin',
  //   name: 'Admin Panel',
  //   description: 'System administration and configuration',
  //   icon: <Settings className="w-6 h-6" />,
  //   color: 'from-red-500 to-pink-500',
  //   category: 'admin',
  //   requiresAuth: true
  // }
];

const blogPosts = [
  {
    id: '1',
    title: "The Evolution of Cybersecurity: From Reactive to Proactive Defense",
    excerpt: "In today's digital landscape, cybersecurity has evolved from simple antivirus solutions to comprehensive threat intelligence platforms. Organizations are shifting from reactive incident response to proactive threat hunting and prevention strategies.",
    date: "December 15, 2024",
    readTime: "8 min read",
    category: "Threat Intelligence"
  },
  {
    id: '2',
    title: "Zero-Day Vulnerabilities: The Silent Threat in Modern Applications",
    excerpt: "Zero-day vulnerabilities represent one of the most significant challenges in cybersecurity. These unknown security flaws can remain undetected for months or years, providing attackers with powerful tools for system compromise.",
    date: "December 12, 2024",
    readTime: "6 min read",
    category: "Vulnerability Research"
  },
  {
    id: '3',
    title: "Building Resilient Security Architecture: Lessons from Recent Breaches",
    excerpt: "Recent high-profile security breaches have taught us valuable lessons about building resilient security architectures. This analysis explores common failure points and provides actionable strategies for improving organizational security posture.",
    date: "December 10, 2024",
    readTime: "12 min read",
    category: "Security Architecture"
  },
  {
    id: '4',
    title: "The Rise of AI-Powered Cyber Attacks: Defending Against Intelligent Threats",
    excerpt: "Artificial Intelligence is revolutionizing both cyber attacks and defense mechanisms. As attackers leverage AI for sophisticated campaigns, security professionals must adapt their strategies to counter these intelligent threats.",
    date: "December 8, 2024",
    readTime: "10 min read",
    category: "AI Security"
  }
];

function App() {
  const [activeTool, setActiveTool] = useState<ToolType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | undefined>();
  const [user, setUser] = useState<User | null>(null);
  const [showAdminAuth, setShowAdminAuth] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem('secureSession');
      if (sessionData) {
        try {
          const session = JSON.parse(atob(sessionData));
          if (session.expires > Date.now()) {
            const sessionUser: User = {
              id: session.userId,
              username: session.username,
              role: session.role,
              lastLogin: new Date(),
              loginAttempts: 0,
              isLocked: false
            };
            setUser(sessionUser);
          } else {
            // Session expired
            localStorage.removeItem('secureSession');
          }
        } catch (error) {
          // Invalid session data
          localStorage.removeItem('secureSession');
        }
      }
    };

    checkSession();
  }, []);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setShowAdminAuth(false);
    setActiveTool('admin');
  };

  const handleAuthFailure = () => {
    setShowAdminAuth(false);
    setActiveTool('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('secureSession');
    setUser(null);
    setActiveTool('dashboard');
  };

  const handleToolSelection = (toolId: ToolType) => {
    const tool = tools.find(t => t.id === toolId);
    
    if (tool?.requiresAuth && !user) {
      // Show admin authentication for admin panel
      setShowAdminAuth(true);
      return;
    }
    
    setActiveTool(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderTool = () => {
    switch (activeTool) {
      case 'dashboard':
        return <Dashboard />;
      case 'subdomain':
        return <SubdomainFinder />;
      case 'headers':
        return <HeaderAnalyzer />;
      case 'cors':
        return <CORSTester />;
      case 'cve':
        return <CVEDashboard />;
      case 'ports':
        return <PortScanner />;
      case 'ssl':
        return <SSLAnalyzer />;
      case 'sqli':
        return <SQLInjectionTester />;
      case 'xss':
        return <XSSScanner />;
      case 'solutions':
        return <Solutions />;
      case 'blog':
        return <BlogSystem onBack={() => setActiveTool('dashboard')} selectedBlogId={selectedBlogId} />;
      case 'network':
        return <NetworkMapper />;
      case 'hash':
        return <HashAnalyzer />;
      case 'admin':
        return user ? (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-8 h-8 text-red-400" />
                <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
              </div>
              <p className="text-gray-400 text-lg">
                System administration and configuration dashboard
              </p>
            </div>
            
            <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-green-400" />
                <div>
                  <h2 className="text-xl font-semibold text-green-400">Welcome, {user.username}!</h2>
                  <p className="text-green-300">Admin access granted - Full system control available</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform Status</span>
                    <span className="text-green-400">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Security Tools</span>
                    <span className="text-green-400">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CVE Feed</span>
                    <span className="text-green-400">Live</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">User Management</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Users</span>
                    <span className="text-white">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Admin Users</span>
                    <span className="text-white">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Login</span>
                    <span className="text-white">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Security Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Scans Today</span>
                    <span className="text-blue-400">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Threats Blocked</span>
                    <span className="text-red-400">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Security Score</span>
                    <span className="text-green-400">A+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null;
      default:
        return <Dashboard />;
    }
  };

  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  // Show authentication screen only for admin panel
  if (showAdminAuth) {
    return (
      <AuthSystem 
        onAuthSuccess={handleAuthSuccess}
        onAuthFailure={handleAuthFailure}
      />
    );
  }

  // Show main application
  if (activeTool !== 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header 
          onBackClick={() => {
            setActiveTool('dashboard');
            setSelectedBlogId(undefined);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentTool={tools.find(t => t.id === activeTool)?.name}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          onLogout={handleLogout}
        />

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden bg-gray-800 border-b border-gray-700 px-4 py-3">
            <div className="space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    handleToolSelection(tool.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTool === tool.id
                      ? 'bg-green-900/20 text-green-400 border border-green-500/20'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tool.icon}
                  <span>{tool.name}</span>
                  {tool.requiresAuth && !user && (
                    <Lock className="w-4 h-4 text-yellow-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tool Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {renderTool()}
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header 
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Shield className="w-20 h-20 text-green-400" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">A</span>
                </div>
              </div>
            </div>
            <h1 className="text-6xl font-bold text-white mb-4">
              Arya <span className="text-green-400">Security</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Advanced cybersecurity platform by Developer Arya. Professional-grade tools for penetration testing, 
              vulnerability assessment, and security analysis with automated solutions and remediation guides.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Real-time CVE Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Automated Solutions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Professional Grade</span>
              </div>
            </div>
            
            {/* Welcome Message for Admin */}
            {user && (
              <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4 max-w-md mx-auto mb-8">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <Shield className="w-5 h-5" />
                  <span>Welcome back, {user.username}!</span>
                </div>
                <p className="text-green-300 text-sm mt-1">Admin access active - Full control granted</p>
              </div>
            )}
          </div>

          {/* Security Blog Section */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  🛡️ Arya's Security Intelligence Hub
                </h2>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                  Stay ahead of emerging threats with cutting-edge cybersecurity insights, vulnerability research, 
                  and defensive strategies from the frontlines of digital security.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post, index) => (
                  <div 
                    key={index} 
                    onClick={() => {
                      setSelectedBlogId(post.id);
                      setActiveTool('blog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-green-900/20 text-green-400 rounded-full text-xs font-medium border border-green-500/20">
                        {post.category}
                      </span>
                      <span className="text-gray-400 text-sm">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{post.date}</span>
                      <div className="text-green-400 text-sm font-medium">
                        Read More →
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <button 
                  onClick={() => {
                    setActiveTool('blog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  View All Security Articles
                </button>
              </div>
            </div>
          </div>

          {/* Tools Grid by Category */}
          <div className="max-w-7xl mx-auto space-y-12">
            {Object.entries(groupedTools).map(([category, categoryTools]) => (
              <div key={category}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2 capitalize">
                    {category === 'dashboard' && '📊 Command Center'}
                    {category === 'reconnaissance' && '🔍 Reconnaissance Arsenal'}
                    {category === 'vulnerability' && '🎯 Vulnerability Testing Suite'}
                    {category === 'analysis' && '📊 Security Analysis Tools'}
                    {category === 'solutions' && '🛠️ Solutions & Remediation'}
                    {category === 'intelligence' && '🧠 Threat Intelligence'}
                    {category === 'admin' && '⚙️ Administration'}
                  </h2>
                  <p className="text-gray-400">
                    {category === 'dashboard' && 'Real-time security monitoring and threat intelligence dashboard'}
                    {category === 'reconnaissance' && 'Gather intelligence and map attack surfaces with Arya\'s reconnaissance tools'}
                    {category === 'vulnerability' && 'Identify and exploit security weaknesses using advanced testing methodologies'}
                    {category === 'analysis' && 'Analyze configurations and security posture with comprehensive assessment tools'}
                    {category === 'solutions' && 'Fix vulnerabilities with guided remediation and automated security solutions'}
                    {category === 'intelligence' && 'Stay informed with the latest cybersecurity research and threat intelligence'}
                    {category === 'admin' && 'System administration and configuration management'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => handleToolSelection(tool.id)}
                      className="group cursor-pointer"
                    >
                      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative`}>
                          {tool.icon}
                          {tool.requiresAuth && !user && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Lock className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {tool.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          {tool.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-green-400 text-sm font-medium">
                            {tool.requiresAuth && !user ? 'Admin Access' : 'Launch Tool'}
                            <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                          </div>
                          <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Advanced Security Testing Platform by Arya
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Built for security professionals, penetration testers, and developers who need comprehensive tools 
              for security assessment, vulnerability research, and automated remediation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-400">All tools run locally. No data sent to external servers.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Updates</h3>
              <p className="text-gray-400">Live CVE feeds and instant vulnerability detection.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bug className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Automated Solutions</h3>
              <p className="text-gray-400">Get instant remediation guides for discovered vulnerabilities.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Professional Grade</h3>
              <p className="text-gray-400">Enterprise-level tools for comprehensive security testing.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
