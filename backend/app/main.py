from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import tempfile
import json
from datetime import datetime
from typing import List, Optional

from app.services.ai_analyzer import AIAnalyzer
from app.services.vulnerability_detector import VulnerabilityDetector
from app.services.solidity_parser import SolidityParser
from app.models.schemas import (
    AnalysisResponse, 
    VulnerabilityReport, 
    HealthResponse,
    ContractInfo
)

# Initialize FastAPI app
app = FastAPI(
    title="Smart Contract AI Auditor",
    description="AI-powered smart contract vulnerability detection and analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
ai_analyzer = AIAnalyzer()
vulnerability_detector = VulnerabilityDetector()
solidity_parser = SolidityParser()

@app.get("/", response_model=dict)
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Smart Contract AI Auditor API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "health": "/health",
            "analyze": "/analyze",
            "sample_contracts": "/sample-contracts"
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        services={
            "ai_analyzer": "operational",
            "vulnerability_detector": "operational",
            "solidity_parser": "operational"
        }
    )

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_contract(file: UploadFile = File(...)):
    """
    Analyze uploaded smart contract for vulnerabilities
    """
    try:
        # Validate file type
        if not file.filename.endswith(('.sol', '.vy')):
            raise HTTPException(
                status_code=400, 
                detail="Only Solidity (.sol) and Vyper (.vy) files are supported"
            )
        
        # Read file content
        content = await file.read()
        if len(content) > 50 * 1024 * 1024:  # 50MB limit
            raise HTTPException(
                status_code=413,
                detail="File too large. Maximum size is 50MB"
            )
        
        contract_code = content.decode('utf-8')
        
        # Parse contract
        contract_info = solidity_parser.parse_contract(contract_code, file.filename)
        
        # Run AI analysis
        ai_analysis = await ai_analyzer.analyze_contract(
            contract_code, 
            file.filename,
            contract_info
        )
        
        # Run pattern-based vulnerability detection
        pattern_vulnerabilities = vulnerability_detector.detect_vulnerabilities(
            contract_code,
            contract_info
        )
        
        # Combine results
        all_vulnerabilities = ai_analysis['vulnerabilities'] + pattern_vulnerabilities
        
        # Calculate overall risk score
        risk_score = calculate_risk_score(all_vulnerabilities)
        
        # Generate report
        analysis_result = AnalysisResponse(
            contractName=contract_info.name,
            fileName=file.filename,
            analysisTimestamp=datetime.now().isoformat(),
            overallRiskScore=risk_score,
            totalVulnerabilities=len(all_vulnerabilities),
            vulnerabilities=all_vulnerabilities,
            contractInfo=contract_info,
            aiInsights=ai_analysis.get('insights', []),
            recommendedFixes=ai_analysis.get('fixes', [])
        )
        
        return analysis_result
        
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid file encoding. Please upload a valid text file."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

@app.get("/sample-contracts")
async def get_sample_contracts():
    """Get list of sample vulnerable contracts for testing"""
    sample_dir = "app/sample_contracts"
    samples = []
    
    if os.path.exists(sample_dir):
        for filename in os.listdir(sample_dir):
            if filename.endswith('.sol'):
                filepath = os.path.join(sample_dir, filename)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                samples.append({
                    "name": filename,
                    "description": get_contract_description(filename),
                    "content": content,
                    "vulnerabilityTypes": get_expected_vulnerabilities(filename)
                })
    
    return {"samples": samples}

@app.get("/sample-contracts/{contract_name}")
async def get_sample_contract(contract_name: str):
    """Get specific sample contract content"""
    filepath = f"app/sample_contracts/{contract_name}"
    
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Sample contract not found")
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    return {
        "name": contract_name,
        "content": content,
        "description": get_contract_description(contract_name)
    }

def calculate_risk_score(vulnerabilities: List[dict]) -> float:
    """Calculate overall risk score based on vulnerabilities"""
    if not vulnerabilities:
        return 0.0
    
    severity_weights = {
        "CRITICAL": 10.0,
        "HIGH": 7.0,
        "MEDIUM": 4.0,
        "LOW": 1.0,
        "INFO": 0.5
    }
    
    total_weight = sum(severity_weights.get(vuln.get('severity', 'LOW'), 1.0) 
                      for vuln in vulnerabilities)
    
    # Normalize to 0-10 scale
    max_possible = len(vulnerabilities) * 10.0
    risk_score = min(10.0, (total_weight / max_possible) * 10) if max_possible > 0 else 0.0
    
    return round(risk_score, 1)

def get_contract_description(filename: str) -> str:
    """Get description for sample contracts"""
    descriptions = {
        "vulnerable_bank.sol": "A banking contract with reentrancy vulnerability",
        "reentrancy_attack.sol": "Classic reentrancy attack example",
        "access_control_flaw.sol": "Contract with missing access control checks",
        "integer_overflow.sol": "Contract susceptible to integer overflow",
        "unchecked_calls.sol": "Contract with unchecked external calls"
    }
    return descriptions.get(filename, "Sample vulnerable smart contract")

def get_expected_vulnerabilities(filename: str) -> List[str]:
    """Get expected vulnerability types for sample contracts"""
    vulnerability_map = {
        "vulnerable_bank.sol": ["Reentrancy", "Access Control"],
        "reentrancy_attack.sol": ["Reentrancy"],
        "access_control_flaw.sol": ["Access Control", "Authorization"],
        "integer_overflow.sol": ["Integer Overflow", "Arithmetic"],
        "unchecked_calls.sol": ["Unchecked Calls", "External Calls"]
    }
    return vulnerability_map.get(filename, ["Unknown"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)