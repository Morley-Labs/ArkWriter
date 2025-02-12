import { POU, Variable } from '../types/plc';
import { runtimeService } from './RuntimeService';

class POUService {
  private pous: Map<string, POU> = new Map();
  private instances: Map<string, any> = new Map();

  createInstance(pou: POU, instanceName: string) {
    if (this.instances.has(instanceName)) {
      throw new Error(`Instance ${instanceName} already exists`);
    }

    const instance = {
      pou,
      variables: this.initializeVariables(pou.variables),
      state: {}
    };

    this.instances.set(instanceName, instance);
    return instance;
  }

  private initializeVariables(variables: { input: Variable[], output: Variable[], local: Variable[] }) {
    const vars = new Map();
    
    // Initialize all variables with default values
    [...variables.input, ...variables.output, ...variables.local].forEach(v => {
      vars.set(v.address, this.getDefaultValue(v.type));
    });

    return vars;
  }

  private getDefaultValue(type: string): any {
    switch (type) {
      case 'BOOL': return false;
      case 'INT': return 0;
      case 'REAL': return 0.0;
      case 'STRING': return '';
      default: return null;
    }
  }

  validatePOU(pou: POU): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate name
    if (!pou.name?.trim()) {
      errors.push('POU name is required');
    }

    // Validate type
    if (!['program', 'function', 'functionBlock'].includes(pou.type)) {
      errors.push('Invalid POU type');
    }

    // Validate variables
    this.validateVariables(pou.variables.input, 'Input', errors);
    this.validateVariables(pou.variables.output, 'Output', errors);
    this.validateVariables(pou.variables.local, 'Local', errors);

    // Validate function blocks have at least one input and output
    if (pou.type === 'functionBlock') {
      if (pou.variables.input.length === 0) {
        errors.push('Function blocks must have at least one input variable');
      }
      if (pou.variables.output.length === 0) {
        errors.push('Function blocks must have at least one output variable');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private validateVariables(variables: Variable[], scope: string, errors: string[]) {
    const names = new Set<string>();
    const addresses = new Set<string>();

    variables.forEach(variable => {
      // Check for duplicate names
      if (names.has(variable.name)) {
        errors.push(`Duplicate ${scope} variable name: ${variable.name}`);
      }
      names.add(variable.name);

      // Check for duplicate addresses
      if (addresses.has(variable.address)) {
        errors.push(`Duplicate ${scope} variable address: ${variable.address}`);
      }
      addresses.add(variable.address);

      // Validate address format
      if (!this.isValidAddress(variable.address)) {
        errors.push(`Invalid ${scope} variable address format: ${variable.address}`);
      }
    });
  }

  private isValidAddress(address: string): boolean {
    return /^[A-Za-z0-9_]+$/.test(address);
  }
}

export const pouService = new POUService();