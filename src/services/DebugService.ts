import { DebugState, Variable } from '../types/plc';

class DebugService {
  private debugState: DebugState = {
    running: false,
    paused: false,
    scanTime: 0,
    forcedVariables: new Map(),
    breakpoints: new Set(),
    watchList: new Set(),
  };

  private scanInterval: number | null = null;
  private lastScanTime: number = 0;

  startDebug() {
    if (this.debugState.running) return;
    
    this.debugState.running = true;
    this.debugState.paused = false;
    this.lastScanTime = performance.now();
    
    this.scanInterval = window.setInterval(() => {
      if (!this.debugState.paused) {
        this.executeScanCycle();
      }
    }, 100); // 100ms scan cycle
  }

  pauseDebug() {
    this.debugState.paused = true;
  }

  resumeDebug() {
    this.debugState.paused = false;
  }

  stopDebug() {
    this.debugState.running = false;
    this.debugState.paused = false;
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
  }

  stepDebug() {
    if (this.debugState.paused) {
      this.executeScanCycle();
    }
  }

  toggleBreakpoint(rung: number) {
    if (this.debugState.breakpoints.has(rung)) {
      this.debugState.breakpoints.delete(rung);
    } else {
      this.debugState.breakpoints.add(rung);
    }
  }

  forceVariable(variable: string, value: any) {
    this.debugState.forcedVariables.set(variable, value);
  }

  unforceVariable(variable: string) {
    this.debugState.forcedVariables.delete(variable);
  }

  addToWatchList(variable: string) {
    this.debugState.watchList.add(variable);
  }

  removeFromWatchList(variable: string) {
    this.debugState.watchList.delete(variable);
  }

  getDebugState(): DebugState {
    return { ...this.debugState };
  }

  private executeScanCycle() {
    const currentTime = performance.now();
    this.debugState.scanTime = currentTime - this.lastScanTime;
    this.lastScanTime = currentTime;

    // Execute rung logic here
    // Check for breakpoints
    // Update forced variables
    // Emit state changes
  }
}

export const debugService = new DebugService();