import React from 'react';
import { AlertTriangle, Shield, TrendingUp } from 'lucide-react';

const RiskScore = ({ score, totalVulnerabilities }) => {
  const getRiskLevel = (score) => {
    if (score >= 8) return { level: 'CRITICAL', color: 'red', description: 'Immediate action required' };
    if (score >= 6) return { level: 'HIGH', color: 'orange', description: 'Should be addressed soon' };
    if (score >= 4) return { level: 'MEDIUM', color: 'yellow', description: 'Monitor and plan fixes' };
    if (score >= 2) return { level: 'LOW', color: 'blue', description: 'Low priority issues' };
    return { level: 'MINIMAL', color: 'green', description: 'Good security posture' };
  };

  const riskInfo = getRiskLevel(score);
  
  const getColorClasses = (color) => {
    const colorMap = {
      red: {
        bg: 'bg-red-500',
        text: 'text-red-600',
        bgLight: 'bg-red-50',
        border: 'border-red-200',
        ring: 'ring-red-500'
      },
      orange: {
        bg: 'bg-orange-500',
        text: 'text-orange-600',
        bgLight: 'bg-orange-50',
        border: 'border-orange-200',
        ring: 'ring-orange-500'
      },
      yellow: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-600',
        bgLight: 'bg-yellow-50',
        border: 'border-yellow-200',
        ring: 'ring-yellow-500'
      },
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        bgLight: 'bg-blue-50',
        border: 'border-blue-200',
        ring: 'ring-blue-500'
      },
      green: {
        bg: 'bg-green-500',
        text: 'text-green-600',
        bgLight: 'bg-green-50',
        border: 'border-green-200',
        ring: 'ring-green-500'
      }
    };
    return colorMap[color];
  };

  const colors = getColorClasses(riskInfo.color);
  const percentage = (score / 10) * 100;

  const getRiskIcon = () => {
    switch (riskInfo.level) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertTriangle className="w-6 h-6" />;
      case 'MEDIUM':
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Risk Score Gauge */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Overall Risk Score</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.text} ${colors.bgLight} ${colors.border} border`}>
            {getRiskIcon()}
            <span className="ml-2">{riskInfo.level}</span>
          </div>
        </div>

        {/* Score Display */}
        <div className="relative">
          <div className="flex items-end space-x-2 mb-4">
            <div className="text-6xl font-bold text-gray-900">
              {score.toFixed(1)}
            </div>
            <div className="text-2xl font-medium text-gray-500 pb-2">
              / 10
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-out ${colors.bg}`}
              style={{ width: `${percentage}%` }}
            />
            {/* Score markers */}
            <div className="absolute inset-0 flex justify-between items-center px-1">
              {[2, 4, 6, 8].map((marker) => (
                <div
                  key={marker}
                  className="w-px h-full bg-white opacity-50"
                  style={{ marginLeft: `${(marker / 10) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Scale Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0 - Secure</span>
            <span>2 - Low</span>
            <span>4 - Medium</span>
            <span>6 - High</span>
            <span>8 - Critical</span>
            <span>10</span>
          </div>
        </div>

        <p className={`text-sm mt-4 ${colors.text}`}>
          {riskInfo.description}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">{totalVulnerabilities}</p>
            </div>
            <div className={`w-12 h-12 rounded-full ${colors.bgLight} ${colors.border} border flex items-center justify-center`}>
              <AlertTriangle className={`w-6 h-6 ${colors.text}`} />
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Risk Assessment</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Security Score</span>
              <span className={`text-xs font-medium ${colors.text}`}>
                {score >= 8 ? 'Poor' : score >= 6 ? 'Fair' : score >= 4 ? 'Good' : 'Excellent'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Deployment Ready</span>
              <span className={`text-xs font-medium ${score <= 4 ? 'text-green-600' : 'text-red-600'}`}>
                {score <= 4 ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Audit Required</span>
              <span className={`text-xs font-medium ${score >= 6 ? 'text-red-600' : 'text-green-600'}`}>
                {score >= 6 ? 'Yes' : 'Optional'}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Next Steps</h4>
          <div className="space-y-2">
            {score >= 8 && (
              <div className="text-xs text-red-700 bg-red-50 p-2 rounded">
                🚨 Do not deploy - critical vulnerabilities present
              </div>
            )}
            {score >= 6 && score < 8 && (
              <div className="text-xs text-orange-700 bg-orange-50 p-2 rounded">
                ⚠️ Fix high-severity issues before deployment
              </div>
            )}
            {score >= 4 && score < 6 && (
              <div className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                ⚡ Address medium-priority vulnerabilities
              </div>
            )}
            {score >= 2 && score < 4 && (
              <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                👍 Good security posture - minor issues to review
              </div>
            )}
            {score < 2 && (
              <div className="text-xs text-green-700 bg-green-50 p-2 rounded">
                ✅ Excellent security - ready for deployment
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskScore;