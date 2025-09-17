import re
from typing import List, Dict, Any
from dataclasses import dataclass

from app.models.schemas import ContractInfo

@dataclass
class FunctionInfo:
    """Information about a function"""
    name: str
    visibility: str
    mutability: str
    parameters: List[str]
    returns: List[str]
    modifiers: List[str]
    line_number: int

@dataclass
class StateVariableInfo:
    """Information about a state variable"""
    name: str
    type: str
    visibility: str
    line_number: int

class SolidityParser:
    """Parser for Solidity smart contracts"""
    
    def __init__(self):
        self.contract_patterns = {
            'contract_declaration': r'contract\s+(\w+)',
            'function_declaration': r'function\s+(\w+)\s*\([^)]*\)\s*([^{]*)\s*\{',
            'state_variable': r'^\s*(\w+(?:\[\])?\s+(?:public|private|internal)?\s+)?(\w+)\s*(?:=|;)',
            'event_declaration': r'event\s+(\w+)\s*\([^)]*\);?',
            'modifier_declaration': r'modifier\s+(\w+)',
            'pragma': r'pragma\s+solidity\s+([^;]+);',
            'import': r'import\s+(?:"[^"]+"|\'[^\']+\'|\{[^}]+\}\s+from\s+(?:"[^"]+"|\'[^\']+\'))',
        }
    
    def parse_contract(self, contract_code: str, filename: str = "contract.sol") -> ContractInfo:
        """
        Parse Solidity contract and extract structural information
        """
        try:
            lines = contract_code.split('\n')
            
            # Extract basic information
            contract_name = self._extract_contract_name(contract_code)
            functions = self._extract_functions(contract_code)
            state_variables = self._extract_state_variables(contract_code)
            events = self._extract_events(contract_code)
            modifiers = self._extract_modifiers(contract_code)
            
            # Calculate metrics
            lines_of_code = len([line for line in lines if line.strip() and not line.strip().startswith('//')])
            complexity = self._calculate_complexity(contract_code, functions)
            
            return ContractInfo(
                name=contract_name,
                functions=[f['name'] for f in functions],
                stateVariables=[v['name'] for v in state_variables],
                events=[e['name'] for e in events],
                modifiers=[m['name'] for m in modifiers],
                linesOfCode=lines_of_code,
                complexity=complexity
            )
            
        except Exception as e:
            print(f"Parsing error: {str(e)}")
            # Return minimal contract info
            return ContractInfo(
                name=filename.replace('.sol', ''),
                functions=[],
                stateVariables=[],
                events=[],
                modifiers=[],
                linesOfCode=len(contract_code.split('\n')),
                complexity="Unknown"
            )
    
    def _extract_contract_name(self, contract_code: str) -> str:
        """Extract the main contract name"""
        match = re.search(self.contract_patterns['contract_declaration'], contract_code)
        return match.group(1) if match else "UnknownContract"
    
    def _extract_functions(self, contract_code: str) -> List[Dict[str, Any]]:
        """Extract function information"""
        functions = []
        lines = contract_code.split('\n')
        
        for i, line in enumerate(lines):
            # Match function declarations
            func_match = re.search(
                r'function\s+(\w+)\s*\(([^)]*)\)\s*([^{]*?)\s*\{', 
                line.strip()
            )
            
            if func_match:
                function_name = func_match.group(1)
                parameters_str = func_match.group(2).strip()
                modifiers_str = func_match.group(3).strip()
                
                # Parse parameters
                parameters = []
                if parameters_str:
                    param_parts = [p.strip() for p in parameters_str.split(',') if p.strip()]
                    for param in param_parts:
                        param_match = re.search(r'(\w+(?:\[\])?)\s+(\w+)', param)
                        if param_match:
                            parameters.append(f"{param_match.group(1)} {param_match.group(2)}")
                
                # Parse visibility and mutability
                visibility = "internal"  # default
                mutability = ""
                modifiers = []
                
                if modifiers_str:
                    if "public" in modifiers_str:
                        visibility = "public"
                    elif "external" in modifiers_str:
                        visibility = "external"
                    elif "private" in modifiers_str:
                        visibility = "private"
                    
                    if "view" in modifiers_str:
                        mutability = "view"
                    elif "pure" in modifiers_str:
                        mutability = "pure"
                    elif "payable" in modifiers_str:
                        mutability = "payable"
                    
                    # Extract custom modifiers
                    modifier_matches = re.findall(r'\b(?!public|external|private|internal|view|pure|payable|returns)\w+(?=\s*(?:\(|$))', modifiers_str)
                    modifiers.extend(modifier_matches)
                
                # Extract return types
                returns = []
                returns_match = re.search(r'returns\s*\(([^)]+)\)', modifiers_str)
                if returns_match:
                    return_types = [r.strip() for r in returns_match.group(1).split(',')]
                    returns.extend(return_types)
                
                functions.append({
                    'name': function_name,
                    'visibility': visibility,
                    'mutability': mutability,
                    'parameters': parameters,
                    'returns': returns,
                    'modifiers': modifiers,
                    'line_number': i + 1
                })
        
        return functions
    
    def _extract_state_variables(self, contract_code: str) -> List[Dict[str, Any]]:
        """Extract state variable information"""
        variables = []
        lines = contract_code.split('\n')
        
        in_contract = False
        brace_count = 0
        
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            
            # Track if we're inside a contract
            if re.search(r'contract\s+\w+', line_stripped):
                in_contract = True
                continue
            
            if in_contract:
                # Count braces to track scope
                brace_count += line_stripped.count('{') - line_stripped.count('}')
                
                # Skip if we're inside a function (more than 1 level deep)
                if brace_count > 1:
                    continue
                
                # Skip comments and empty lines
                if not line_stripped or line_stripped.startswith('//')