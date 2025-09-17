import os
import json
import asyncio
from typing import List, Dict, Any, Optional
import openai
from openai import AsyncOpenAI
import re
import hashlib
from datetime import datetime

from app.models.schemas import VulnerabilityReport, VulnerabilityLocation, CodeFix, AIInsight

class AIAnalyzer:
    """AI-powered smart contract analyzer using GPT-4"""
    
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )
        self.model = "gpt-4-1106-preview"  # Latest GPT-4 model
        
        # Vulnerability patterns and descriptions
        self.vulnerability_patterns = {
            "reentrancy": {
                "keywords": ["call", "send", "transfer", "delegatecall"],
                "description": "External calls before state changes can enable reentrancy attacks",
                "severity": "CRITICAL"
            },
            "access_control": {
                "keywords": ["onlyOwner", "require", "msg.sender", "owner"],
                "description": "Missing or improper access control checks",
                "severity": "HIGH"
            },
            "integer_overflow": {
                "keywords": ["uint", "int", "SafeMath", "unchecked"],
                "description": "Arithmetic operations without overflow protection",
                "severity": "MEDIUM"
            },
            "unchecked_calls": {
                "keywords": ["call", "delegatecall", "staticcall"],
                "description": "External calls without return value verification",
                "severity": "MEDIUM"
            }
        }
    
    async def analyze_contract(self, contract_code: str, filename: str, contract_info: Dict) -> Dict[str, Any]:
        """
        Main AI analysis function
        """
        try:
            # Prepare analysis prompt
            analysis_prompt = self._create_analysis_prompt(contract_code, filename)
            
            # Get AI analysis
            ai_response = await self._call_openai_api(analysis_prompt)
            
            # Parse AI response
            parsed_analysis = self._parse_ai_response(ai_response, contract_code, filename)
            
            # Generate insights
            insights = await self._generate_insights(contract_code, parsed_analysis)
            
            # Generate fixes
            fixes = await self._generate_fixes(contract_code, parsed_analysis['vulnerabilities'])
            
            return {
                "vulnerabilities": parsed_analysis['vulnerabilities'],
                "insights": insights,
                "fixes": fixes,
                "analysis_metadata": {
                    "model": self.model,
                    "timestamp": datetime.now().isoformat(),
                    "confidence": parsed_analysis.get('confidence', 0.8)
                }
            }
            
        except Exception as e:
            print(f"AI Analysis error: {str(e)}")
            # Return fallback analysis
            return {
                "vulnerabilities": self._fallback_analysis(contract_code, filename),
                "insights": [],
                "fixes": [],
                "analysis_metadata": {
                    "model": "fallback",
                    "timestamp": datetime.now().isoformat(),
                    "error": str(e)
                }
            }
    
    def _create_analysis_prompt(self, contract_code: str, filename: str) -> str:
        """Create comprehensive analysis prompt for AI"""
        return f"""
You are an expert smart contract security auditor. Analyze this Solidity contract for vulnerabilities, security issues, and provide detailed recommendations.

CONTRACT FILE: {filename}
CONTRACT CODE:
```solidity
{contract_code}
```

Please provide a comprehensive security analysis in the following JSON format:

{{
    "vulnerabilities": [
        {{
            "id": "unique_id",
            "title": "Vulnerability Title",
            "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFO",
            "type": "Reentrancy|Access Control|Integer Overflow|etc",
            "description": "Detailed description of the vulnerability",
            "location": {{
                "startLine": 10,
                "endLine": 15,
                "function": "function_name"
            }},
            "impact": "What could happen if exploited",
            "likelihood": "How likely is exploitation",
            "riskScore": 8.5,
            "recommendation": "How to fix this issue",
            "potentialLoss": "Estimated financial impact"
        }}
    ],
    "overallAssessment": "General security assessment",
    "confidence": 0.9
}}

Focus on these critical vulnerability types:
1. Reentrancy attacks
2. Access control flaws  
3. Integer overflow/underflow
4. Unchecked external calls
5. Price oracle manipulation
6. Flash loan vulnerabilities
7. Logic errors
8. Gas optimization issues

For each vulnerability found:
- Provide specific line numbers
- Explain the attack vector
- Estimate financial risk
- Suggest concrete fixes
- Rate severity accurately

Be thorough but practical. Focus on exploitable vulnerabilities that could cause real financial loss.
"""

    async def _call_openai_api(self, prompt: str) -> str:
        """Call OpenAI API with error handling"""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a world-class smart contract security auditor with expertise in finding critical vulnerabilities that have caused millions in losses. Provide detailed, actionable security analysis."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,  # Low temperature for consistency
                max_tokens=4000,
                timeout=30
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI API error: {str(e)}")
            raise e
    
    def _parse_ai_response(self, ai_response: str, contract_code: str, filename: str) -> Dict[str, Any]:
        """Parse AI response and convert to structured format"""
        try:
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
            if json_match:
                ai_data = json.loads(json_match.group())
            else:
                # Fallback if JSON parsing fails
                return {"vulnerabilities": [], "confidence": 0.5}
            
            vulnerabilities = []
            for vuln_data in ai_data.get("vulnerabilities", []):
                # Create vulnerability report
                vulnerability = VulnerabilityReport(
                    id=self._generate_vuln_id(vuln_data.get("title", "unknown")),
                    title=vuln_data.get("title", "Unknown Vulnerability"),
                    severity=vuln_data.get("severity", "MEDIUM"),
                    type=vuln_data.get("type", "Unknown"),
                    description=vuln_data.get("description", ""),
                    location=VulnerabilityLocation(
                        file=filename,
                        startLine=vuln_data.get("location", {}).get("startLine", 1),
                        endLine=vuln_data.get("location", {}).get("endLine", 1),
                        function=vuln_data.get("location", {}).get("function")
                    ),
                    impact=vuln_data.get("impact", "Unknown impact"),
                    likelihood=vuln_data.get("likelihood", "Unknown likelihood"),
                    riskScore=float(vuln_data.get("riskScore", 5.0)),
                    recommendation=vuln_data.get("recommendation", "Review and fix"),
                    detectionMethod="AI Analysis",
                    potentialLoss=vuln_data.get("potentialLoss"),
                    references=[]
                )
                vulnerabilities.append(vulnerability)
            
            return {
                "vulnerabilities": vulnerabilities,
                "confidence": ai_data.get("confidence", 0.8)
            }
            
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}")
            return {"vulnerabilities": [], "confidence": 0.3}
        except Exception as e:
            print(f"Response parsing error: {str(e)}")
            return {"vulnerabilities": [], "confidence": 0.3}
    
    async def _generate_insights(self, contract_code: str, analysis: Dict) -> List[AIInsight]:
        """Generate AI insights about the contract"""
        insights_prompt = f"""
Based on this smart contract analysis, provide 3-5 key insights about the contract's security posture, code quality, and recommendations.

CONTRACT ANALYSIS:
- Found {len(analysis['vulnerabilities'])} vulnerabilities
- Vulnerability types: {[v.type for v in analysis['vulnerabilities']]}

Provide insights in JSON format:
[
    {{
        "category": "Security|Performance|Best Practice",
        "insight": "Specific insight about the contract",
        "confidence": 0.9,
        "actionable": true
    }}
]
"""
        
        try:
            response = await self._call_openai_api(insights_prompt)
            json_match = re.search(r'\[.*\]', response, re.DOTALL)
            
            if json_match:
                insights_data = json.loads(json_match.group())
                insights = []
                
                for insight_data in insights_data:
                    insight = AIInsight(
                        category=insight_data.get("category", "Security"),
                        insight=insight_data.get("insight", ""),
                        confidence=float(insight_data.get("confidence", 0.7)),
                        actionable=insight_data.get("actionable", True)
                    )
                    insights.append(insight)
                
                return insights
                
        except Exception as e:
            print(f"Insights generation error: {str(e)}")
        
        # Fallback insights
        return [
            AIInsight(
                category="Security",
                insight="Contract requires comprehensive security review",
                confidence=0.8,
                actionable=True
            )
        ]
    
    async def _generate_fixes(self, contract_code: str, vulnerabilities: List[VulnerabilityReport]) -> List[CodeFix]:
        """Generate AI-powered code fixes for vulnerabilities"""
        if not vulnerabilities:
            return []
        
        fixes = []
        
        for vuln in vulnerabilities[:3]:  # Limit to top 3 vulnerabilities
            fix_prompt = f"""
Generate a code fix for this vulnerability:

VULNERABILITY: {vuln.title}
TYPE: {vuln.type}
DESCRIPTION: {vuln.description}
LOCATION: Lines {vuln.location.startLine}-{vuln.location.endLine}

ORIGINAL CONTRACT CODE:
```solidity
{contract_code}
```

Provide a fix in JSON format:
{{
    "description": "Brief description of the fix",
    "originalCode": "The vulnerable code snippet",
    "fixedCode": "The secure code replacement",
    "explanation": "Detailed explanation of why this fix works",
    "riskReduction": "Percentage of risk reduced"
}}

Focus on practical, secure, and minimal changes that fix the specific vulnerability.
"""
            
            try:
                response = await self._call_openai_api(fix_prompt)
                json_match = re.search(r'\{.*\}', response, re.DOTALL)
                
                if json_match:
                    fix_data = json.loads(json_match.group())
                    fix = CodeFix(
                        description=fix_data.get("description", f"Fix for {vuln.title}"),
                        originalCode=fix_data.get("originalCode", "Code snippet not available"),
                        fixedCode=fix_data.get("fixedCode", "Fix not available"),
                        explanation=fix_data.get("explanation", "Explanation not available"),
                        riskReduction=fix_data.get("riskReduction", "Unknown")
                    )
                    fixes.append(fix)
                    
            except Exception as e:
                print(f"Fix generation error for {vuln.title}: {str(e)}")
                continue
        
        return fixes
    
    def _generate_vuln_id(self, title: str) -> str:
        """Generate unique vulnerability ID"""
        title_hash = hashlib.md5(title.encode()).hexdigest()[:8]
        return f"VULN_{title_hash.upper()}"
    
    def _fallback_analysis(self, contract_code: str, filename: str) -> List[VulnerabilityReport]:
        """Fallback analysis when AI fails"""
        vulnerabilities = []
        
        # Simple pattern-based detection
        lines = contract_code.split('\n')
        
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            
            # Check for reentrancy pattern
            if 'call{value:' in line_lower and 'require(' not in line_lower:
                vuln = VulnerabilityReport(
                    id=f"FALLBACK_REENTRANCY_{i}",
                    title="Potential Reentrancy Vulnerability",
                    severity="HIGH",
                    type="Reentrancy",
                    description="External call detected without proper checks",
                    location=VulnerabilityLocation(
                        file=filename,
                        startLine=i + 1,
                        endLine=i + 1
                    ),
                    impact="Potential fund drainage through recursive calls",
                    likelihood="Medium if contract holds funds",
                    riskScore=7.5,
                    recommendation="Implement reentrancy guard or checks-effects-interactions pattern",
                    detectionMethod="Pattern Matching (Fallback)"
                )
                vulnerabilities.append(vuln)
            
            # Check for missing access control
            if any(keyword in line_lower for keyword in ['function ', 'external', 'public']) and 'onlyowner' not in line_lower and 'require(' not in line_lower:
                if any(sensitive in line_lower for sensitive in ['transfer', 'withdraw', 'mint', 'burn']):
                    vuln = VulnerabilityReport(
                        id=f"FALLBACK_ACCESS_{i}",
                        title="Missing Access Control",
                        severity="MEDIUM",
                        type="Access Control",
                        description="Sensitive function lacks proper access control",
                        location=VulnerabilityLocation(
                            file=filename,
                            startLine=i + 1,
                            endLine=i + 1
                        ),
                        impact="Unauthorized access to sensitive functions",
                        likelihood="High if function is exposed",
                        riskScore=6.0,
                        recommendation="Add proper access control modifiers",
                        detectionMethod="Pattern Matching (Fallback)"
                    )
                    vulnerabilities.append(vuln)
        
        return vulnerabilities[:5]  # Limit fallback results