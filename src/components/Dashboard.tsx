import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, AlertTriangle, Activity, Users, Globe, Lock, Zap, Eye, Database, Clock, CheckCircle } from 'lucide-react';

interface SecurityMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface ThreatAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: Date;
  source: string;
}

interface ScanActivity {
  id: string;
  tool: string;
  target: string;
  status: 'completed' | 'running' | 'failed';
  timestamp: Date;
  findings: number;
}

function Dashboard() {
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [threats, setThreats] = useState<ThreatAlert[]>([]);
  const [activities, setActivities] = useState<ScanActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time data loading
    const loadDashboardData = () => {
      // Security Metrics
      setMetrics([
        {
          label: 'Active Threats',
          value: Math.floor(Math.random() * 50) + 10,
          change: Math.floor(Math.random() * 20) - 10,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          color: 'text-red-400'
        },
        {
          label: 'Vulnerabilities Found',
          value: Math.floor(Math.random() * 200) + 50,
          change: Math.floor(Math.random() * 30) - 15,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          color: 'text-orange-400'
        },
        {
          label: 'Scans Completed',
          value: Math.floor(Math.random() * 1000) + 500,
          change: Math.floor(Math.random() * 50) + 10,
          trend: 'up',
          color: 'text-green-400'
        },
        {
          label: 'Security Score',
          value: Math.floor(Math.random() * 30) + 70,
          change: Math.floor(Math.random() * 10) - 5,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          color: 'text-blue-400'
        }
      ]);

      // Recent Threats
      setThreats([
        {
          id: '1',
          type: 'critical',
          title: 'Zero-Day Exploit Detected',
          description: 'New vulnerability in Apache HTTP Server affecting versions 2.4.49-2.4.50',
          timestamp: new Date(Date.now() - Math.random() * 3600000),
          source: 'CVE-2024-0001'
        },
        {
          id: '2',
          type: 'high',
          title: 'SQL Injection Attempt',
          description: 'Multiple SQL injection attempts detected on login endpoints',
          timestamp: new Date(Date.now() - Math.random() * 7200000),
          source: 'WAF Logs'
        },
        {
          id: '3',
          type: 'medium',
          title: 'Suspicious Port Scan',
          description: 'Automated port scanning detected from multiple IP addresses',
          timestamp: new Date(Date.now() - Math.random() * 10800000),
          source: 'IDS Alert'
        }
      ]);

      // Recent Activities
      setActivities([
        {
          id: '1',
          tool: 'Subdomain Finder',
          target: 'example.com',
          status: 'completed',
          timestamp: new Date(Date.now() - Math.random() * 1800000),
          findings: Math.floor(Math.random() * 20) + 5
        },
        {
          id: '2',
          tool: 'Port Scanner',
          target: '192.168.1.1',
          status: 'running',
          timestamp: new Date(Date.now() - Math.random() * 900000),
          findings: 0
        },
        {
          id: '3',
          tool: 'XSS Scanner',
          target: 'testsite.com',
          status: 'completed',
          timestamp: new Date(Date.now() - Math.random() * 3600000),
          findings: Math.floor(Math.random() * 10) + 2
        }
      ]);

      setLoading(false);
    };

    loadDashboardData();
    
    // Update metrics every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getThreatColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-900/20 text-red-400';
      case 'high': return 'border-orange-500 bg-orange-900/20 text-orange-400';
      case 'medium': return 'border-yellow-500 bg-yellow-900/20 text-yellow-400';
      case 'low': return 'border-blue-500 bg-blue-900/20 text-blue-400';
      default: return 'border-gray-500 bg-gray-700 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'running': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-700 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
            <p className="text-gray-400">Real-time security monitoring and threat intelligence</p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-300">Live Monitoring Active</span>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm">{metric.label}</div>
              <div className={`flex items-center space-x-1 text-xs ${
                metric.trend === 'up' ? 'text-green-400' : 
                metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}>
                <TrendingUp className={`w-3 h-3 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>
            <div className={`text-3xl font-bold ${metric.color} mb-2`}>
              {metric.value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {metric.trend === 'up' ? 'Increased' : metric.trend === 'down' ? 'Decreased' : 'No change'} from last hour
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Threat Alerts */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span>Live Threat Alerts</span>
                </h2>
                <div className="text-sm text-gray-400">Last updated: {new Date().toLocaleTimeString()}</div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {threats.map((threat) => (
                  <div key={threat.id} className={`p-4 rounded-lg border ${getThreatColor(threat.type)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{threat.title}</h3>
                        <p className="text-sm text-gray-300 mt-1">{threat.description}</p>
                      </div>
                      <div className="text-xs px-2 py-1 rounded bg-gray-900/50 text-gray-300">
                        {threat.type.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Source: {threat.source}</span>
                      <span>{threat.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 mb-6">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <span>Recent Scans</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <div className="text-white font-medium text-sm">{activity.tool}</div>
                      <div className="text-gray-400 text-xs">{activity.target}</div>
                      <div className="text-gray-500 text-xs">{activity.timestamp.toLocaleTimeString()}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </div>
                      {activity.status === 'completed' && (
                        <div className="text-xs text-gray-400">{activity.findings} findings</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Quick Actions</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Quick Subdomain Scan
                </button>
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Security Headers Check
                </button>
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200">
                  <Lock className="w-4 h-4 inline mr-2" />
                  SSL/TLS Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Score Chart */}
      <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span>Security Posture Overview</span>
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">A+</div>
              <div className="text-gray-400 text-sm">Overall Security Grade</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">847</div>
              <div className="text-gray-400 text-sm">Total Scans This Month</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">23</div>
              <div className="text-gray-400 text-sm">Active Monitoring Targets</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;