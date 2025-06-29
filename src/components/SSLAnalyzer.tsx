import React, { useState } from 'react';
import { Lock, Search, AlertTriangle, CheckCircle, XCircle, Calendar, Shield, Key } from 'lucide-react';

interface SSLResult {
  domain: string;
  certificate: {
    subject: string;
    issuer: string;
    validFrom: string;
    validTo: string;
    daysUntilExpiry: number;
    serialNumber: string;
    fingerprint: string;
    keySize: number;
    signatureAlgorithm: string;
  };
  protocols: {
    name: string;
    supported: boolean;
    secure: boolean;
  }[];
  ciphers: {
    name: string;
    strength: 'strong' | 'weak' | 'insecure';
  }[];
  vulnerabilities: {
    name: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }[];
  grade: string;
  score: number;
}

function SSLAnalyzer() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<SSLResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeSSL = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Simulate SSL analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock SSL analysis results
      const mockResult: SSLResult = {
        domain: domain.replace(/^https?:\/\//, ''),
        certificate: {
          subject: `CN=${domain.replace(/^https?:\/\//, '')}, O=Example Corp, C=US`,
          issuer: 'CN=Let\'s Encrypt Authority X3, O=Let\'s Encrypt, C=US',
          validFrom: '2024-01-01',
          validTo: '2024-04-01',
          daysUntilExpiry: Math.floor(Math.random() * 90) + 1,
          serialNumber: '03:' + Array.from({length: 15}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':'),
          fingerprint: 'SHA256:' + Array.from({length: 32}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':'),
          keySize: 2048,
          signatureAlgorithm: 'SHA256withRSA'
        },
        protocols: [
          { name: 'TLS 1.3', supported: true, secure: true },
          { name: 'TLS 1.2', supported: true, secure: true },
          { name: 'TLS 1.1', supported: false, secure: false },
          { name: 'TLS 1.0', supported: false, secure: false },
          { name: 'SSL 3.0', supported: false, secure: false },
          { name: 'SSL 2.0', supported: false, secure: false }
        ],
        ciphers: [
          { name: 'TLS_AES_256_GCM_SHA384', strength: 'strong' },
          { name: 'TLS_CHACHA20_POLY1305_SHA256', strength: 'strong' },
          { name: 'TLS_AES_128_GCM_SHA256', strength: 'strong' },
          { name: 'ECDHE-RSA-AES256-GCM-SHA384', strength: 'strong' },
          { name: 'ECDHE-RSA-AES128-GCM-SHA256', strength: 'strong' }
        ],
        vulnerabilities: [],
        grade: 'A',
        score: 95
      };

      // Add some random vulnerabilities for demo
      if (Math.random() > 0.7) {
        mockResult.vulnerabilities.push({
          name: 'Weak Cipher Suite',
          severity: 'medium',
          description: 'Server supports weak cipher suites that could be exploited'
        });
        mockResult.grade = 'B';
        mockResult.score = 80;
      }

      if (Math.random() > 0.8) {
        mockResult.vulnerabilities.push({
          name: 'Certificate Expiring Soon',
          severity: 'low',
          description: 'SSL certificate will expire within 30 days'
        });
      }

      setResult(mockResult);
    } catch (err) {
      setError('Failed to analyze SSL configuration');
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

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A': return 'text-green-400';
      case 'B': return 'text-blue-400';
      case 'C': return 'text-yellow-400';
      case 'D': return 'text-orange-400';
      case 'F': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCipherColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-400 bg-green-900/20';
      case 'weak': return 'text-yellow-400 bg-yellow-900/20';
      case 'insecure': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Lock className="w-8 h-8 text-teal-400" />
          <h1 className="text-3xl font-bold text-white">SSL/TLS Analyzer</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Analyze SSL/TLS configuration, certificates, and security posture
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="domain" className="block text-sm font-medium text-gray-300 mb-2">
              Domain or URL
            </label>
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com or https://example.com"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              onKeyPress={(e) => e.key === 'Enter' && analyzeSSL()}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={analyzeSSL}
              disabled={loading}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Analyzing...' : 'Analyze SSL'}</span>
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
          {/* SSL Grade */}
          {result && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">SSL Security Grade</h2>
                <div className="flex items-center space-x-4">
                  <div className={`text-4xl font-bold ${getGradeColor(result.grade)}`}>
                    {result.grade}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{result.score}%</div>
                    <div className="text-sm text-gray-400">Security Score</div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    result.score >= 90 ? 'bg-green-500' :
                    result.score >= 80 ? 'bg-blue-500' :
                    result.score >= 70 ? 'bg-yellow-500' :
                    result.score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Certificate Information */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Certificate Information</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : result ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400">Subject</label>
                      <div className="text-white font-mono text-sm bg-gray-700 p-2 rounded mt-1">
                        {result.certificate.subject}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Issuer</label>
                      <div className="text-white font-mono text-sm bg-gray-700 p-2 rounded mt-1">
                        {result.certificate.issuer}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Serial Number</label>
                      <div className="text-white font-mono text-sm bg-gray-700 p-2 rounded mt-1">
                        {result.certificate.serialNumber}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Valid From</label>
                        <div className="text-white text-sm mt-1 flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-green-400" />
                          <span>{new Date(result.certificate.validFrom).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Valid To</label>
                        <div className="text-white text-sm mt-1 flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-red-400" />
                          <span>{new Date(result.certificate.validTo).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Days Until Expiry</label>
                      <div className={`text-lg font-bold mt-1 ${
                        result.certificate.daysUntilExpiry > 30 ? 'text-green-400' :
                        result.certificate.daysUntilExpiry > 7 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {result.certificate.daysUntilExpiry} days
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Key Size</label>
                        <div className="text-white text-sm mt-1 flex items-center space-x-2">
                          <Key className="w-4 h-4 text-blue-400" />
                          <span>{result.certificate.keySize} bits</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Signature Algorithm</label>
                        <div className="text-white text-sm mt-1">
                          {result.certificate.signatureAlgorithm}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Protocol Support */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Protocol Support</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : result ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {result.protocols.map((protocol, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        protocol.supported
                          ? protocol.secure
                            ? 'bg-green-900/20 border-green-500/20'
                            : 'bg-yellow-900/20 border-yellow-500/20'
                          : 'bg-gray-700 border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{protocol.name}</span>
                        {protocol.supported ? (
                          protocol.secure ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                          )
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className={`text-sm mt-1 ${
                        protocol.supported
                          ? protocol.secure ? 'text-green-300' : 'text-yellow-300'
                          : 'text-gray-400'
                      }`}>
                        {protocol.supported 
                          ? protocol.secure ? 'Supported & Secure' : 'Supported (Insecure)'
                          : 'Not Supported'
                        }
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Cipher Suites */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Cipher Suites</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : result ? (
                <div className="space-y-3">
                  {result.ciphers.map((cipher, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${getCipherColor(cipher.strength)}`}
                    >
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono">{cipher.name}</code>
                        <span className={`text-xs px-2 py-1 rounded capitalize ${getCipherColor(cipher.strength)}`}>
                          {cipher.strength}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Vulnerabilities */}
          {result && result.vulnerabilities.length > 0 && (
            <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Security Issues Found</span>
              </h3>
              <div className="space-y-3">
                {result.vulnerabilities.map((vuln, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(vuln.severity)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{vuln.name}</span>
                      <span className={`text-xs px-2 py-1 rounded capitalize ${getSeverityColor(vuln.severity)}`}>
                        {vuln.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{vuln.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-teal-900/10 border border-teal-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-teal-400 mb-3">SSL/TLS Security Analysis</h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>• SSL/TLS analysis evaluates certificate validity, protocol support, and cipher strength</p>
          <p>• Grade A+ indicates perfect SSL configuration with no known vulnerabilities</p>
          <p>• Weak protocols (SSL 2.0/3.0, TLS 1.0/1.1) should be disabled for security</p>
          <p>• Strong cipher suites use AES-256, ChaCha20, or similar encryption algorithms</p>
          <p>• Certificate expiry monitoring helps prevent service disruptions</p>
        </div>
      </div>
    </div>
  );
}

export default SSLAnalyzer;