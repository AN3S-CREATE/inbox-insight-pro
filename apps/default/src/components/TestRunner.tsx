import React from 'react';
import { Play, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface TestCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  tests: string[];
}

interface TestRunnerProps {
  categories: TestCategory[];
  onRunTests: () => void;
  isRunning: boolean;
  currentTest: string;
}

const TestRunner: React.FC<TestRunnerProps> = ({ categories, onRunTests, isRunning, currentTest }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-green-400 glow-text matrix-text">AUTOMATED TEST SUITE</h2>
          <p className="text-green-600 mt-2 matrix-text">Comprehensive testing for all DocuFlow AI components</p>
        </div>
        
        <button
          onClick={onRunTests}
          disabled={isRunning}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all matrix-text ${
            isRunning
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
              : 'bg-gradient-to-r from-green-500 to-green-600 text-black hover:from-green-400 hover:to-green-500 shadow-lg shadow-green-500/50 glow-box pulse-glow border border-green-400'
          }`}
        >
          {isRunning ? (
            <>
              <Clock className="w-5 h-5 animate-pulse" />
              <span>RUNNING TESTS...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>RUN ALL TESTS</span>
            </>
          )}
        </button>
      </div>

      {/* Test Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cyber-card rounded-2xl p-6 neon-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 matrix-text">TOTAL TEST CATEGORIES</p>
              <p className="text-2xl font-bold text-green-400 glow-text">{categories.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500 pulse-glow" />
          </div>
        </div>
        
        <div className="cyber-card rounded-2xl p-6 neon-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 matrix-text">TOTAL TEST CASES</p>
              <p className="text-2xl font-bold text-green-400 glow-text">
                {categories.reduce((sum, cat) => sum + cat.tests.length, 0)}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-green-500 pulse-glow" />
          </div>
        </div>
        
        <div className="cyber-card rounded-2xl p-6 neon-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 matrix-text">COVERAGE AREAS</p>
              <p className="text-2xl font-bold text-green-400 glow-text">7</p>
            </div>
            <Play className="w-8 h-8 text-green-500 pulse-glow" />
          </div>
        </div>
      </div>

      {/* Test Categories */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-400 glow-text matrix-text">TEST CATEGORIES</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="cyber-card rounded-2xl neon-border">
                <div className="p-6 border-b border-green-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500/30 to-green-600/30 rounded-xl flex items-center justify-center border border-green-500/50 glow-box">
                      <Icon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-400 matrix-text">{category.name}</h4>
                      <p className="text-sm text-green-600 matrix-text">{category.tests.length} test cases</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    {category.tests.map((test, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg hover:bg-green-500/10 transition-colors">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0 pulse-glow"></div>
                        <p className="text-sm text-green-300 leading-relaxed matrix-text">{test}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Test Status */}
      {isRunning && currentTest && (
        <div className="cyber-card border border-green-500/50 rounded-2xl p-6 glow-box pulse-glow">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500/30 border border-green-500/50 rounded-full flex items-center justify-center glow-box">
              <Clock className="w-4 h-4 text-green-400 animate-pulse" />
            </div>
            <div>
              <h4 className="font-semibold text-green-300 matrix-text">CURRENTLY RUNNING</h4>
              <p className="text-green-500 matrix-text">{currentTest}</p>
            </div>
          </div>
        </div>
      )}

      {/* Test Instructions */}
      <div className="cyber-card rounded-2xl p-6 border border-green-500/30">
        <h4 className="font-semibold text-green-400 mb-3 matrix-text glow-text">HOW THE AUTOMATED TESTING WORKS</h4>
        <div className="space-y-2 text-sm text-green-300 matrix-text">
          <p>• <strong className="text-green-400">API TESTING:</strong> Validates all webhook endpoints and document processing</p>
          <p>• <strong className="text-green-400">AI VALIDATION:</strong> Tests natural language queries and document analysis</p>
          <p>• <strong className="text-green-400">PERFORMANCE MONITORING:</strong> Measures response times and identifies bottlenecks</p>
          <p>• <strong className="text-green-400">ERROR HANDLING:</strong> Checks system behavior with invalid inputs</p>
          <p>• <strong className="text-green-400">INTEGRATION TESTING:</strong> Verifies end-to-end workflows</p>
          <p>• <strong className="text-green-400">REPORT GENERATION:</strong> Creates detailed JSON reports for analysis</p>
        </div>
      </div>

      <style>{`
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

export default TestRunner;