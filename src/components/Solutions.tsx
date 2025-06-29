import React, { useState } from 'react';
import { Eye, Search, CheckCircle, AlertTriangle, Code, Shield, Zap, Bug, Lock, FileText } from 'lucide-react';

interface Solution {
  id: string;
  title: string;
  vulnerability: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'web' | 'network' | 'system' | 'database';
  description: string;
  impact: string;
  solution: string;
  codeExample?: string;
  tools: string[];
  references: string[];
}

const solutions: Solution[] = [
  {
    id: 'sql-injection',
    title: 'SQL Injection Prevention',
    vulnerability: 'SQL Injection',
    severity: 'critical',
    category: 'database',
    description: 'SQL injection occurs when user input is directly concatenated into SQL queries without proper sanitization.',
    impact: 'Complete database compromise, data theft, data manipulation, authentication bypass',
    solution: 'Use parameterized queries, input validation, and least privilege database access.',
    codeExample: `// Vulnerable Code
String query = "SELECT * FROM users WHERE id = " + userId;

// Secure Code
String query = "SELECT * FROM users WHERE id = ?";
PreparedStatement stmt = connection.prepareStatement(query);
stmt.setInt(1, userId);`,
    tools: ['OWASP ZAP', 'SQLMap', 'Burp Suite'],
    references: ['https://owasp.org/www-community/attacks/SQL_Injection', 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html']
  },
  {
    id: 'xss-prevention',
    title: 'Cross-Site Scripting (XSS) Mitigation',
    vulnerability: 'Cross-Site Scripting',
    severity: 'high',
    category: 'web',
    description: 'XSS vulnerabilities allow attackers to inject malicious scripts into web applications.',
    impact: 'Session hijacking, credential theft, malware distribution, defacement',
    solution: 'Implement output encoding, Content Security Policy, and input validation.',
    codeExample: `// Vulnerable Code
document.innerHTML = userInput;

// Secure Code
document.textContent = userInput;
// Or use proper encoding library
const encoded = DOMPurify.sanitize(userInput);`,
    tools: ['OWASP ZAP', 'XSSHunter', 'Burp Suite'],
    references: ['https://owasp.org/www-community/attacks/xss/', 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html']
  },
  {
    id: 'cors-misconfiguration',
    title: 'CORS Misconfiguration Fix',
    vulnerability: 'CORS Misconfiguration',
    severity: 'medium',
    category: 'web',
    description: 'Overly permissive CORS policies can allow unauthorized cross-origin requests.',
    impact: 'Data theft from authenticated users, unauthorized API access',
    solution: 'Configure specific allowed origins, avoid wildcards with credentials, implement proper preflight handling.',
    codeExample: `// Vulnerable Configuration
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true

// Secure Configuration
Access-Control-Allow-Origin: https://trusted-domain.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization`,
    tools: ['CORS Tester', 'Burp Suite', 'OWASP ZAP'],
    references: ['https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS', 'https://portswigger.net/web-security/cors']
  },
  {
    id: 'ssl-tls-hardening',
    title: 'SSL/TLS Configuration Hardening',
    vulnerability: 'Weak SSL/TLS Configuration',
    severity: 'high',
    category: 'network',
    description: 'Weak SSL/TLS configurations can expose encrypted communications to attacks.',
    impact: 'Man-in-the-middle attacks, data interception, credential theft',
    solution: 'Disable weak protocols, use strong cipher suites, implement HSTS, and ensure proper certificate validation.',
    codeExample: `# Nginx SSL Configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
ssl_prefer_server_ciphers off;
add_header Strict-Transport-Security "max-age=63072000" always;`,
    tools: ['SSL Labs Test', 'testssl.sh', 'nmap'],
    references: ['https://wiki.mozilla.org/Security/Server_Side_TLS', 'https://owasp.org/www-project-cheat-sheets/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html']
  },
  {
    id: 'security-headers',
    title: 'Security Headers Implementation',
    vulnerability: 'Missing Security Headers',
    severity: 'medium',
    category: 'web',
    description: 'Missing security headers leave applications vulnerable to various client-side attacks.',
    impact: 'XSS attacks, clickjacking, MIME sniffing attacks, information disclosure',
    solution: 'Implement comprehensive security headers including CSP, HSTS, X-Frame-Options, and others.',
    codeExample: `# Apache .htaccess
Header always set Content-Security-Policy "default-src 'self'"
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set Strict-Transport-Security "max-age=31536000"
Header always set Referrer-Policy "strict-origin-when-cross-origin"`,
    tools: ['Security Headers Scanner', 'OWASP ZAP', 'Mozilla Observatory'],
    references: ['https://owasp.org/www-project-secure-headers/', 'https://securityheaders.com/']
  },
  {
    id: 'open-ports',
    title: 'Open Port Security',
    vulnerability: 'Unnecessary Open Ports',
    severity: 'medium',
    category: 'network',
    description: 'Unnecessary open ports increase the attack surface and provide entry points for attackers.',
    impact: 'Unauthorized access, service exploitation, lateral movement',
    solution: 'Close unnecessary ports, implement firewall rules, use port knocking, and monitor network traffic.',
    codeExample: `# iptables firewall rules
iptables -A INPUT -p tcp --dport 22 -s trusted_ip -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -j DROP`,
    tools: ['nmap', 'netstat', 'ss', 'iptables'],
    references: ['https://www.cisecurity.org/controls/', 'https://nvd.nist.gov/800-53/Rev4/control/SC-7']
  }
];

function Solutions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.vulnerability.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || solution.category === categoryFilter;
    const matchesSeverity = !severityFilter || solution.severity === severityFilter;
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-900/20 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-700 border-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web': return <Code className="w-5 h-5" />;
      case 'network': return <Shield className="w-5 h-5" />;
      case 'system': return <Lock className="w-5 h-5" />;
      case 'database': return <FileText className="w-5 h-5" />;
      default: return <Bug className="w-5 h-5" />;
    }
  };

  if (selectedSolution) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setSelectedSolution(null)}
            className="text-green-400 hover:text-green-300 transition-colors mb-4"
          >
            ← Back to Solutions
          </button>
          <div className="flex items-center space-x-3 mb-4">
            {getCategoryIcon(selectedSolution.category)}
            <h1 className="text-3xl font-bold text-white">{selectedSolution.title}</h1>
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(selectedSolution.severity)}`}>
              {selectedSolution.severity.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vulnerability Description */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Vulnerability Overview</h2>
              <p className="text-gray-300 mb-4">{selectedSolution.description}</p>
              
              <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-4">
                <h3 className="text-red-400 font-medium mb-2 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Potential Impact</span>
                </h3>
                <p className="text-red-200 text-sm">{selectedSolution.impact}</p>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span>Solution & Remediation</span>
              </h2>
              <p className="text-gray-300 mb-4">{selectedSolution.solution}</p>
              
              {selectedSolution.codeExample && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Code Example</h3>
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <code className="text-sm text-gray-300">{selectedSolution.codeExample}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* References */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Additional Resources</h2>
              <div className="space-y-2">
                {selectedSolution.references.map((ref, index) => (
                  <a
                    key={index}
                    href={ref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    {ref}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Vulnerability:</span>
                  <div className="text-white font-medium">{selectedSolution.vulnerability}</div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Category:</span>
                  <div className="text-white font-medium capitalize">{selectedSolution.category}</div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Severity:</span>
                  <div className={`font-medium capitalize ${
                    selectedSolution.severity === 'critical' ? 'text-red-400' :
                    selectedSolution.severity === 'high' ? 'text-orange-400' :
                    selectedSolution.severity === 'medium' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    {selectedSolution.severity}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Tools */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Recommended Tools</h3>
              <div className="space-y-2">
                {selectedSolution.tools.map((tool, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 text-sm">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Eye className="w-8 h-8 text-green-400" />
          <h1 className="text-3xl font-bold text-white">Security Solutions</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Comprehensive remediation guides and solutions for common security vulnerabilities
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
              Search Solutions
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vulnerabilities, solutions..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              <option value="web">Web Application</option>
              <option value="network">Network Security</option>
              <option value="system">System Security</option>
              <option value="database">Database Security</option>
            </select>
          </div>

          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-300 mb-2">
              Severity
            </label>
            <select
              id="severity"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSolutions.map((solution) => (
          <div
            key={solution.id}
            onClick={() => setSelectedSolution(solution)}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getCategoryIcon(solution.category)}
                <div>
                  <h3 className="text-lg font-semibold text-white">{solution.title}</h3>
                  <p className="text-gray-400 text-sm capitalize">{solution.category} Security</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(solution.severity)}`}>
                {solution.severity.toUpperCase()}
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 line-clamp-3">{solution.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Bug className="w-4 h-4" />
                <span>{solution.vulnerability}</span>
              </div>
              <div className="text-green-400 text-sm font-medium">
                View Solution →
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSolutions.length === 0 && (
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Solutions Found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-green-900/10 border border-green-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-3">Security Solutions Database</h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>• Comprehensive remediation guides for common security vulnerabilities</p>
          <p>• Step-by-step implementation instructions with code examples</p>
          <p>• Recommended tools and resources for each vulnerability type</p>
          <p>• Regular updates with latest security best practices and standards</p>
          <p>• Suitable for developers, security professionals, and system administrators</p>
        </div>
      </div>
    </div>
  );
}

export default Solutions;