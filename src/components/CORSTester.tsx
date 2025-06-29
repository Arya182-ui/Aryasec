import React, { useState } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, XCircle, Globe, Lock } from 'lucide-react';

interface CORSTest {
  origin: string;
  method: string;
  headers?: string[];
}

interface CORSResult {
  test: CORSTest;
  allowed: boolean;
  actualOrigin?: string;
  actualMethods?: string[];
  actualHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
  vulnerability?: string;
  severity: 'high' | 'medium' | 'low' | 'info';
}

interface CORSAnalysis {
  url: string;
  results: CORSResult[];
  overallSecurity: 'secure' | 'warning' | 'vulnerable';
  recommendations: string[];
}

const commonOrigins = [
  'https://evil.com',
  'http://localhost:3000',
  'null',
  'https://attacker.example.com',
  'https://subdomain.target.com'
];

const commonMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];

function CORSTester() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<CORSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testCORS = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      // Simulate CORS testing (in production, this would be done server-side)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock CORS analysis results
      const results: CORSResult[] = [];
      
      // Test different origins
      commonOrigins.forEach(origin => {
        commonMethods.forEach(method => {
          const isVulnerable = Math.random() > 0.7; // Random for demo
          const allowed = method === 'GET' || isVulnerable;
          
          let vulnerability = '';
          let severity: 'high' | 'medium' | 'low' | 'info' = 'info';
          
          if (allowed && origin === 'https://evil.com') {
            vulnerability = 'Allows requests from untrusted origins';
            severity = 'high';
          } else if (allowed && origin === 'null') {
            vulnerability = 'Accepts null origin (potential for exploitation)';
            severity = 'medium';
          } else if (allowed && method === 'DELETE') {
            vulnerability = 'Allows destructive operations from cross-origin';
            severity = 'high';
          }

          results.push({
            test: { origin, method },
            allowed,
            actualOrigin: allowed ? origin : undefined,
            actualMethods: allowed ? [method] : undefined,
            credentials: Math.random() > 0.5,
            vulnerability,
            severity
          });
        });
      });

      // Determine overall security
      const highVulns = results.filter(r => r.severity === 'high' && r.allowed).length;
      const mediumVulns = results.filter(r => r.severity === 'medium' && r.allowed).length;
      
      let overallSecurity: 'secure' | 'warning' | 'vulnerable' = 'secure';
      if (highVulns > 0) overallSecurity = 'vulnerable';
      else if (mediumVulns > 0) overallSecurity = 'warning';

      // Generate recommendations
      const recommendations = [];
      if (highVulns > 0) {
        recommendations.push('Restrict CORS to trusted origins only');
        recommendations.push('Avoid using wildcard (*) for Access-Control-Allow-Origin');
      }
      if (mediumVulns > 0) {
        recommendations.push('Review null origin handling');
        recommendations.push('Implement proper preflight request validation');
      }
      if (results.some(r => r.credentials)) {
        recommendations.push('Be cautious with Access-Control-Allow-Credentials');
      }
      
      recommendations.push('Regularly audit your CORS configuration');
      recommendations.push('Use specific origins instead of broad patterns');

      setAnalysis({
        url: url.startsWith('http') ? url : `https://${url}`,
        results: results.slice(0, 15), // Limit results for demo
        overallSecurity,
        recommendations
      });
    } catch (err) {
      setError('Failed to test CORS configuration');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-900/20 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-700 border-gray-600';
    }
  };

  const getSecurityIcon = (security: string) => {
    switch (security) {
      case 'secure': return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'vulnerable': return <XCircle className="w-6 h-6 text-red-400" />;
      default: return <Shield className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">CORS Tester</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Test Cross-Origin Resource Sharing (CORS) policies and identify potential security issues
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
              Target URL/API Endpoint
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && testCORS()}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={testCORS}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Testing...' : 'Test CORS'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center space-x-2 text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      {(loading || analysis) && (
        <div className="space-y-6">
          {/* Overall Security Status */}
          {analysis && (
            <div className={`rounded-xl p-6 border ${
              analysis.overallSecurity === 'secure' ? 'bg-green-900/20 border-green-500/20' :
              analysis.overallSecurity === 'warning' ? 'bg-yellow-900/20 border-yellow-500/20' :
              'bg-red-900/20 border-red-500/20'
            }`}>
              <div className="flex items-center space-x-4 mb-4">
                {getSecurityIcon(analysis.overallSecurity)}
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    CORS Security Status: {analysis.overallSecurity.charAt(0).toUpperCase() + analysis.overallSecurity.slice(1)}
                  </h2>
                  <p className="text-gray-300">
                    {analysis.overallSecurity === 'secure' && 'CORS configuration appears secure'}
                    {analysis.overallSecurity === 'warning' && 'Some potential CORS issues detected'}
                    {analysis.overallSecurity === 'vulnerable' && 'Critical CORS vulnerabilities found'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Test Results */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">CORS Test Results</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : analysis ? (
                <div className="space-y-3">
                  {analysis.results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        result.allowed && result.vulnerability
                          ? getSeverityColor(result.severity)
                          : result.allowed
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-gray-800 border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {result.allowed ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <div className="flex items-center space-x-2">
                              <code className="text-sm font-mono text-white bg-gray-900 px-2 py-1 rounded">
                                {result.test.method}
                              </code>
                              <span className="text-gray-400">from</span>
                              <code className="text-sm font-mono text-cyan-300 bg-gray-900 px-2 py-1 rounded">
                                {result.test.origin}
                              </code>
                            </div>
                            {result.credentials && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Lock className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs text-yellow-400">Credentials allowed</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            result.allowed ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            {result.allowed ? 'Allowed' : 'Blocked'}
                          </div>
                          {result.vulnerability && (
                            <div className={`text-xs capitalize ${
                              result.severity === 'high' ? 'text-red-400' :
                              result.severity === 'medium' ? 'text-yellow-400' :
                              'text-blue-400'
                            }`}>
                              {result.severity} risk
                            </div>
                          )}
                        </div>
                      </div>
                      {result.vulnerability && (
                        <div className="mt-2 p-2 bg-gray-900/50 rounded text-sm">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                            <span className="text-orange-300">{result.vulnerability}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Recommendations */}
          {analysis && (
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Recommendations</span>
              </h3>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-blue-200 text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-purple-900/10 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-3">About CORS Testing</h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>• CORS controls which origins can make requests to your API from web browsers</p>
          <p>• Misconfigured CORS can lead to unauthorized access to sensitive data</p>
          <p>• Always specify exact origins instead of using wildcards in production</p>
          <p>• Be especially careful with credentials and sensitive operations</p>
          <p>• This tool simulates cross-origin requests to identify potential vulnerabilities</p>
        </div>
      </div>
    </div>
  );
}

export default CORSTester;