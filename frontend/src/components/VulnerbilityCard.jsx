import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Copy, CheckCircle } from 'lucide-react';

const VulnerabilityCard = ({ vulnerability, getSeverityColor, getSeverityIcon }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(label);
      setTimeout(() => setCopyStatus(''), 2000);
    });
  };

  const getRiskScoreColor = (score) => {
    if (score >= 8) return 'text-red-600 bg-red-100';
    if (score >= 6) return 'text-orange-600 bg-orange-100';
    if (score >= 4) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vulnerability.severity)}`}>
                {getSeverityIcon(vulnerability.severity)}
                <span className="ml-1">{vulnerability.severity}</span>
              </span>
              <span className="text-sm text-gray-500">
                {vulnerability.type}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskScoreColor(vulnerability.riskScore)}`}>
                Risk: {vulnerability.riskScore}/10
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {vulnerability.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3">
              {vulnerability.description}
            </p>
            
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <span className="font-medium">Location:</span>
                <span className="ml-1">
                  {vulnerability.location.file} (Line {vulnerability.location.startLine}
                  {vulnerability.location.startLine !== vulnerability.location.endLine && 
                    `-${vulnerability.location.endLine}`}
                  {vulnerability.location.function && ` in ${vulnerability.location.function}()`})
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Method:</span>
                <span className="ml-1">{vulnerability.detectionMethod}</span>
              </div>
            </div>
          </div>
          
          <div className="ml-4">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="space-y-6">
            {/* Impact & Likelihood */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Impact Analysis</h4>
                <p className="text-sm text-gray-700 mb-2">{vulnerability.impact}</p>
                {vulnerability.potentialLoss && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="text-sm">
                      <span className="font-medium text-red-800">Potential Loss: </span>
                      <span className="text-red-700">{vulnerability.potentialLoss}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Likelihood</h4>
                <p className="text-sm text-gray-700">{vulnerability.likelihood}</p>
                {vulnerability.cweId && (
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span>CWE ID: {vulnerability.cweId}</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </div>
                )}
              </div>
            </div>

            {/* Recommendation */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-800">{vulnerability.recommendation}</p>
              </div>
            </div>

            {/* Code Fix (if available) */}
            {vulnerability.suggestedFix && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">AI-Generated Fix</h4>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {/* Fix Description */}
                  <div className="p-4 bg-blue-50 border-b border-gray-200">
                    <p className="text-sm text-blue-800 font-medium">
                      {vulnerability.suggestedFix.description}
                    </p>
                    {vulnerability.suggestedFix.riskReduction && (
                      <p className="text-xs text-blue-600 mt-1">
                        Risk Reduction: {vulnerability.suggestedFix.riskReduction}
                      </p>
                    )}
                  </div>

                  {/* Before/After Code */}
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Original Code */}
                    <div className="border-b lg:border-b-0 lg:border-r border-gray-200">
                      <div className="px-4 py-2 bg-red-50 border-b border-gray-200 flex items-center justify-between">
                        <span className="text-sm font-medium text-red-800">❌ Vulnerable Code</span>
                        <button
                          onClick={() => copyToClipboard(vulnerability.suggestedFix.originalCode, 'original')}
                          className="text-red-600 hover:text-red-800"
                        >
                          {copyStatus === 'original' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <pre className="p-4 text-xs bg-white overflow-x-auto">
                        <code className="text-red-700">
                          {vulnerability.suggestedFix.originalCode}
                        </code>
                      </pre>
                    </div>

                    {/* Fixed Code */}
                    <div>
                      <div className="px-4 py-2 bg-green-50 border-b border-gray-200 flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">✅ Fixed Code</span>
                        <button
                          onClick={() => copyToClipboard(vulnerability.suggestedFix.fixedCode, 'fixed')}
                          className="text-green-600 hover:text-green-800"
                        >
                          {copyStatus === 'fixed' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <pre className="p-4 text-xs bg-white overflow-x-auto">
                        <code className="text-green-700">
                          {vulnerability.suggestedFix.fixedCode}
                        </code>
                      </pre>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">How This Fix Works:</h5>
                    <p className="text-sm text-gray-700">{vulnerability.suggestedFix.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* References */}
            {vulnerability.references && vulnerability.references.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Additional Resources</h4>
                <div className="space-y-1">
                  {vulnerability.references.map((ref, index) => (
                    <a
                      key={index}
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Learn more about this vulnerability
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => copyToClipboard(`${vulnerability.title}: ${vulnerability.description}`, 'summary')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                {copyStatus === 'summary' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                Copy Summary
              </button>
              
              {vulnerability.cweId && (
                <a
                  href={`https://cwe.mitre.org/data/definitions/${vulnerability.cweId.replace('CWE-', '')}.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View CWE Details
                </a>
              )}
              
              <button
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([`
VULNERABILITY REPORT
==================

Title: ${vulnerability.title}
Severity: ${vulnerability.severity}
Type: ${vulnerability.type}
Risk Score: ${vulnerability.riskScore}/10

Location: 
${vulnerability.location.file} (Lines ${vulnerability.location.startLine}-${vulnerability.location.endLine})
${vulnerability.location.function ? `Function: ${vulnerability.location.function}()` : ''}

Description:
${vulnerability.description}

Impact:
${vulnerability.impact}

Likelihood:
${vulnerability.likelihood}

Recommendation:
${vulnerability.recommendation}

${vulnerability.potentialLoss ? `Potential Loss: ${vulnerability.potentialLoss}` : ''}
${vulnerability.cweId ? `CWE ID: ${vulnerability.cweId}` : ''}

Detection Method: ${vulnerability.detectionMethod}

${vulnerability.suggestedFix ? `
SUGGESTED FIX:
${vulnerability.suggestedFix.description}

Original Code:
${vulnerability.suggestedFix.originalCode}

Fixed Code:
${vulnerability.suggestedFix.fixedCode}

Explanation:
${vulnerability.suggestedFix.explanation}

Risk Reduction: ${vulnerability.suggestedFix.riskReduction}
` : ''}
                  `], { type: 'text/plain' });
                  
                  element.href = URL.createObjectURL(file);
                  element.download = `${vulnerability.id}_report.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <span className="mr-1">📄</span>
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VulnerabilityCard;