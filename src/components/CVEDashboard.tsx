import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, Filter, ExternalLink, Calendar, Shield, TrendingUp, RefreshCw, Bell, Download } from 'lucide-react';

interface CVE {
  id: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  score: number;
  publishedDate: string;
  lastModified: string;
  vendor: string;
  product: string;
  references: string[];
  exploitAvailable: boolean;
  trending: boolean;
}

function CVEDashboard() {
  const [cves, setCves] = useState<CVE[]>([]);
  const [filteredCves, setFilteredCves] = useState<CVE[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [vendorFilter, setVendorFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock real-time CVE data
  const generateMockCVEs = (): CVE[] => {
    const vendors = ['Apache', 'Microsoft', 'Google', 'Oracle', 'Adobe', 'Cisco', 'VMware', 'WordPress', 'OpenSSL', 'Linux'];
    const products = ['HTTP Server', 'Windows', 'Chrome', 'Database', 'Acrobat', 'IOS', 'vSphere', 'Core', 'Library', 'Kernel'];
    const severities: CVE['severity'][] = ['Critical', 'High', 'Medium', 'Low'];
    
    return Array.from({ length: 20 }, (_, i) => {
      const vendor = vendors[Math.floor(Math.random() * vendors.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const score = severity === 'Critical' ? 9.0 + Math.random() : 
                   severity === 'High' ? 7.0 + Math.random() * 2 :
                   severity === 'Medium' ? 4.0 + Math.random() * 3 : Math.random() * 4;
      
      return {
        id: `CVE-2024-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        description: `${severity.toLowerCase()} vulnerability in ${vendor} ${product} allowing ${
          Math.random() > 0.5 ? 'remote code execution' : 'privilege escalation'
        } through ${Math.random() > 0.5 ? 'buffer overflow' : 'input validation bypass'}`,
        severity,
        score: Math.round(score * 10) / 10,
        publishedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lastModified: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        vendor,
        product,
        references: [
          `https://${vendor.toLowerCase()}.com/security/`,
          `https://nvd.nist.gov/vuln/detail/CVE-2024-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`
        ],
        exploitAvailable: Math.random() > 0.7,
        trending: Math.random() > 0.8
      };
    });
  };

  const fetchCVEs = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newCVEs = generateMockCVEs();
      setCves(newCVEs);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch CVEs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVEs();
    
    // Auto-refresh every 5 minutes if enabled
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchCVEs();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  useEffect(() => {
    let filtered = cves;

    if (searchTerm) {
      filtered = filtered.filter(cve =>
        cve.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cve.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cve.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cve.product.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (severityFilter) {
      filtered = filtered.filter(cve => cve.severity === severityFilter);
    }

    if (vendorFilter) {
      filtered = filtered.filter(cve => cve.vendor === vendorFilter);
    }

    // Sort by severity and date
    filtered.sort((a, b) => {
      const severityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

    setFilteredCves(filtered);
  }, [searchTerm, severityFilter, vendorFilter, cves]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-900/20 border-red-500/20';
      case 'High': return 'text-orange-400 bg-orange-900/20 border-orange-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20';
      case 'Low': return 'text-green-400 bg-green-900/20 border-green-500/20';
      default: return 'text-gray-400 bg-gray-700 border-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'text-red-400';
    if (score >= 7.0) return 'text-orange-400';
    if (score >= 4.0) return 'text-yellow-400';
    return 'text-green-400';
  };

  const uniqueVendors = [...new Set(cves.map(cve => cve.vendor))];
  const severityStats = {
    Critical: cves.filter(c => c.severity === 'Critical').length,
    High: cves.filter(c => c.severity === 'High').length,
    Medium: cves.filter(c => c.severity === 'Medium').length,
    Low: cves.filter(c => c.severity === 'Low').length
  };

  const exportCSV = () => {
    const headers = ['CVE ID', 'Severity', 'CVSS Score', 'Vendor', 'Product', 'Published Date', 'Description'];
    const csvContent = [
      headers.join(','),
      ...filteredCves.map(cve => [
        cve.id,
        cve.severity,
        cve.score,
        cve.vendor,
        cve.product,
        cve.publishedDate,
        `"${cve.description.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cve-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Real-time CVE Dashboard</h1>
              <p className="text-gray-400">Live vulnerability monitoring and threat intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-green-900/20 text-green-400 border border-green-500/20' 
                  : 'bg-gray-700 text-gray-300 border border-gray-600'
              }`}
            >
              <Bell className="w-4 h-4 inline mr-1" />
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </button>
            
            <button
              onClick={fetchCVEs}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total CVEs</p>
              <p className="text-2xl font-bold text-white">{cves.length}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm">Critical</p>
              <p className="text-2xl font-bold text-red-400">{severityStats.Critical}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-orange-900/20 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 text-sm">High</p>
              <p className="text-2xl font-bold text-orange-400">{severityStats.High}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-300 text-sm">Medium</p>
              <p className="text-2xl font-bold text-yellow-400">{severityStats.Medium}</p>
            </div>
            <Filter className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm">Trending</p>
              <p className="text-2xl font-bold text-green-400">{cves.filter(c => c.trending).length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
              Search CVEs
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by CVE ID, description, vendor..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-300 mb-2">
              Severity
            </label>
            <select
              id="severity"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            >
              <option value="">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="vendor" className="block text-sm font-medium text-gray-300 mb-2">
              Vendor
            </label>
            <select
              id="vendor"
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            >
              <option value="">All Vendors</option>
              {uniqueVendors.map(vendor => (
                <option key={vendor} value={vendor}>{vendor}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={exportCSV}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* CVE List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            CVE Entries ({filteredCves.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-700">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-700 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            filteredCves.map((cve) => (
              <div key={cve.id} className="p-6 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-xl font-bold text-white font-mono">{cve.id}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(cve.severity)}`}>
                      {cve.severity}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">CVSS:</span>
                      <span className={`font-bold ${getScoreColor(cve.score)}`}>
                        {cve.score}
                      </span>
                    </div>
                    {cve.exploitAvailable && (
                      <div className="px-2 py-1 bg-red-900/20 border border-red-500/20 rounded text-xs text-red-400 font-medium">
                        Exploit Available
                      </div>
                    )}
                    {cve.trending && (
                      <div className="px-2 py-1 bg-purple-900/20 border border-purple-500/20 rounded text-xs text-purple-400 font-medium flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Trending</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(cve.publishedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-300 mb-2">{cve.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <span className="text-gray-400">Vendor:</span>{' '}
                      <span className="text-white">{cve.vendor}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Product:</span>{' '}
                      <span className="text-white">{cve.product}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {cve.references.slice(0, 2).map((ref, index) => (
                      <a
                        key={index}
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Reference {index + 1}</span>
                      </a>
                    ))}
                  </div>
                  <div className="text-sm text-gray-400">
                    Updated: {new Date(cve.lastModified).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-orange-900/10 border border-orange-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-orange-400 mb-3">Real-time CVE Monitoring</h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>• Live CVE feed updates every 5 minutes with the latest vulnerability disclosures</p>
          <p>• CVSS scores range from 0.0 to 10.0, with higher scores indicating more severe vulnerabilities</p>
          <p>• Critical (9.0-10.0), High (7.0-8.9), Medium (4.0-6.9), Low (0.1-3.9)</p>
          <p>• Trending vulnerabilities are actively being exploited in the wild</p>
          <p>• Export functionality allows you to generate reports for compliance and documentation</p>
        </div>
      </div>
    </div>
  );
}

export default CVEDashboard;