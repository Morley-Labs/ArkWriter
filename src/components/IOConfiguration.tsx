import React, { useState } from 'react';
import { Plus, Trash2, Settings2, Database, Cable, X } from 'lucide-react';
import { IODevice, IOPoint } from '../types/plc';

interface IOConfigurationProps {
  devices: IODevice[];
  onAddDevice: (device: IODevice) => void;
  onUpdateDevice: (id: string, device: IODevice) => void;
  onDeleteDevice: (id: string) => void;
  onAddPoint: (deviceId: string, point: IOPoint) => void;
  onUpdatePoint: (deviceId: string, pointId: string, point: IOPoint) => void;
  onDeletePoint: (deviceId: string, pointId: string) => void;
  onClose: () => void;
}

const IOConfiguration: React.FC<IOConfigurationProps> = ({
  devices,
  onAddDevice,
  onUpdateDevice,
  onDeleteDevice,
  onAddPoint,
  onUpdatePoint,
  onDeletePoint,
  onClose,
}) => {
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [isAddingPoint, setIsAddingPoint] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<IODevice | null>(null);
  const [newDevice, setNewDevice] = useState<Partial<IODevice>>({});
  const [newPoint, setNewPoint] = useState<Partial<IOPoint>>({});

  const protocols = [
    { id: 'modbus-tcp', name: 'Modbus TCP' },
    { id: 'modbus-rtu', name: 'Modbus RTU' },
    { id: 'ethercat', name: 'EtherCAT' },
    { id: 'profinet', name: 'PROFINET' },
    { id: 'ethernet-ip', name: 'EtherNet/IP' }
  ];

  const handleDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const device: IODevice = {
      id: crypto.randomUUID(),
      name: newDevice.name || '',
      protocol: newDevice.protocol || '',
      address: newDevice.address || '',
      points: []
    };
    onAddDevice(device);
    setNewDevice({});
    setIsAddingDevice(false);
  };

  const handlePointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddingPoint) return;

    const point: IOPoint = {
      id: crypto.randomUUID(),
      name: newPoint.name || '',
      type: newPoint.type || 'DI',
      address: newPoint.address || '',
      protocol: newPoint.protocol || '',
      deviceId: isAddingPoint,
      description: newPoint.description || '',
      range: newPoint.range
    };
    onAddPoint(isAddingPoint, point);
    setNewPoint({});
    setIsAddingPoint(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">I/O Configuration</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddingDevice(true)}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
              Add Device
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Devices List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {devices.map(device => (
            <div key={device.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium">{device.name}</h3>
                    <p className="text-sm text-gray-500">{device.protocol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDevice(device)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDevice(device.id)}
                    className="p-2 hover:bg-gray-100 rounded text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* I/O Points */}
              <div className="space-y-2">
                {device.points.map(point => (
                  <div key={point.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Cable className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{point.name}</p>
                        <p className="text-xs text-gray-500">{point.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs rounded bg-gray-200">
                        {point.type}
                      </span>
                      <button
                        onClick={() => onDeletePoint(device.id, point.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setIsAddingPoint(device.id)}
                  className="w-full py-2 text-center text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                >
                  Add I/O Point
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Device Modal */}
        {isAddingDevice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleDeviceSubmit} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add New Device</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newDevice.name || ''}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Protocol</label>
                  <select
                    value={newDevice.protocol || ''}
                    onChange={(e) => setNewDevice({ ...newDevice, protocol: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  >
                    <option value="">Select Protocol</option>
                    {protocols.map(protocol => (
                      <option key={protocol.id} value={protocol.id}>
                        {protocol.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={newDevice.address || ''}
                    onChange={(e) => setNewDevice({ ...newDevice, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingDevice(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Add Device
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add I/O Point Modal */}
        {isAddingPoint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handlePointSubmit} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add I/O Point</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newPoint.name || ''}
                    onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={newPoint.type || 'DI'}
                    onChange={(e) => setNewPoint({ ...newPoint, type: e.target.value as IOPoint['type'] })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  >
                    <option value="DI">Digital Input</option>
                    <option value="DO">Digital Output</option>
                    <option value="AI">Analog Input</option>
                    <option value="AO">Analog Output</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={newPoint.address || ''}
                    onChange={(e) => setNewPoint({ ...newPoint, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newPoint.description || ''}
                    onChange={(e) => setNewPoint({ ...newPoint, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingPoint(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Add Point
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default IOConfiguration;