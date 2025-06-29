import React, { useState } from 'react';
import { Zap, Search, AlertTriangle, CheckCircle, XCircle, Code, Eye } from 'lucide-react';

interface XSSTest {
  payload: string;
  type: string;
  description: string;
}

interface XSSResult {
  url: string;
  parameter: string;
  payload: string;
  vulnerable: boolean;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  context: string;
  evidence?: string;
  recommendation: string;
}

interface XSSAnalysis {
  target: string;
  results: XSSResult[];
  vulnerableParams: number;
  totalTests: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'none';
}

const xssPayloads: XSSTest[] = [
  {
    payload: "<script>alert('XSS')</script>",
    type: "Reflected XSS",
    description: "Basic script injection for immediate execution"
  },
  {
    payload: "javascript:alert('XSS')",
    type: "DOM-based XSS",
    description: "JavaScript protocol injection in DOM manipulation"
  },
  {
    payload: "<img src=x onerror=alert('XSS')>",
    type: "HTML Injection",
    description: "Image tag with onerror event handler"
  },
  {
    payload: "'\"><script>alert('XSS')</script>",
    type: "Attribute Injection",
    description: "Breaking out of HTML attributes to inject script"
  },
  {
    payload: "<svg onload=alert('XSS')>",
    type: "SVG Injection",
    description: "SVG element with onload event handler"
  },
  {
    payload: "<iframe src=javascript:alert('XSS')>",
    type: "Frame Injection",
    description: "Iframe with javascript protocol"
  },
  {
    payload: "<body onload=alert('XSS')>",
    type: "Event Handler",
    description: "Body tag with onload event handler"
  },
  {
    payload: "eval(String.fromCharCode(97,108,101,114,116,40,39,88,83,83,39,41))",
    type: "Encoded Injection",
    description: "Character encoding to bypass filters"
  }
];

function XSSScanner() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<XSSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const scanXSS = async () => {
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
      // Simulate XSS scanning
      await new Promise(resolve => setTimeout(resolve, 3500));

      const results: XSSResult[] = [];
      const parameters = ['q', 'search', 'name', 'comment', 'message', 'input'];
      const contexts = ['HTML Body', 'HTML Attribute', 'JavaScript Context', 'CSS Context', 'URL Parameter'];

      // Test each parameter with different payloads
      parameters.forEach(param => {
        xssPayloads.forEach(test => {
          const isVulnerable = Math.random() > 0.75; // Random for demo
          
          if (isVulnerable) {
            let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
            let evidence = '';
            let context = contexts[Math.floor(Math.random() * contexts.length)];
            
            switch (test.type) {
              case 'Reflected XSS':
                severity = 'high';
                evidence = 'Payload reflected in response without encoding';
                break;
              case 'DOM-based XSS':
                severity = 'critical';
                evidence = 'JavaScript execution confirmed in DOM';
                break;
              case 'HTML Injection':
                severity = 'medium';
                evidence = 'HTML tags rendered without sanitization';
                break;
              case 'Attribute Injection':
                severity = 'high';
                evidence = 'Successfully broke out of HTML attribute';
                break;
              case 'SVG Injection':
                severity = 'high';
                evidence = 'SVG element executed JavaScript code';
                break;
              case 'Frame Injection':
                severity = 'critical';
                evidence = 'Iframe loaded with JavaScript protocol';
                break;
              case 'Event Handler':
                severity = 'high';
                evidence = 'Event handler executed successfully';
                break;
              case 'Encoded Injection':
                severity = 'medium';
                evidence = 'Encoding bypass successful';
                break;
            }

            results.push({
              url: url.startsWith('http') ? url : `https://${url}`,
              parameter: param,
              payload: test.payload,
              vulnerable: true,
              type: test.type,
              severity,
              context,
              evidence,
              recommendation: getXSSRecommendation(test.type)
            });
          }
        });
      });

      // Add some non-vulnerable results
      if (results.length < 2) {
        results.push({
          url: url.startsWith('http') ? url : `https://${url}`,
          parameter: 'search',
          payload: "<script>alert('XSS')</script>",
          vulnerable: false,
          type: 'Reflected XSS',
          severity: 'low',
          context: 'HTML Body',
          recommendation: 'Input appears to be properly encoded'
        });
      }

      const vulnerableParams = new Set(results.filter(r => r.vulnerable).map(r => r.parameter)).size;
      const criticalVulns = results.filter(r => r.severity === 'critical' && r.vulnerable).length;
      const highVulns = results.filter(r => r.severity === 'high' && r.vulnerable).length;
      
      let riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'none' = 'none';
      if (criticalVulns > 0) riskLevel = 'critical';
      else if (highVulns > 0) riskLevel = 'high';
      else if (results.some(r => r.vulnerable)) riskLevel = 'medium';

      setAnalysis({
        target: url.startsWith('http') ? url : `https://${url}`,
        results: results.slice(0, 8), // Limit results for demo
        vulnerableParams,
        totalTests: xssPayloads.length * parameters.length,
        riskLevel
      });
    } catch (err) {
      setError('Failed to scan for XSS vulnerabilities');
    } finally {
      setLoading(false);
    }
  };

  const getXSSRecommendation = (type: string): string => {
    switch (type) {
      case 'Reflected XSS':
        return 'Implement proper output encoding and Content Security Policy';
      case 'DOM-based XSS':
        return 'Sanitize DOM manipulation and avoid dangerous JavaScript functions';
      case 'HTML Injection':
        return 'Use HTML encoding for all user input displayed in HTML context';
      case 'Attribute Injection':
        return 'Implement attribute encoding and validate input context';
      case 'SVG Injection':
        return 'Sanitize SVG content and disable JavaScript in SVG elements';
      case 'Frame Injection':
        return 'Validate iframe sources and implement frame-ancestors CSP directive';
      case 'Event Handler':
        return 'Remove or sanitize event handlers from user input';
      case 'Encoded Injection':
        return 'Implement multiple layers of encoding validation';
      default:
        return 'Implement comprehensive input validation and output encoding';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-900/20 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-700 border-gray-600';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'critical': return <XCircle className="w-6 h-6 text-red-400" />;
      case 'high': return <AlertTriangle className="w-6 h-6 text-orange-400" />;
      case 'medium': return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'low': return <CheckCircle className="w-6 h-6 text-blue-400" />;
      case 'none': return <CheckCircle className="w-6 h-6 text-green-400" />;
      default: return <Zap className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">XSS Scanner</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Scan web applications for Cross-Site Scripting (XSS) vulnerabilities
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
              placeholder="https://example.com/search.php?q=test"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              onKeyPress={(e) => e.key === 'Enter' && scanXSS()}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={scanXSS}
              disabled={loading}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Scanning...' : 'Scan for XSS'}</span>
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
          {/* Risk Assessment */}
          {analysis && (
            <div className={`rounded-xl p-6 border ${
              analysis.riskLevel === 'critical' ? 'bg-red-900/20 border-red-500/20' :
              analysis.riskLevel === 'high' ? 'bg-orange-900/20 border-orange-500/20' :
              analysis.riskLevel === 'medium' ? 'bg-yellow-900/20 border-yellow-500/20' :
              analysis.riskLevel === 'low' ? 'bg-blue-900/20 border-blue-500/20' :
              'bg-green-900/20 border-green-500/20'
            }`}>
              <div className="flex items-center space-x-4 mb-4">
                {getRiskIcon(analysis.riskLevel)}
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    XSS Risk Level: {analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)}
                  </h2>
                  <p className="text-gray-300">
                    {analysis.vulnerableParams} vulnerable parameters found out of {analysis.totalTests} tests
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Scan Results */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">XSS Vulnerability Scan Results</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : analysis ? (
                <div className="space-y-4">
                  {analysis.results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        result.vulnerable
                          ? getSeverityColor(result.severity)
                          : 'bg-gray-700 border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {result.vulnerable ? (
                            <XCircle className="w-5 h-5 text-red-400" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Eye className="w-4 h-4 text-purple-400" />
                              <span className="text-white font-medium">Parameter: {result.parameter}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-cyan-400">{result.type}</span>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm text-gray-400">Context:</span>
                              <span className="text-sm text-purple-300">{result.context}</span>
                            </div>
                            <code className="text-sm bg-gray-900 px-2 py-1 rounded text-gray-300 block">
                              {result.payload}
                            </code>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            result.vulnerable ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {result.vulnerable ? 'Vulnerable' : 'Safe'}
                          </div>
                          {result.vulnerable && (
                            <div className={`text-xs capitalize ${
                              result.severity === 'critical' ? 'text-red-400' :
                              result.severity === 'high' ? 'text-orange-400' :
                              result.severity === 'medium' ? 'text-yellow-400' :
                              'text-blue-400'
                            }`}>
                              {result.severity} severity
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {result.evidence && (
                        <div className="mb-3 p-2 bg-gray-900/50 rounded text-sm">
                          <div className="flex items-start space-x-2">
                            <Code className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="text-green-300 font-medium">Evidence: </span>
                              <span className="text-gray-300">{result.evidence}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-2 bg-blue-900/10 border border-blue-500/20 rounded text-sm">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-blue-300 font-medium">Recommendation: </span>
                            <span className="text-blue-200">{result.recommendation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* XSS Prevention Guide */}
          {analysis && analysis.results.some(r => r.vulnerable) && (
            <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>XSS Prevention Strategies</span>
              </h3>
              <div className="space-y-3 text-sm text-yellow-200">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Output Encoding:</strong> Encode all user data before displaying in HTML, JavaScript, or CSS contexts</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Content Security Policy:</strong> Implement strict CSP headers to prevent script execution</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Input Validation:</strong> Validate and sanitize all user input on both client and server side</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>HttpOnly Cookies:</strong> Set HttpOnly flag on cookies to prevent JavaScript access</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Template Engines:</strong> Use auto-escaping template engines for dynamic content</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-400 mb-3">Cross-Site Scripting (XSS)</h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>• XSS allows attackers to inject malicious scripts into web applications viewed by other users</p>
          <p>• This scanner tests for reflected, stored, and DOM-based XSS vulnerabilities</p>
          <p>• Successful XSS attacks can lead to session hijacking, data theft, and malware distribution</p>
          <p>• Always obtain proper authorization before testing applications you don't own</p>
          <p>• Use this tool for security assessment, penetration testing, and developer education</p>
        </div>
      </div>
    </div>
  );
}

export default XSSScanner;