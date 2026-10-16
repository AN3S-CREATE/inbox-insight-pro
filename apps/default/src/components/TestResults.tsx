import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, Download, Filter, Search, Eye } from 'lucide-react';

interface TestResult {
  id: string;
  category: string;
  testName: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  duration: number;
  details: string;
  timestamp: string;
  data?: any;
}

interface TestResultsProps {
  results: TestResult[];
  onGenerateReport: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({ results, onGenerateReport }) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-400 pulse-glow" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400 pulse-glow" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400 pulse-glow" />;
      case 'running':
        return <Clock className="w-5 h-5 text-green-400 animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'running':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const filteredResults = results.filter(result => {
    const matchesFilter = filter === 'all' || result.status === filter;
    const matchesSearch = result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    passed: results.filter(r => r.status === 'passed').length,
    failed: results.filter(r => r.status === 'failed').length,
    warning: results.filter(r => r.status === 'warning').length,
    running: results.filter(r => r.status === 'running').length,
    total: results.length
  };

  const successRate = results.length > 0 ? Math.round((statusCounts.passed / results.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-green-400 glow-text matrix-text">TEST RESULTS</h2>
          <p className="text-green-600 mt-2 matrix-text">
            {results.length > 0 ? `${results.length} TESTS COMPLETED` : 'NO TEST RESULTS YET'}
          </p>
        </div>
        
        {results.length > 0 && (
          <button
            onClick={onGenerateReport}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-black rounded-xl hover:from-green-400 hover:to-green-500 transition-all shadow-lg shadow-green-500/50 glow-box pulse-glow matrix-text font-bold"
          >
            <Download className="w-5 h-5" />
            <span>DOWNLOAD REPORT</span>
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-4 glow-box">
            <Clock className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-green-400 mb-2 matrix-text">NO TEST RESULTS</h3>
          <p className="text-green-600 matrix-text">Run the test suite to see results here</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="cyber-card rounded-xl p-4 neon-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 matrix-text">TOTAL TESTS</p>
                  <p className="text-xl font-bold text-green-400 glow-text">{statusCounts.total}</p>
                </div>
                <Clock className="w-6 h-6 text-green-500 pulse-glow" />
              </div>
            </div>
            
            <div className="cyber-card rounded-xl p-4 neon-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 matrix-text">PASSED</p>
                  <p className="text-xl font-bold text-green-400 glow-text">{statusCounts.passed}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-400 pulse-glow" />
              </div>
            </div>
            
            <div className="cyber-card rounded-xl p-4 neon-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 matrix-text">FAILED</p>
                  <p className="text-xl font-bold text-red-400 glow-text">{statusCounts.failed}</p>
                </div>
                <XCircle className="w-6 h-6 text-red-400 pulse-glow" />
              </div>
            </div>
            
            <div className="cyber-card rounded-xl p-4 neon-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 matrix-text">WARNINGS</p>
                  <p className="text-xl font-bold text-yellow-400 glow-text">{statusCounts.warning}</p>
                </div>
                <AlertTriangle className="w-6 h-6 text-yellow-400 pulse-glow" />
              </div>
            </div>
            
            <div className="cyber-card rounded-xl p-4 neon-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 matrix-text">SUCCESS RATE</p>
                  <p className="text-xl font-bold text-green-400 glow-text">{successRate}%</p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  successRate >= 80 ? 'bg-green-500/30 border border-green-500/50' : 
                  successRate >= 60 ? 'bg-yellow-500/30 border border-yellow-500/50' : 
                  'bg-red-500/30 border border-red-500/50'
                } glow-box`}>
                  <div className={`w-3 h-3 rounded-full ${
                    successRate >= 80 ? 'bg-green-400' : successRate >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                  } pulse-glow`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="cyber-card rounded-xl p-6 neon-border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-green-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 bg-black border border-green-500/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-400 matrix-text glow-box"
                >
                  <option value="all">ALL RESULTS</option>
                  <option value="passed">PASSED ONLY</option>
                  <option value="failed">FAILED ONLY</option>
                  <option value="warning">WARNINGS ONLY</option>
                  <option value="running">RUNNING</option>
                </select>
              </div>
              
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-green-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="SEARCH TESTS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black border border-green-500/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-400 placeholder-green-600 matrix-text glow-box"
                />
              </div>
            </div>
          </div>

          {/* Test Results List */}
          <div className="cyber-card rounded-xl neon-border">
            <div className="p-6 border-b border-green-500/30">
              <h3 className="text-lg font-semibold text-green-400 matrix-text glow-text">
                TEST RESULTS ({filteredResults.length})
              </h3>
            </div>
            
            <div className="divide-y divide-green-500/20">
              {filteredResults.map((result) => (
                <div key={result.id} className="p-6 hover:bg-green-500/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {getStatusIcon(result.status)}
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-green-400 matrix-text">{result.testName}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border matrix-text ${getStatusColor(result.status)}`}>
                            {result.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-green-600 mb-2 matrix-text">{result.category}</p>
                        <p className="text-sm text-green-300 matrix-text">{result.details}</p>
                        
                        <div className="flex items-center space-x-4 mt-3 text-xs text-green-500 matrix-text">
                          <span>DURATION: {result.duration}ms</span>
                          <span>TIME: {new Date(result.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {result.data && (
                      <button
                        onClick={() => setSelectedResult(result)}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors border border-green-500/30 glow-box matrix-text"
                      >
                        <Eye className="w-4 h-4" />
                        <span>VIEW DATA</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Data Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="cyber-card rounded-xl max-w-2xl w-full max-h-96 overflow-hidden neon-border glow-box">
            <div className="p-6 border-b border-green-500/30">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-green-400 matrix-text glow-text">TEST DATA</h3>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="text-green-400 hover:text-green-300 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-green-600 mt-1 matrix-text">{selectedResult.testName}</p>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <pre className="bg-black/50 border border-green-500/30 rounded-lg p-4 text-sm overflow-x-auto text-green-300 matrix-text glow-box">
                {JSON.stringify(selectedResult.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
        }
        
        .glow-box {
          box-shadow: 
            0 0 10px rgba(0, 255, 0, 0.3),
            0 0 20px rgba(0, 255, 0, 0.2),
            inset 0 0 10px rgba(0, 255, 0, 0.1);
        }
        
        .neon-border {
          border: 1px solid #00ff00;
          box-shadow: 
            0 0 5px #00ff00,
            inset 0 0 5px rgba(0, 255, 0, 0.1);
        }
        
        .cyber-card {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 50, 0, 0.3) 100%);
          border: 1px solid rgba(0, 255, 0, 0.3);
          box-shadow: 
            0 4px 15px rgba(0, 255, 0, 0.1),
            inset 0 1px 0 rgba(0, 255, 0, 0.2);
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes pulse-glow {
          from {
            box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
          }
          to {
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.6), 0 0 30px rgba(0, 255, 0, 0.4);
          }
        }
        
        .matrix-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
};

export default TestResults;