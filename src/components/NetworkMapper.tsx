import React, { useState, useEffect } from 'react';
import { Network, Search, MapPin, Server, Wifi, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface NetworkNode {
  id: string;
  ip: string;
  hostname?: string;
  type: 'router' | 'server' | 'workstation' | 'printer' | 'unknown';
  status: 'online' | 'offline' | 'unknown';
  ports: number[];
  os?: string;
  services: string[];
  vulnerabilities: number;
}

interface NetworkEdge {
  from: string;
  to: string;
  type: 'direct' | 'routed';
}

function NetworkMapper() {
  const [target, setTarget] = useState('');
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  const scanNetwork = async () => {
    if (!target) {
      setError('Please enter a network range (e.g., 192.168.1.0/24)');
      return;
    }

    setLoading(true);
    setError('');
    setNodes([]);
    setEdges([]);

    try {
      // Simulate network discovery
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Generate mock network topology
      const mockNodes: NetworkNode[] = [
        {
          id: '1',
          ip: '192.168.1.1',
          hostname: 'router.local',
          type: 'router',
          status: 'online',
          ports: [22, 80, 443],
          os: 'Linux',
          services: ['SSH', 'HTTP', 'HTTPS'],
          vulnerabilities: 0
        },
        {
          id: '2',
          ip: '192.168.1.10',
          hostname: 'server01.local',
          type: 'server',
          status: 'online',
          ports: [22, 80, 443, 3306],
          os: 'Ubuntu 20.04',
          services: ['SSH', 'Apache', 'MySQL'],
          vulnerabilities: 2
        },
        {
          id: '3',
          ip: '192.168.1.15',
          hostname: 'workstation01',
          type: 'workstation',
          status: 'online',
          ports: [135, 139, 445],
          os: 'Windows 10',
          services: ['RPC', 'NetBIOS', 'SMB'],
          vulnerabilities: 1
        },
        {
          id: '4',
          ip: '192.168.1.20',
          hostname: 'printer01',
          type: 'printer',
          status: 'online',
          ports: [80, 515, 631],
          services: ['HTTP', 'LPD', 'IPP'],
          vulnerabilities: 3
        },
        {
          id: '5',
          ip: '192.168.1.25',
          type: 'unknown',
          status: 'offline',
          ports: [],
          services: [],
          vulnerabilities: 0
        }
      ];

      const mockEdges: NetworkEdge[] = [
        { from: '1', to: '2', type: 'direct' },
        { from: '1', to: '3', type: 'direct' },
        { from: '1', to: '4', type: 'direct' },
        { from: '1', to: '5', type: 'direct' }
      ];

      setNodes(mockNodes);
      setEdges(mockEdges);
    } catch (err) {
      setError('Failed to scan network');
    } finally {
      setLoading(false);
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'router': return <Wifi className="w-6 h-6" />;
      case 'server': return <Server className="w-6 h-6" />;
      case 'workstation': return <Network className="w-6 h-6" />;
      case 'printer': return <MapPin className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

  const getNodeColor = (node: NetworkNode) => {
    if (node.status === 'offline') return 'bg-gray-600 border-gray-500';
    if (node.vulnerabilities > 2) return 'bg-red-600 border-red-500';
    if (node.vulnerabilities > 0) return 'bg-yellow-600 border-yellow-500';
    return 'bg-green-600 border-green-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Network className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Network Mapper</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Discover and visualize network topology, devices, and security posture
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="target" className="block text-sm font-medium text-gray-300 mb-2">
              Network Range (CIDR)
            </label>
            <input
              type="text"
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="192.168.1.0/24 or 10.0.0.0/16"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && scanNetwork()}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={scanNetwork}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Scanning...' : 'Map Network'}</span>
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

      {/* Network Visualization */}
      {(loading || nodes.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Network Map */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Network Topology</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
                      <p className="text-gray-400">Discovering network devices...</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
                    {/* Simple network visualization */}
                    <div className="absolute inset-0 p-8">
                      {/* Router at center */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div
                          onClick={() => setSelectedNode(nodes[0])}
                          className={`w-16 h-16 rounded-full border-2 ${getNodeColor(nodes[0])} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}
                        >
                          {getNodeIcon(nodes[0]?.type)}
                        </div>
                        <div className="text-center mt-2 text-xs text-white">{nodes[0]?.ip}</div>
                      </div>

                      {/* Other devices around router */}
                      {nodes.slice(1).map((node, index) => {
                        const angle = (index * 360) / (nodes.length - 1);
                        const radius = 120;
                        const x = Math.cos((angle * Math.PI) / 180) * radius;
                        const y = Math.sin((angle * Math.PI) / 180) * radius;

                        return (
                          <div
                            key={node.id}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                          >
                            <div
                              onClick={() => setSelectedNode(node)}
                              className={`w-12 h-12 rounded-full border-2 ${getNodeColor(node)} flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}
                            >
                              {getNodeIcon(node.type)}
                            </div>
                            <div className="text-center mt-1 text-xs text-white">{node.ip}</div>
                            
                            {/* Connection line to router */}
                            <svg className="absolute top-6 left-6 pointer-events-none" style={{ width: Math.abs(x), height: Math.abs(y) }}>
                              <line
                                x1={x > 0 ? 0 : Math.abs(x)}
                                y1={y > 0 ? 0 : Math.abs(y)}
                                x2={x > 0 ? Math.abs(x) : 0}
                                y2={y > 0 ? Math.abs(y) : 0}
                                stroke="#4B5563"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                              />
                            </svg>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Device Details */}
          <div>
            <div className="bg-gray-800 rounded-xl border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Device Details</h2>
              </div>
              <div className="p-6">
                {selectedNode ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full border-2 ${getNodeColor(selectedNode)} flex items-center justify-center`}>
                        {getNodeIcon(selectedNode.type)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{selectedNode.ip}</div>
                        <div className="text-gray-400 text-sm">{selectedNode.hostname || 'Unknown hostname'}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-400">Status</label>
                        <div className={`text-sm font-medium ${getStatusColor(selectedNode.status)}`}>
                          {selectedNode.status.toUpperCase()}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Device Type</label>
                        <div className="text-white text-sm capitalize">{selectedNode.type}</div>
                      </div>

                      {selectedNode.os && (
                        <div>
                          <label className="text-sm text-gray-400">Operating System</label>
                          <div className="text-white text-sm">{selectedNode.os}</div>
                        </div>
                      )}

                      <div>
                        <label className="text-sm text-gray-400">Open Ports</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedNode.ports.map(port => (
                            <span key={port} className="bg-blue-900/20 text-blue-400 px-2 py-1 rounded text-xs">
                              {port}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Services</label>
                        <div className="space-y-1 mt-1">
                          {selectedNode.services.map(service => (
                            <div key={service} className="text-sm text-gray-300">{service}</div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400">Vulnerabilities</label>
                        <div className={`text-sm font-medium ${
                          selectedNode.vulnerabilities > 2 ? 'text-red-400' :
                          selectedNode.vulnerabilities > 0 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {selectedNode.vulnerabilities} found
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Click on a device to view details</p>
                  </div>
                )}
              </div>
            </div>

            {/* Network Summary */}
            {nodes.length > 0 && (
              <div className="mt-6 bg-gray-800 rounded-xl border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Network Summary</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Devices</span>
                      <span className="text-white">{nodes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Online</span>
                      <span className="text-green-400">{nodes.filter(n => n.status === 'online').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Offline</span>
                      <span className="text-red-400">{nodes.filter(n => n.status === 'offline').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vulnerabilities</span>
                      <span className="text-yellow-400">{nodes.reduce((sum, n) => sum + n.vulnerabilities, 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-purple-900/10 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-3">Network Mapping</h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>• Network mapping discovers devices, services, and topology within a network range</p>
          <p>• Click on devices in the visualization to view detailed information</p>
          <p>• Vulnerability counts indicate potential security issues requiring attention</p>
          <p>• Use this tool for network inventory, security assessment, and troubleshooting</p>
          <p>• Always ensure you have permission before scanning networks you don't own</p>
        </div>
      </div>
    </div>
  );
}

export default NetworkMapper;