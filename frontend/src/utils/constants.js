// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    TIMEOUT: 120000, // 2 minutes
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    SUPPORTED_EXTENSIONS: ['.sol', '.vy'],
  };
  
  // Vulnerability Severity Levels
  export const SEVERITY_LEVELS = {
    CRITICAL: {
      value: 'CRITICAL',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      weight: 5
    },
    HIGH: {
      value: 'HIGH', 
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      weight: 4
    },
    MEDIUM: {
      value: 'MEDIUM',
      color: 'yellow', 
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      weight: 3
    },
    LOW: {
      value: 'LOW',
      color: 'blue',
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      weight: 2
    },
    INFO: {
      value: 'INFO',
      color: 'gray',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600', 
      borderColor: 'border-gray-200',
      weight: 1
    }
  };
  
  // Risk Score Thresholds
  export const RISK_THRESHOLDS = {
    CRITICAL: 8,
    HIGH: 6,
    MEDIUM: 4,
    LOW: 2,
    MINIMAL: 0
  };
  
  // Vulnerability Types
  export const VULNERABILITY_TYPES = {
    REENTRANCY: 'Reentrancy',
    ACCESS_CONTROL: 'Access Control',
    INTEGER_OVERFLOW: 'Integer Overflow', 
    UNCHECKED_CALLS: 'Unchecked Calls',
    GAS_ISSUES: 'Gas Issues',
    LOGIC_ERROR: 'Logic Error',
    AUTHORIZATION: 'Authorization',
    ARITHMETIC: 'Arithmetic',
    EXTERNAL_CALLS: 'External Calls'
  };
  
  // Analysis Status
  export const ANALYSIS_STATUS = {
    IDLE: 'idle',
    UPLOADING: 'uploading',
    ANALYZING: 'analyzing', 
    COMPLETED: 'completed',
    ERROR: 'error'
  };
  
  // File Upload Messages
  export const UPLOAD_MESSAGES = {
    DRAG_ACTIVE: 'Drop your contract file here',
    DRAG_INACTIVE: 'Drag and drop your smart contract here, or click to browse',
    UPLOADING: 'Uploading file...',
    ANALYZING: 'AI is analyzing your contract...',
    SUCCESS: 'Analysis completed successfully!',
    ERROR: 'Analysis failed. Please try again.'
  };
  
  // Error Messages
  export const ERROR_MESSAGES = {
    FILE_TOO_LARGE: 'File too large. Maximum size is 50MB.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload a .sol or .vy file.',
    UPLOAD_FAILED: 'Upload failed. Please try again.',
    ANALYSIS_FAILED: 'Analysis failed. Please check your connection and try again.',
    API_UNAVAILABLE: 'Analysis service is currently unavailable.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    TIMEOUT_ERROR: 'Analysis timed out. Please try again with a smaller file.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
  };
  
  // Success Messages  
  export const SUCCESS_MESSAGES = {
    ANALYSIS_COMPLETE: 'Analysis completed successfully!',
    REPORT_DOWNLOADED: 'Report downloaded successfully!',
    CODE_COPIED: 'Code copied to clipboard!',
    LINK_COPIED: 'Link copied to clipboard!'
  };
  
  // Sample Contract Descriptions
  export const SAMPLE_CONTRACT_INFO = {
    'vulnerable_bank.sol': {
      description: 'Banking contract with multiple vulnerabilities including reentrancy and access control flaws',
      expectedVulnerabilities: ['Reentrancy', 'Access Control', 'Integer Overflow'],
      riskLevel: 'HIGH',
      complexity: 'Medium'
    },
    'reentrancy_attack.sol': {
      description: 'Classic reentrancy vulnerability demonstration with attack contract',
      expectedVulnerabilities: ['Reentrancy'],
      riskLevel: 'CRITICAL', 
      complexity: 'Low'
    },
    'access_control_flaw.sol': {
      description: 'Contract demonstrating missing access control checks',
      expectedVulnerabilities: ['Access Control', 'Authorization'],
      riskLevel: 'HIGH',
      complexity: 'Low'
    }
  };
  
  // Chart Colors for Data Visualization
  export const CHART_COLORS = {
    CRITICAL: '#DC2626',
    HIGH: '#EA580C',
    MEDIUM: '#D97706', 
    LOW: '#2563EB',
    INFO: '#6B7280',
    SUCCESS: '#059669',
    PRIMARY: '#3B82F6'
  };
  
  // Animation Durations
  export const ANIMATIONS = {
    FAST: '150ms',
    NORMAL: '300ms', 
    SLOW: '500ms',
    VERY_SLOW: '1000ms'
  };
  
  // Local Storage Keys
  export const STORAGE_KEYS = {
    RECENT_ANALYSES: 'recent_analyses',
    USER_PREFERENCES: 'user_preferences',
    THEME: 'theme_preference'
  };
  
  // Navigation Tabs
  export const NAV_TABS = {
    UPLOAD: 'upload',
    SAMPLES: 'samples', 
    RESULTS: 'results',
    HISTORY: 'history'
  };
  
  // Report Export Formats
  export const EXPORT_FORMATS = {
    JSON: 'json',
    PDF: 'pdf',
    TXT: 'txt',
    CSV: 'csv'
  };
  
  // Responsive Breakpoints (matching Tailwind)
  export const BREAKPOINTS = {
    SM: '640px',
    MD: '768px', 
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  };
  
  // Feature Flags (for gradual rollout)
  export const FEATURES = {
    BATCH_ANALYSIS: false,
    GITHUB_INTEGRATION: false,
    REAL_TIME_MONITORING: false,
    AI_CHAT_SUPPORT: false,
    ADVANCED_METRICS: true,
    EXPORT_REPORTS: true
  };
  
  // Default Analysis Configuration
  export const DEFAULT_ANALYSIS_CONFIG = {
    includeGasAnalysis: true,
    includeBusinessLogic: true, 
    analysisType: 'comprehensive', // 'quick', 'comprehensive', 'deep'
    maxAnalysisTime: 120, // seconds
    confidenceThreshold: 0.7
  };
  
  // CWE (Common Weakness Enumeration) mappings
  export const CWE_MAPPINGS = {
    'Reentrancy': 'CWE-841',
    'Access Control': 'CWE-284',
    'Integer Overflow': 'CWE-190', 
    'Unchecked Calls': 'CWE-252',
    'Logic Error': 'CWE-480',
    'Gas Issues': 'CWE-400'
  };