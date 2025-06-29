import React, { useState } from 'react';
import { Bug, Search, AlertTriangle, CheckCircle, XCircle, Database, Code } from 'lucide-react';

interface SQLTest {
  payload: string;
  type: string;
  description: string;
}

interface SQLResult {
  url: string;
  parameter: string;
  payload: string;
  vulnerable: boolean;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  evidence?: string;
  recommendation: string;
}

interface SQLAnalysis {
  target: string;
  results: SQLResult[];
  vulnerableParams: number;
  totalTests: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'none';
}

const sqlPayloads: SQLTest[] = [
  {
    payload: "' OR '1'='1",
    type: "Boolean-based Blind",
    description: "Classic boolean injection to bypass authentication"
  },
  {
    payload: "' UNION SELECT NULL--",
    type: "Union-based",
    description: "Union injection to extract data from database"
  },
  {
    payload: "'; DROP TABLE users--",
    type: "Stacked Queries",
    description: "Destructive injection to modify database structure"
  },
  {
    payload: "' AND (SELECT COUNT(*) FROM information_schema.tables)>0--",
    type: "Information Schema",
    description: "Extract database metadata and structure"
  },
  {
    payload: "' OR SLEEP(5)--",
    type: "Time-based Blind",
    description: "Time delay injection for blind SQL injection"
  },
  {
    payload: "' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version()), 0x7e))--",
    type: "Error-based",
    description: "Force database errors to extract information"
  }
];

function SQLInjectionTester() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<SQLAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testSQLInjection = async () => {
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
      // Simulate SQL injection testing
      await new Promise(resolve => setTimeout(resolve, 4000));

      const results: SQLResult[] = [];
      const parameters = ['id', 'user', 'search', 'category', 'page'];

      // Test each parameter with different payloads
      parameters.forEach(param => {
        sqlPayloads.forEach(test => {
          const isVulnerable = Math.random() > 0.8; // Random for demo
          
          if (isVulnerable) {
            let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
            let evidence = '';
            
            switch (test.type) {
              case 'Stacked Queries':
                severity = 'critical';
                evidence = 'Database error: Table \'users\' doesn\'t exist';
                break;
              case 'Union-based':
                severity = 'high';
                evidence = 'Extracted data: admin, user123, guest';
                break;
              case 'Time-based Blind':
                severity = 'high';
                evidence = 'Response time: 5.2 seconds (expected delay)';
                break;
              case 'Boolean-based Blind':
                severity = 'medium';
                evidence = 'Different response content detected';
                break;
              case 'Error-based':
                severity = 'high';
                evidence = 'MySQL version: 8.0.25-0ubuntu0.20.04.1';
                break;
            }

            results.push({
              url: url.startsWith('http') ? url : `https://${url}`,
              parameter: param,
              payload: test.payload,
              vulnerable: true,
              type: test.type,
              severity,
              evidence,
              recommendation: getSQLRecommendation(test.type)
            });
          }
        });
      });

      // Add some non-vulnerable results for completeness
      if (results.length < 3) {
        results.push({
          url: url.startsWith('http') ? url : `https://${url}`,
          parameter: 'search',
          payload: "' OR '1'='1",
          vulnerable: false,
          type: 'Boolean-based Blind',
          severity: 'low',
          recommendation: 'Parameter appears to be properly sanitized'
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
        results: results.slice(0, 10), // Limit results for demo
        vulnerableParams,
        totalTests: sqlPayloads.length * parameters.length,
        riskLevel
      });
    } catch (err) {
      setError('Failed to test for SQL injection vulnerabilities');
    } finally {
      setLoading(false);
    }
  };

  const getSQLRecommendation = (type: string): string => {
    switch (type) {
      case 'Boolean-based Blind':
        return 'Use parameterized queries and input validation';
      case 'Union-based':
        return 'Implement proper input sanitization and use prepared statements';
      case 'Stacked Queries':
        return 'Disable multiple statement execution and use stored procedures';
      case 'Time-based Blind':
        return 'Implement query timeouts and use parameterized queries';
      case 'Error-based':
        return 'Suppress database errors and implement proper error handling';
      case 'Information Schema':
        return 'Restrict database permissions and use least privilege principle';
      default:
        return 'Use parameterized queries and validate all user input';
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
      default: return <Bug className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Bug className="w-8 h-8 text-red-400" />
          <h1 className="text-3xl font-bold text-white">SQL Injection Tester</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Test web applications for SQL injection vulnerabilities using various attack vectors
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
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              onKeyPress={(e) => e.key === 'Enter' && testSQLInjection()}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={testSQLInjection}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Testing...' : 'Test SQL Injection'}</span>
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
                    SQL Injection Risk: {analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)}
                  </h2>
                  <p className="text-gray-300">
                    {analysis.vulnerableParams} vulnerable parameters found out of {analysis.totalTests} tests
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Test Results */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">SQL Injection Test Results</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-700 rounded-lg"></div>
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
                              <Database className="w-4 h-4 text-blue-400" />
                              <span className="text-white font-medium">Parameter: {result.parameter}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-cyan-400">{result.type}</span>
                            </div>
                            <code className="text-sm bg-gray-900 px-2 py-1 rounded text-gray-300">
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

          {/* Remediation Guide */}
          {analysis && analysis.results.some(r => r.vulnerable) && (
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center space-x-2">
                <Bug className="w-5 h-5" />
                <span>SQL Injection Prevention</span>
              </h3>
              <div className="space-y-3 text-sm text-blue-200">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Use Parameterized Queries:</strong> Always use prepared statements with parameter binding</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Input Validation:</strong> Validate and sanitize all user input before processing</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Least Privilege:</strong> Use database accounts with minimal required permissions</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Error Handling:</strong> Implement proper error handling without exposing database details</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Web Application Firewall:</strong> Deploy WAF rules to filter malicious SQL injection attempts</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-red-900/10 border border-red-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-3">SQL Injection Testing</h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>• SQL injection allows attackers to execute malicious SQL commands in application databases</p>
          <p>• This tool tests common injection vectors including boolean, union, time-based, and error-based attacks</p>
          <p>• Critical vulnerabilities can lead to data theft, data manipulation, or complete system compromise</p>
          <p>• Always test on systems you own or have explicit permission to test</p>
          <p>• Use this tool for security assessment and developer education purposes only</p>
        </div>
      </div>
    </div>
  );
}

export default SQLInjectionTester;