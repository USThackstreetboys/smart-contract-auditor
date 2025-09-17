from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ContractInfo(BaseModel):
    """Basic contract information"""
    name: str
    functions: List[str]
    stateVariables: List[str]
    events: List[str]
    modifiers: List[str]
    linesOfCode: int
    complexity: str  # "Low", "Medium", "High"

class VulnerabilityLocation(BaseModel):
    """Location information for vulnerabilities"""
    file: str
    startLine: int
    endLine: int
    function: Optional[str] = None

class CodeFix(BaseModel):
    """AI-generated code fix"""
    description: str
    originalCode: str
    fixedCode: str
    explanation: str
    riskReduction: str  # Percentage reduction in risk

class VulnerabilityReport(BaseModel):
    """Individual vulnerability report"""
    id: str
    title: str
    severity: str  # "CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"
    type: str  # "Reentrancy", "Access Control", etc.
    description: str
    location: VulnerabilityLocation
    impact: str
    likelihood: str
    riskScore: float  # 0-10 scale
    cweId: Optional[str] = None  # Common Weakness Enumeration ID
    recommendation: str
    detectionMethod: str  # "AI Analysis", "Pattern Matching", "Static Analysis"
    potentialLoss: Optional[str] = None  # Estimated financial impact
    suggestedFix: Optional[CodeFix] = None
    references: List[str] = []

class AIInsight(BaseModel):
    """AI-generated insights about the contract"""
    category: str  # "Security", "Performance", "Best Practice"
    insight: str
    confidence: float  # 0-1 scale
    actionable: bool

class AnalysisResponse(BaseModel):
    """Complete analysis response"""
    contractName: str
    fileName: str
    analysisTimestamp: str
    overallRiskScore: float
    totalVulnerabilities: int
    vulnerabilities: List[VulnerabilityReport]
    contractInfo: ContractInfo
    aiInsights: List[AIInsight] = []
    recommendedFixes: List[CodeFix] = []
    
    # Risk breakdown
    criticalCount: int = Field(default=0)
    highCount: int = Field(default=0) 
    mediumCount: int = Field(default=0)
    lowCount: int = Field(default=0)
    infoCount: int = Field(default=0)
    
    # Analysis metadata
    analysisTimeMs: Optional[int] = None
    aiModel: str = "GPT-4"
    version: str = "1.0.0"

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: str
    services: Dict[str, str]

class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    message: str
    timestamp: str
    details: Optional[Dict[str, Any]] = None

class UploadResponse(BaseModel):
    """File upload response"""
    filename: str
    size: int
    uploadedAt: str
    analysisId: str

# Request models
class AnalysisRequest(BaseModel):
    """Analysis request parameters"""
    contractCode: str
    filename: str
    analysisType: str = "comprehensive"  # "quick", "comprehensive", "deep"
    includeGasAnalysis: bool = True
    includeBusinessLogic: bool = True
    
class BatchAnalysisRequest(BaseModel):
    """Batch analysis for multiple contracts"""
    contracts: List[Dict[str, str]]  # [{"filename": "contract.sol", "code": "..."}]
    analysisType: str = "comprehensive"

# Response models for specific endpoints
class VulnerabilityStats(BaseModel):
    """Vulnerability statistics"""
    totalContracts: int
    totalVulnerabilities: int
    averageRiskScore: float
    commonVulnerabilities: List[Dict[str, int]]
    
class ComparisonResponse(BaseModel):
    """Contract comparison response"""
    contract1: str
    contract2: str
    similarityScore: float
    commonVulnerabilities: List[VulnerabilityReport]
    uniqueVulnerabilities: Dict[str, List[VulnerabilityReport]]
    recommendation: str