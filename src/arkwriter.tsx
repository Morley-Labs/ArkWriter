import React, { useReducer, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import WalletConnector from './components/WalletConnector';
import ProjectSettings from './components/ProjectSettings';
import LadderEditor from './components/LadderEditor';
import { MainMenu } from './components/MainMenu';
import VariableManager from './components/VariableManager';
import IOConfiguration from './components/IOConfiguration';
import { ToolSelector } from './components/ToolSelector';
import { Grid, Settings, Save, Download, Upload, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { ladderReducer } from './reducers/ladderReducer';
import { fileService } from './services/FileService';
import { projectService } from './services/ProjectService';
import { toast } from 'react-hot-toast';

const initialState = {
  name: "Untitled Project",
  rungs: [{
    id: crypto.randomUUID(),
    components: []
  }],
  settings: {
    name: "Untitled Project",
    description: "",
    author: "",
    gridSize: 40,
    showGrid: true,
    showAddresses: true,
    autoSave: false
  }
};

const ArkWriter: React.FC = () => {
  const [state, dispatch] = useReducer(ladderReducer, initialState);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVariableManagerOpen, setIsVariableManagerOpen] = useState(false);
  const [isIOConfigOpen, setIsIOConfigOpen] = useState(false);

  const handleNewProject = async () => {
    try {
      const newProject = await projectService.createNewProject();
      dispatch({ type: "LOAD_PROJECT", project: newProject });
      toast.success('New project created');
    } catch (error: any) {
      toast.error(`Failed to create new project: ${error.message}`);
      console.error("Error creating new project:", error);
    }
  };

  const handleOpenProject = async () => {
    try {
      const project = await projectService.openProject();
      dispatch({ type: "LOAD_PROJECT", project: project });
      toast.success('Project opened successfully');
    } catch (error) {
      toast.error(`Failed to open project: ${error.message}`);
      console.error("Error opening project:", error);
    }
  };

  const handleSaveProject = async () => {
    try {
      await projectService.saveProject(state);
      toast.success('Project saved successfully');
    } catch (error) {
      toast.error(`Failed to save project: ${error.message}`);
      console.error("Error saving project:", error);
    }
  };

  const handleExportJSON = async () => {
    try {
      await projectService.saveProjectAs(state);
      toast.success('Project exported successfully');
    } catch (error) {
      toast.error(`Failed to export project: ${error.message}`);
      console.error("Error exporting JSON:", error);
    }
  };

  const handleAddComponent = (rungIndex: number, position: number, tool: any) => {
    dispatch({
      type: 'ADD_COMPONENT',
      rungIndex,
      component: {
        id: crypto.randomUUID(),
        type: tool.type,
        icon: tool.icon,
        position,
        width: tool.width || 1
      }
    });
  };

  const handleMoveComponent = (fromRung: number, toRung: number, fromIndex: number, toPosition: number) => {
    dispatch({
      type: 'MOVE_COMPONENT',
      fromRung,
      toRung,
      fromIndex,
      toPosition
    });
  };

  const handleDeleteComponent = (rungIndex: number, componentIndex: number) => {
    dispatch({
      type: 'DELETE_COMPONENT',
      rungIndex,
      componentIndex
    });
  };

  const handleAddRung = () => {
    dispatch({
      type: 'ADD_RUNG',
      rung: {
        id: crypto.randomUUID(),
        components: []
      }
    });
  };

  const handleDeleteRung = (index: number) => {
    dispatch({
      type: 'DELETE_RUNG',
      rungIndex: index
    });
  };

  const handleSettingsSave = (newSettings: any) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: newSettings
    });
  };

  const viewSettings = {
    showGrid: state.settings.showGrid,
    showAddresses: state.settings.showAddresses,
    showCrossReferences: false
  };

  return (
    <DndProvider backend={HTML5Backend}> 
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex-col bg-black text-white">
          {/* Main Menu Bar */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-700">
            <div className="flex items-center space-x-6">
              <img
                src="https://raw.githubusercontent.com/Liberty-Chris/Morley/refs/heads/main/images/morley_white_soft_transparent.png"
                alt="Morley Logo"
                className="h-6 md:h-8 w-auto"
              />
              <MainMenu
                onNewProject={handleNewProject}
                onOpenProject={handleOpenProject}
                onSaveProject={handleSaveProject}
                onExportJSON={handleExportJSON}
                onShowVariables={() => setIsVariableManagerOpen(true)}
                onShowIOConfig={() => setIsIOConfigOpen(true)}
                onSaveAs={() => {}}
                onExportST={() => {}}
                onExportLL={() => {}}
                onShowSettings={() => setIsSettingsOpen(true)}
                onShowPOUManager={() => {}}
                onShowCrossReferences={() => {}}
                onShowForceTable={() => {}}
                onZoomIn={() => {}}
                onZoomOut={() => {}}
                onFitToScreen={() => {}}
                onToggleGrid={() => handleSettingsSave({ ...state.settings, showGrid: !state.settings.showGrid })}
                onToggleAddressLabels={() => {}}
                onToggleCrossReferences={() => {}}
                viewSettings={viewSettings}
              />
            </div>

            <div className="flex items-center space-x-6">
              <WalletConnector
                onWalletConnected={(address) => {
                  console.log("Wallet connected:", address);
                }}
              />
              <h2 className="text-lg md:text-xl font-bold font-ubuntu tracking-wide">
                ArkWriter
              </h2>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 md:px-6 py-2 bg-[#FF7F11]">
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleSaveProject}
                className="p-2 hover:bg-orange-600 rounded transition-colors" 
                title="Save Project"
              >
                <Save className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={handleOpenProject}
                className="p-2 hover:bg-orange-600 rounded transition-colors" 
                title="Import Project"
              >
                <Upload className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={handleExportJSON}
                className="p-2 hover:bg-orange-600 rounded transition-colors" 
                title="Export Project"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
              <div className="w-px h-6 bg-white/20 mx-2" />
              <button 
                onClick={() => {}}
                className="p-2 hover:bg-orange-600 rounded transition-colors" 
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => {}}
                className="p-2 hover:bg-orange-600 rounded transition-colors" 
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => {}}
                className="p-2 hover:bg-orange-600 rounded transition-colors" 
                title="Fit to Screen"
              >
                <Maximize2 className="w-5 h-5 text-white" />
              </button>
              <div className="w-px h-6 bg-white/20 mx-2" />
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 hover:bg-orange-600 rounded transition-colors" 
                title="Project Settings"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => handleSettingsSave({ ...state.settings, showGrid: !state.settings.showGrid })}
                className={`p-2 rounded transition-colors ${
                  state.settings.showGrid ? 'bg-orange-600' : 'bg-gray-800 hover:bg-orange-600'
                }`}
                title={state.settings.showGrid ? "Hide Grid" : "Show Grid"}
              >
                <Grid className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="text-sm font-medium text-white">
              {state.name}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-grow">
          {/* Tool Palette */}
          <div className="w-72 bg-gray-100 p-4 border-r border-gray-300">
            <ToolSelector pous={[]} />
          </div>

          {/* Ladder Logic Editor */}
          <div className="flex-1 bg-white p-4">
            <button
              onClick={handleAddRung}
              className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Add Rung
            </button>

            <div className="border border-gray-300 rounded">
              <LadderEditor
                rungs={state.rungs}
                onAddComponent={handleAddComponent}
                onEditComponent={() => {}}
                onDeleteComponent={handleDeleteComponent}
                onMoveComponent={handleMoveComponent}
                onDeleteRung={handleDeleteRung}
                showGrid={state.settings.showGrid}
                showAddresses={state.settings.showAddresses}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        {isSettingsOpen && (
          <ProjectSettings
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onSave={handleSettingsSave}
            initialSettings={state.settings}
          />
        )}

        {isVariableManagerOpen && (
          <VariableManager
            variables={[]}
            onAddVariable={() => {}}
            onUpdateVariable={() => {}}
            onDeleteVariable={() => {}}
            onAddToWatch={() => {}}
            onClose={() => setIsVariableManagerOpen(false)}
          />
        )}

        {isIOConfigOpen && (
          <IOConfiguration
            devices={[]}
            onAddDevice={() => {}}
            onUpdateDevice={() => {}}
            onDeleteDevice={() => {}}
            onAddPoint={() => {}}
            onUpdatePoint={() => {}}
            onDeletePoint={() => {}}
            onClose={() => setIsIOConfigOpen(false)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default ArkWriter;