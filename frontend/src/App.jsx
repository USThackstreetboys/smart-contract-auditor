import React, { useState, useCallback } from 'react';
import { Shield, Upload, FileText, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import VulnerabilityCard from './components/VulnerabilityCard';
import RiskScore from './components/RiskScore';
import ReportViewer from './components/ReportViewer';
import { analyzeContract, getSampleContracts } from './services/api';
import './App.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('upload');
  const [sampleContracts, setSampleContracts] = useState([]);

  // Handle file upload and analysis
  const handleFileAnalysis = useCallback(async (file) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeContract(file);
      setAnalysisResult(result);
      setSelectedTab('results');
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Load sample contracts
  const loadSampleContracts = useCallback(async () => {
    try {
      const samples = await getSampleContracts();
      setSampleContracts(samples.samples || []);
    } catch (err) {
      console.error('Failed to load sample contracts:', err);
    }
  }, []);

  // Handle sample contract selection
  const handleSampleContract = useCallback(async (contractContent, contractName) => {
    const blob = new Blob([contractContent], { type: 'text/plain' });
    const file = new File([blob], contractName, { type: 'text/plain' });
    await handleFileAnalysis(file);
  }, [handleFileAnalysis]);

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-50';
      case 'HIGH': return 'text-orange-600 bg-orange-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL': return <AlertTriangle className="w-5 h-5" />;
      case 'HIGH': return <AlertTriangle className="w-5 h-5" />;
      case 'MEDIUM': return <AlertTriangle className="w-5 h-5" />;
      case 'LOW': return <Info className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Smart Contract AI Auditor
                </h1>
                <p className="text-gray-600 mt-1">
                  AI-powered vulnerability detection for smart contracts
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setSelectedTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Contract
            </button>
            <button
              onClick={() => {
                setSelectedTab('samples');
                loadSampleContracts();
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'samples'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Sample Contracts
            </button>
            {analysisResult && (
              <button
                onClick={() => setSelectedTab('results')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'results'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Analysis Results
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Tab */}
        {selectedTab === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Upload Your Smart Contract
              </h2>
              <p className="text-gray-600 mb-8">
                Get AI-powered security analysis in seconds. Upload your Solidity contract to detect vulnerabilities, 
                security flaws, and get automated fix suggestions.
              </p>
            </div>
            
            <FileUpload
              onFileSelect={handleFileAnalysis}
              isAnalyzing={isAnalyzing}
              error={error}
            />

            {isAnalyzing && (
              <div className="text-center py-8">
                <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-blue-600 bg-blue-50">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI is analyzing your contract...
                </div>
                <p className="text-gray-500 mt-2">
                  This usually takes 15-30 seconds depending on contract complexity
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sample Contracts Tab */}
        {selectedTab === 'samples' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Try Sample Vulnerable Contracts
              </h2>
              <p className="text-gray-600 mb-8">
                Test the AI auditor with these intentionally vulnerable contracts that demonstrate common security issues.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sampleContracts.map((contract, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {contract.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {contract.description}
                  </p>
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Expected Vulnerabilities:</div>
                    <div className="flex flex-wrap gap-1">
                      {contract.vulnerabilityTypes.map((type, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSampleContract(contract.content, contract.name)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Contract'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {selectedTab === 'results' && analysisResult && (
          <div className="space-y-8">
            {/* Analysis Header */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Analysis Results
                  </h2>
                  <p className="text-gray-600">
                    Contract: {analysisResult.contractName} ({analysisResult.fileName})
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(analysisResult.analysisTimestamp).toLocaleString()}
                </div>
              </div>

              {/* Risk Score */}
              <RiskScore 
                score={analysisResult.overallRiskScore}
                totalVulnerabilities={analysisResult.totalVulnerabilities}
              />
            </div>

            {/* Vulnerability Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vulnerability Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Critical', count: analysisResult.vulnerabilities.filter(v => v.severity === 'CRITICAL').length, color: 'bg-red-100 text-red-800' },
                  { label: 'High', count: analysisResult.vulnerabilities.filter(v => v.severity === 'HIGH').length, color: 'bg-orange-100 text-orange-800' },
                  { label: 'Medium', count: analysisResult.vulnerabilities.filter(v => v.severity === 'MEDIUM').length, color: 'bg-yellow-100 text-yellow-800' },
                  { label: 'Low', count: analysisResult.vulnerabilities.filter(v => v.severity === 'LOW').length, color: 'bg-blue-100 text-blue-800' },
                  { label: 'Info', count: analysisResult.vulnerabilities.filter(v => v.severity === 'INFO').length, color: 'bg-gray-100 text-gray-800' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${item.color} mb-2`}>
                      <span className="text-lg font-bold">{item.count}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vulnerabilities List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Detected Vulnerabilities ({analysisResult.vulnerabilities.length})
              </h3>
              
              {analysisResult.vulnerabilities.length === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    No Vulnerabilities Detected
                  </h3>
                  <p className="text-green-600">
                    Great! This contract appears to follow security best practices.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysisResult.vulnerabilities
                    .sort((a, b) => {
                      const severityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3, 'INFO': 4 };
                      return severityOrder[a.severity] - severityOrder[b.severity];
                    })
                    .map((vulnerability, index) => (
                      <VulnerabilityCard
                        key={index}
                        vulnerability={vulnerability}
                        getSeverityColor={getSeverityColor}
                        getSeverityIcon={getSeverityIcon}
                      />
                    ))}
                </div>
              )}
            </div>

            {/* AI Insights */}
            {analysisResult.aiInsights && analysisResult.aiInsights.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  AI Insights
                </h3>
                <div className="space-y-3">
                  {analysisResult.aiInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-900">{insight.category}</div>
                        <div className="text-blue-700 text-sm">{insight.insight}</div>
                        <div className="text-xs text-blue-600 mt-1">
                          Confidence: {Math.round(insight.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Report Download */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Export Report
              </h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    const jsonData = JSON.stringify(analysisResult, null, 2);
                    const blob = new Blob([jsonData], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${analysisResult.contractName}_analysis.json`;
                    a.click();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Download JSON Report
                </button>
                <button
                  onClick={() => {
                    // Create a formatted text report
                    let report = `SMART CONTRACT SECURITY ANALYSIS REPORT\n`;
                    report += `==========================================\n\n`;
                    report += `Contract: ${analysisResult.contractName}\n`;
                    report += `File: ${analysisResult.fileName}\n`;
                    report += `Analysis Date: ${new Date(analysisResult.analysisTimestamp).toLocaleString()}\n`;
                    report += `Overall Risk Score: ${analysisResult.overallRiskScore}/10\n`;
                    report += `Total Vulnerabilities: ${analysisResult.totalVulnerabilities}\n\n`;
                    
                    if (analysisResult.vulnerabilities.length > 0) {
                      report += `VULNERABILITIES FOUND:\n`;
                      report += `=====================\n\n`;
                      
                      analysisResult.vulnerabilities.forEach((vuln, index) => {
                        report += `${index + 1}. ${vuln.title}\n`;
                        report += `   Severity: ${vuln.severity}\n`;
                        report += `   Type: ${vuln.type}\n`;
                        report += `   Location: Line ${vuln.location.startLine}`;
                        if (vuln.location.function) {
                          report += ` in function ${vuln.location.function}()`;
                        }
                        report += `\n`;
                        report += `   Description: ${vuln.description}\n`;
                        report += `   Impact: ${vuln.impact}\n`;
                        report += `   Recommendation: ${vuln.recommendation}\n\n`;
                      });
                    } else {
                      report += `No vulnerabilities detected. Contract appears secure.\n`;
                    }
                    
                    const blob = new Blob([report], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${analysisResult.contractName}_report.txt`;
                    a.click();
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Download Text Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Analysis Error</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;