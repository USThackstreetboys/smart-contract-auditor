# backend/app/__init__.py
"""
Smart Contract AI Auditor Backend Package
"""

__version__ = "1.0.0"
__description__ = "AI-powered smart contract vulnerability detection and analysis"

# backend/app/models/__init__.py
"""
Data models and schemas for the Smart Contract AI Auditor
"""

from .schemas import (
    ContractInfo,
    VulnerabilityReport,
    VulnerabilityLocation,
    CodeFix,
    AIInsight,
    AnalysisResponse,
    HealthResponse,
    ErrorResponse,
    UploadResponse,
    AnalysisRequest,
    BatchAnalysisRequest,
    VulnerabilityStats,
    ComparisonResponse
)

__all__ = [
    "ContractInfo",
    "VulnerabilityReport", 
    "VulnerabilityLocation",
    "CodeFix",
    "AIInsight",
    "AnalysisResponse",
    "HealthResponse",
    "ErrorResponse",
    "UploadResponse",
    "AnalysisRequest",
    "BatchAnalysisRequest",
    "VulnerabilityStats",
    "ComparisonResponse"
]