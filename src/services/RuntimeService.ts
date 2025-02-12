import { EventEmitter } from 'events';
import { POU, Variable } from '../types/plc';

class RuntimeService extends EventEmitter {
  private running: boolean = false;
  private forcedValues: Map<string, any> = new Map();
  private variables: Map<string, any> = new Map();
  private pouInstances: Map<string, any> = new Map();
  private scanInterval: number | null = null;

  constructor() {
    super();
  }

  startScan() {
    if (this.running) return;
    this.running = true;
    
    this.scanInterval = window.setInterval(() => {
      this.executeScanCycle();
    }, 100); // 100ms scan cycle
  }

  stopScan() {
    if (!this.running) return;
    this.running = false;
    
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
  }

  private async executeScanCycle() {
    try {
      // Update inputs
      await this.updateInputs();

      // Execute POUs in order
      for (const [name, instance] of this.pouInstances) {
        await this.executePOU(instance);
      }

      // Update outputs
      await this.updateOutputs();

      // Emit value changes
      this.emit('valueChanged', this.variables);
    } catch (error) {
      console.error('Scan cycle error:', error);
      this.emit('error', error);
    }
  }

  private async executePOU(instance: any) {
    const pou = instance.pou as POU;
    
    // Handle different POU types
    switch (pou.type) {
      case 'program':
        await this.executeProgram(instance);
        break;
      case 'functionBlock':
        await this.executeFunctionBlock(instance);
        break;
      case 'function':
        await this.executeFunction(instance);
        break;
    }
  }

  forceValue(address: string, value: any) {
    this.forcedValues.set(address, value);
    this.variables.set(address, value);
    this.emit('valueForced', { address, value });
  }

  clearForce(address: string) {
    this.forcedValues.delete(address);
    this.emit('forceCleared', address);
  }

  clearAllForces() {
    this.forcedValues.clear();
    this.emit('allForcesCleared');
  }

  getValue(address: string): any {
    return this.variables.get(address);
  }

  getAllValues(): Map<string, any> {
    return new Map(this.variables);
  }

  getForcedValues(): Map<string, any> {
    return new Map(this.forcedValues);
  }

  private async updateInputs() {
    // Update input values, skipping forced values
    for (const [address, value] of this.variables) {
      if (!this.forcedValues.has(address)) {
        // Update from I/O service
      }
    }
  }

  private async updateOutputs() {
    // Update output values, applying forced values
    for (const [address, value] of this.variables) {
      if (this.forcedValues.has(address)) {
        continue; // Skip forced values
      }
      // Update to I/O service
    }
  }
}

export const runtimeService = new RuntimeService();