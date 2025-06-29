import React, { useState } from 'react';
import { FileText, Search, AlertTriangle, CheckCircle, XCircle, Info, Shield } from 'lucide-react';

interface SecurityHeader {
  name: string;
  value: string | null;
  present: boolean;
  severity: 'high' | 'medium' | 'low' | 'info';
  description: string;
  recommendation?: string;
}

interface AnalysisResult {
  url: string;
  headers: Record<string, string>;
  securityHeaders: SecurityHeader[];
  score: number;
  grade: string;
}

const expectedHeaders = [
  {
    name: 'Content-Security-Policy',
    severity: 'high' as const,
    description: 'Helps prevent XSS attacks by controlling which resources can be loaded',
    recommendation: 'Implement a strict CSP policy to prevent code injection attacks'
  },
  {
    name: 'X-Frame-Options',
    severity: 'medium' as const,
    description: 'Prevents clickjacking attacks by controlling iframe embedding',
    recommendation: 'Set to DENY or SAMEORIGIN to prevent clickjacking'
  },
  {
    name: 'X-Content-Type-Options',
    severity: 'medium' as const,
    description: 'Prevents MIME type sniffing attacks',
    recommendation: 'Set to "nosniff" to prevent MIME type confusion attacks'
  },
  {
    name: 'Strict-Transport-Security',
    severity: 'high' as const,
    description: 'Enforces HTTPS connections and prevents protocol downgrade attacks',
    recommendation: 'Implement HSTS with a long max-age and includeSubDomains'
  },
  {
    name: 'X-XSS-Protection',
    severity: 'low' as const,
    description: 'Legacy XSS protection (deprecated but still useful for older browsers)',
    recommendation: 'Set to "1; mode=block" for legacy browser support'
  },
  {
    name: 'Referrer-Policy',
    severity: 'low' as const,
    description: 'Controls how much referrer information is shared',
    recommendation: 'Set to "strict-origin-when-cross-origin" for privacy'
  },
  {
    name: 'Permissions-Policy',
    severity: 'medium' as const,
    description: 'Controls which browser features can be used',
    recommendation: 'Restrict unnecessary browser features and APIs'
  }
];

function HeaderAnalyzer() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeHeaders = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // In a real application, you'd make this request through a CORS proxy or backend
      // For demo purposes, we'll simulate the analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response data
      const mockHeaders = {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Server': 'nginx/1.18.0',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      };

      const securityHeaders: SecurityHeader[] = expectedHeaders.map(expected => {
        const headerValue = mockHeaders[expected.name];
        const present = !!headerValue;
        
        return {
          name: expected.name,
          value: headerValue || null,
          present,
          severity: expected.severity,
          description: expected.description,
          recommendation: expected.recommendation
        };
      });

      // Calculate security score
      const presentHeaders = securityHeaders.filter(h => h.present);
      const score = Math.round((presentHeaders.length / securityHeaders.length) * 100);
      
      let grade = 'F';
      if (score >= 90) grade = 'A';
      else if (score >= 80) grade = 'B';
      else if (score >= 70) grade = 'C';
      else if (score >= 60) grade = 'D';

      setResult({
        url: url.startsWith('http') ? url : `https://${url}`,
        headers: mockHeaders,
        securityHeaders,
        score,
        grade
      });
    } catch (err) {
      setError('Failed to analyze headers. This might be due to CORS restrictions.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-green-400" />
          <h1 className="text-3xl font-bold text-white">HTTP Header Analyzer</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Analyze HTTP security headers and identify potential vulnerabilities
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
              Target URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && analyzeHeaders()}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={analyzeHeaders}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Analyzing...' : 'Analyze Headers'}</span>
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
      {(loading || result) && (
        <div className="space-y-6">
          {/* Security Score */}
          {result && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Security Score</h2>
                <div className="flex items-center space-x-4">
                  <div className={`text-3xl font-bold ${
                    result.grade === 'A' ? 'text-green-400' :
                    result.grade === 'B' ? 'text-blue-400' :
                    result.grade === 'C' ? 'text-yellow-400' :
                    result.grade === 'D' ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {result.grade}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{result.score}%</div>
                    <div className="text-sm text-gray-400">Security Headers</div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    result.score >= 80 ? 'bg-green-500' :
                    result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Security Headers Analysis */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Security Headers Analysis</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : result ? (
                <div className="space-y-4">
                  {result.securityHeaders.map((header, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        header.present 
                          ? 'bg-green-900/10 border-green-500/20' 
                          : 'bg-red-900/10 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {header.present ? (
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                          )}
                          <div>
                            <h3 className="text-white font-medium">{header.name}</h3>
                            {header.value && (
                              <code className="text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded mt-1 inline-block">
                                {header.value}
                              </code>
                            )}
                          </div>
                        </div>
                        <div className={`flex items-center space-x-1 ${getSeverityColor(header.severity)}`}>
                          {getSeverityIcon(header.severity)}
                          <span className="text-sm font-medium capitalize">{header.severity}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{header.description}</p>
                      {!header.present && header.recommendation && (
                        <div className="bg-blue-900/10 border border-blue-500/20 rounded p-3 mt-2">
                          <div className="flex items-start space-x-2">
                            <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-blue-300 text-sm">{header.recommendation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* All Headers */}
          {result && (
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">All Response Headers</h2>
              </div>
              <div className="p-6">
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  {Object.entries(result.headers).map(([key, value]) => (
                    <div key={key} className="mb-1">
                      <span className="text-green-400">{key}:</span>{' '}
                      <span className="text-gray-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-blue-900/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">Security Headers Importance</h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>• <strong>High Priority:</strong> CSP and HSTS provide critical protection against major attack vectors</p>
          <p>• <strong>Medium Priority:</strong> Frame options and content type protection prevent common exploits</p>
          <p>• <strong>Low Priority:</strong> Additional headers provide defense-in-depth security</p>
          <p>• Missing security headers can expose your application to various attacks including XSS, clickjacking, and MITM</p>
        </div>
      </div>
    </div>
  );
}

export default HeaderAnalyzer;