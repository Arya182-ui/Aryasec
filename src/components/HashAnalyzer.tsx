import React, { useState } from 'react';
import { Key, Upload, CheckCircle, XCircle, Copy, FileText, Shield, AlertTriangle } from 'lucide-react';

interface HashResult {
  algorithm: string;
  hash: string;
  match: boolean;
  file?: string;
}

interface FileIntegrity {
  filename: string;
  size: number;
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
  status: 'verified' | 'compromised' | 'unknown';
}

function HashAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [compareHash, setCompareHash] = useState('');
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [fileIntegrity, setFileIntegrity] = useState<FileIntegrity | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateHashes = async (text: string) => {
    setLoading(true);
    
    try {
      // Simulate hash calculation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock hash calculations (in real app, use crypto libraries)
      const mockHashes = {
        md5: generateMockHash(32),
        sha1: generateMockHash(40),
        sha256: generateMockHash(64),
        sha512: generateMockHash(128)
      };

      const results: HashResult[] = [
        {
          algorithm: 'MD5',
          hash: mockHashes.md5,
          match: compareHash.toLowerCase() === mockHashes.md5.toLowerCase()
        },
        {
          algorithm: 'SHA-1',
          hash: mockHashes.sha1,
          match: compareHash.toLowerCase() === mockHashes.sha1.toLowerCase()
        },
        {
          algorithm: 'SHA-256',
          hash: mockHashes.sha256,
          match: compareHash.toLowerCase() === mockHashes.sha256.toLowerCase()
        },
        {
          algorithm: 'SHA-512',
          hash: mockHashes.sha512,
          match: compareHash.toLowerCase() === mockHashes.sha512.toLowerCase()
        }
      ];

      setHashResults(results);
    } catch (error) {
      console.error('Hash calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockHash = (length: number): string => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    
    try {
      // Simulate file hash calculation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockIntegrity: FileIntegrity = {
        filename: file.name,
        size: file.size,
        md5: generateMockHash(32),
        sha1: generateMockHash(40),
        sha256: generateMockHash(64),
        sha512: generateMockHash(128),
        status: Math.random() > 0.7 ? 'verified' : Math.random() > 0.5 ? 'compromised' : 'unknown'
      };

      setFileIntegrity(mockIntegrity);
    } catch (error) {
      console.error('File analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-400 bg-green-900/20 border-green-500/20';
      case 'compromised': return 'text-red-400 bg-red-900/20 border-red-500/20';
      case 'unknown': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20';
      default: return 'text-gray-400 bg-gray-700 border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'compromised': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'unknown': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default: return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Key className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold text-white">Hash Analyzer</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Calculate and verify file integrity using cryptographic hash functions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Text Hash Calculator */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Text Hash Calculator</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="inputText" className="block text-sm font-medium text-gray-300 mb-2">
                  Input Text
                </label>
                <textarea
                  id="inputText"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to hash..."
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label htmlFor="compareHash" className="block text-sm font-medium text-gray-300 mb-2">
                  Compare Hash (Optional)
                </label>
                <input
                  type="text"
                  id="compareHash"
                  value={compareHash}
                  onChange={(e) => setCompareHash(e.target.value)}
                  placeholder="Enter hash to compare..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <button
                onClick={() => calculateHashes(inputText)}
                disabled={!inputText || loading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
              >
                {loading ? 'Calculating...' : 'Calculate Hashes'}
              </button>
            </div>

            {/* Hash Results */}
            {hashResults.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-lg font-semibold text-white">Hash Results</h3>
                {hashResults.map((result, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{result.algorithm}</span>
                        {compareHash && (
                          result.match ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )
                        )}
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.hash)}
                        className="text-gray-400 hover:text-gray-200 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <code className="text-sm text-gray-300 font-mono break-all">
                      {result.hash}
                    </code>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* File Integrity Checker */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">File Integrity Checker</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="fileUpload"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Click to upload file</p>
                    <p className="text-gray-500 text-sm">Maximum file size: 10MB</p>
                  </label>
                </div>
              </div>

              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-2"></div>
                  <p className="text-gray-400">Analyzing file...</p>
                </div>
              )}

              {/* File Integrity Results */}
              {fileIntegrity && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${getStatusColor(fileIntegrity.status)}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(fileIntegrity.status)}
                      <span className="font-medium text-white">
                        File Status: {fileIntegrity.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div><span className="text-gray-400">Filename:</span> {fileIntegrity.filename}</div>
                      <div><span className="text-gray-400">Size:</span> {(fileIntegrity.size / 1024).toFixed(2)} KB</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">File Hashes</h3>
                    
                    {[
                      { label: 'MD5', hash: fileIntegrity.md5 },
                      { label: 'SHA-1', hash: fileIntegrity.sha1 },
                      { label: 'SHA-256', hash: fileIntegrity.sha256 },
                      { label: 'SHA-512', hash: fileIntegrity.sha512 }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{item.label}</span>
                          <button
                            onClick={() => copyToClipboard(item.hash)}
                            className="text-gray-400 hover:text-gray-200 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <code className="text-xs text-gray-300 font-mono break-all">
                          {item.hash}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hash Information */}
      <div className="mt-8 bg-amber-900/10 border border-amber-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Hash Algorithm Information</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-amber-200">
          <div>
            <h4 className="font-medium text-amber-300 mb-2">MD5 (128-bit)</h4>
            <p>Fast but cryptographically broken. Use only for non-security purposes like checksums.</p>
          </div>
          <div>
            <h4 className="font-medium text-amber-300 mb-2">SHA-1 (160-bit)</h4>
            <p>Deprecated for security use due to collision vulnerabilities. Still used in some legacy systems.</p>
          </div>
          <div>
            <h4 className="font-medium text-amber-300 mb-2">SHA-256 (256-bit)</h4>
            <p>Current standard for most security applications. Part of the SHA-2 family, widely trusted.</p>
          </div>
          <div>
            <h4 className="font-medium text-amber-300 mb-2">SHA-512 (512-bit)</h4>
            <p>Strongest in SHA-2 family. Recommended for high-security applications and digital signatures.</p>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="mt-6 bg-blue-900/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">Usage Guidelines</h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>• Use hash verification to ensure file integrity and detect tampering</p>
          <p>• SHA-256 or SHA-512 are recommended for security-critical applications</p>
          <p>• Compare hashes from trusted sources to verify file authenticity</p>
          <p>• Hash mismatches may indicate file corruption or malicious modification</p>
          <p>• Store hash values securely to maintain their integrity verification value</p>
        </div>
      </div>
    </div>
  );
}

export default HashAnalyzer;