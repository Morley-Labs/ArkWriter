import { IODevice, IOPoint } from '../types/plc';

class IOService {
  private devices: Map<string, IODevice> = new Map();
  private pointValues: Map<string, any> = new Map();

  addDevice(device: IODevice) {
    this.devices.set(device.id, device);
  }

  updateDevice(id: string, device: IODevice) {
    this.devices.set(id, device);
  }

  deleteDevice(id: string) {
    this.devices.delete(id);
  }

  addPoint(deviceId: string, point: IOPoint) {
    const device = this.devices.get(deviceId);
    if (device) {
      device.points.push(point);
      this.devices.set(deviceId, device);
    }
  }

  updatePoint(deviceId: string, pointId: string, point: IOPoint) {
    const device = this.devices.get(deviceId);
    if (device) {
      const index = device.points.findIndex(p => p.id === pointId);
      if (index !== -1) {
        device.points[index] = point;
        this.devices.set(deviceId, device);
      }
    }
  }

  deletePoint(deviceId: string, pointId: string) {
    const device = this.devices.get(deviceId);
    if (device) {
      device.points = device.points.filter(p => p.id !== pointId);
      this.devices.set(deviceId, device);
    }
  }

  async readPoint(pointId: string): Promise<any> {
    return this.pointValues.get(pointId);
  }

  async writePoint(pointId: string, value: any): Promise<void> {
    this.pointValues.set(pointId, value);
  }

  getDevices(): IODevice[] {
    return Array.from(this.devices.values());
  }

  validateAddress(protocol: string, address: string): boolean {
    switch (protocol) {
      case 'modbus-tcp':
      case 'modbus-rtu':
        return /^\d+$/.test(address); // Modbus register address
      case 'ethercat':
        return /^[0-9A-Fa-f]{4}:[0-9A-Fa-f]{4}$/.test(address); // EtherCAT address
      case 'profinet':
        return /^[0-9A-Fa-f]{2}:[0-9A-Fa-f]{2}:[0-9A-Fa-f]{2}$/.test(address); // PROFINET address
      case 'ethernet-ip':
        return /^\d+\.\d+$/.test(address); // EtherNet/IP address
      default:
        return false;
    }
  }
}

export const ioService = new IOService();