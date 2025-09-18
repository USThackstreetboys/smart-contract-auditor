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

