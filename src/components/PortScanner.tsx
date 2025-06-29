import React, { useState } from 'react';
import { Wifi, Search, AlertTriangle, CheckCircle, XCircle, Shield, Server, Lock } from 'lucide-react';

interface PortResult {
  port: number;
  service: string;
  status: 'open' | 'closed' | 'filtered';
  banner?: string;
  vulnerability?: string;
  severity: 'high' | 'medium' | 'low' | 'info';
}

interface ScanResult {
  host: string;
  ports: PortResult[];
  scanTime: number;
  totalPorts: number;
  openPorts: number;
}

const commonPorts = [
  { port: 21, service: 'FTP' },
  { port: 22, service: 'SSH' },
  { port: 23, service: 'Telnet' },
  { port: 25, service: 'SMTP' },
  { port: 53, service: 'DNS' },
  { port: 80, service: 'HTTP' },
  { port: 110, service: 'POP3' },
  { port: 143, service: 'IMAP' },
  { port: 443, service: 'HTTPS' },
  { port: 993, service: 'IMAPS' },
  { port: 995, service: 'POP3S' },
  { port: 3389, service: 'RDP' },
  { port: 5432, service: 'PostgreSQL' },
  { port: 3306, service: 'MySQL' },
  { port: 1433, service: 'MSSQL' },
  { port: 6379, service: 'Redis' },
  { port: 27017, service: 'MongoDB' },
  { port: 8080, service: 'HTTP-Alt' },
  { port: 8443, service: 'HTTPS-Alt' },
  { port: 9200, service: 'Elasticsearch' }
];

function PortScanner() {
  const [host, setHost] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanType, setScanType] = useState<'common' | 'full'>('common');

  const scanPorts = async () => {
    if (!host) {
      setError('Please enter a host or IP address');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const startTime = Date.now();
      
      // Simulate port scanning
      await new Promise(resolve => setTimeout(resolve, 3000));

      const portsToScan = scanType === 'common' ? commonPorts : 
        [...commonPorts, ...Array.from({length: 50}, (_, i) => ({
          port: 8000 + i,
          service: `Service-${8000 + i}`
        }))];

      const scannedPorts: PortResult[] = portsToScan.map(({ port, service }) => {
        const isOpen = Math.random() > 0.7; // Random for demo
        let vulnerability = '';
        let severity: 'high' | 'medium' | 'low' | 'info' = 'info';
        let banner = '';

        if (isOpen) {
          // Add some realistic banners and vulnerabilities
          switch (port) {
            case 21:
              banner = 'vsftpd 3.0.3';
              if (Math.random() > 0.8) {
                vulnerability = 'Anonymous FTP access enabled';
                severity = 'medium';
              }
              break;
            case 22:
              banner = 'OpenSSH 7.4';
              if (Math.random() > 0.9) {
                vulnerability = 'Weak SSH configuration detected';
                severity = 'low';
              }
              break;
            case 23:
              banner = 'Linux telnetd';
              vulnerability = 'Telnet service running (unencrypted)';
              severity = 'high';
              break;
            case 80:
              banner = 'Apache/2.4.41';
              if (Math.random() > 0.8) {
                vulnerability = 'Server version disclosure';
                severity = 'low';
              }
              break;
            case 443:
              banner = 'nginx/1.18.0';
              break;
            case 3389:
              banner = 'Microsoft Terminal Services';
              if (Math.random() > 0.7) {
                vulnerability = 'RDP exposed to internet';
                severity = 'high';
              }
              break;
            case 3306:
              banner = 'MySQL 8.0.25';
              if (Math.random() > 0.8) {
                vulnerability = 'Database exposed to internet';
                severity = 'high';
              }
              break;
          }
        }

        return {
          port,
          service,
          status: isOpen ? 'open' : Math.random() > 0.5 ? 'closed' : 'filtered',
          banner: isOpen ? banner : undefined,
          vulnerability: isOpen ? vulnerability : undefined,
          severity
        } as PortResult;
      });

      const openPorts = scannedPorts.filter(p => p.status === 'open');
      const scanTime = Date.now() - startTime;

      setResult({
        host,
        ports: scannedPorts,
        scanTime,
        totalPorts: scannedPorts.length,
        openPorts: openPorts.length
      });
    } catch (err) {
      setError('Failed to scan ports');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'closed': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'filtered': return <Shield className="w-5 h-5 text-yellow-400" />;
      default: return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Wifi className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Port Scanner</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Scan for open ports and identify running services on target hosts
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="host" className="block text-sm font-medium text-gray-300 mb-2">
              Target Host/IP
            </label>
            <input
              type="text"
              id="host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="example.com or 192.168.1.1"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              onKeyPress={(e) => e.key === 'Enter' && scanPorts()}
            />
          </div>

          <div>
            <label htmlFor="scanType" className="block text-sm font-medium text-gray-300 mb-2">
              Scan Type
            </label>
            <select
              id="scanType"
              value={scanType}
              onChange={(e) => setScanType(e.target.value as 'common' | 'full')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="common">Common Ports (Fast)</option>
              <option value="full">Extended Scan (Slower)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={scanPorts}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Scanning...' : 'Start Scan'}</span>
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
          {/* Scan Summary */}
          {result && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Scan Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Server className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300 text-sm">Target</span>
                  </div>
                  <div className="text-white font-mono">{result.host}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300 text-sm">Open Ports</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">{result.openPorts}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wifi className="w-5 h-5 text-indigo-400" />
                    <span className="text-gray-300 text-sm">Total Scanned</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{result.totalPorts}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300 text-sm">Scan Time</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{(result.scanTime / 1000).toFixed(1)}s</div>
                </div>
              </div>
            </div>
          )}

          {/* Port Results */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">
                {loading ? 'Scanning Ports...' : `Port Scan Results`}
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-700 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : result ? (
                <div className="space-y-3">
                  {result.ports.filter(p => p.status === 'open').map((port, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        port.vulnerability
                          ? getSeverityColor(port.severity)
                          : 'bg-gray-700 border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(port.status)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-bold">Port {port.port}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-cyan-400">{port.service}</span>
                              <span className="text-gray-400">•</span>
                              <span className={`capitalize font-medium ${
                                port.status === 'open' ? 'text-green-400' : 
                                port.status === 'closed' ? 'text-red-400' : 'text-yellow-400'
                              }`}>
                                {port.status}
                              </span>
                            </div>
                            {port.banner && (
                              <div className="text-sm text-gray-400 mt-1">
                                <code className="bg-gray-900 px-2 py-1 rounded text-xs">
                                  {port.banner}
                                </code>
                              </div>
                            )}
                          </div>
                        </div>
                        {port.vulnerability && (
                          <div className={`text-xs capitalize px-2 py-1 rounded ${
                            port.severity === 'high' ? 'bg-red-900/20 text-red-400' :
                            port.severity === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                            'bg-blue-900/20 text-blue-400'
                          }`}>
                            {port.severity} risk
                          </div>
                        )}
                      </div>
                      {port.vulnerability && (
                        <div className="mt-2 p-2 bg-gray-900/50 rounded text-sm">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                            <span className="text-orange-300">{port.vulnerability}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {result.ports.filter(p => p.status === 'open').length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No open ports detected on the target host</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-400 mb-3">Port Scanning Information</h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>• Port scanning identifies open network services on target systems</p>
          <p>• Open ports may indicate running services that could be potential attack vectors</p>
          <p>• Always ensure you have permission before scanning systems you don't own</p>
          <p>• Use this tool responsibly for security assessment and network troubleshooting</p>
          <p>• Consider firewall rules and intrusion detection systems when interpreting results</p>
        </div>
      </div>
    </div>
  );
}

export default PortScanner;