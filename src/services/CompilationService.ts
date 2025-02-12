const loadPyodide = async () => {
  return await import("pyodide").then((module) => module.loadPyodide);
};
import { ValidationService } from './ValidationService';
import { walletService } from './WalletService';

export interface CompilationResult {
  success: boolean;
  data?: any;
  error?: string;
}

class CompilationService {
  private pyodide: PyodideInterface | null = null;
  private initialized = false;
  private validationService = new ValidationService();
  private compiledPlutusScript: string | null = null;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.pyodide = await loadPyodide();
      
      // Load the Python compiler code
      await this.pyodide.runPythonAsync(`
        ${llParserCode}
        ${validatorCode}
        ${plutusCompilerCode}
      `);

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Pyodide:', error);
      throw new Error('Failed to initialize compilation service');
    }
  }

  async parseToIR(rungs: any[]): Promise<CompilationResult> {
    if (!this.pyodide) {
      return { success: false, error: 'Compilation service not initialized' };
    }

    try {
      const result = await this.pyodide.runPythonAsync(`
        parse_ladder_logic(${JSON.stringify(rungs)})
      `);

      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: `IR Generation failed: ${error.message || 'Unknown error'}`
      };
    }
  }

  async validateIR(ir: string): Promise<CompilationResult> {
    if (!this.pyodide) {
      return { success: false, error: 'Compilation service not initialized' };
    }

    try {
      const validationResult = this.validationService.validateProject(JSON.parse(ir));
      if (!validationResult.valid) {
        return {
          success: false,
          error: `IR Validation failed: ${validationResult.errors.join('\n')}`
        };
      }

      const result = await this.pyodide.runPythonAsync(`
        valid, message = validate_ir_structure(${ir})
        {'valid': valid, 'message': message}
      `);

      return {
        success: result.valid,
        data: result.valid ? 'IR validation successful' : undefined,
        error: !result.valid ? result.message : undefined
      };
    } catch (error: any) {
      return {
        success: false,
        error: `IR Validation failed: ${error.message || 'Unknown error'}`
      };
    }
  }

  async compileToPlutusTx(ir: string): Promise<CompilationResult> {
    if (!this.pyodide) {
      return { success: false, error: 'Compilation service not initialized' };
    }

    try {
      const result = await this.pyodide.runPythonAsync(`
        compile_ir_to_plutus_haskell_enhanced(${ir})
      `);
      this.compiledPlutusScript = result;
      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: `Plutus compilation failed: ${error.message || 'Unknown error'}`
      };
    }
  }

  async deployCompiledScript(): Promise<CompilationResult> {
    if (!this.compiledPlutusScript) {
      return { success: false, error: 'No compiled script available for deployment' };
    }

    try {
      const deploymentResult = await walletService.deployScript(this.compiledPlutusScript);
      return { success: true, data: deploymentResult };
    } catch (error: any) {
      return {
        success: false,
        error: `Deployment failed: ${error.message || 'Unknown error'}`
      };
    }
  }
}

export const compilationService = new CompilationService();
