import React from 'react';
import { Menu } from './Menu';
import { ValidationService } from '../services/ValidationService'; // Import ValidationService
import { compilationService } from '../services/CompilationService'; // Import CompilationService
import { Search, ZoomIn, ZoomOut, Maximize2, Grid, Tag, GitBranch } from 'lucide-react';

interface ViewSettings {
  showGrid: boolean;
  showAddresses: boolean;
  showCrossReferences: boolean;
}

interface MainMenuProps {
  onNewProject: () => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onSaveAs: () => void;
  onExportJSON: () => void;
  onExportST: () => void;
  onExportLL: () => void;
  onShowSettings: () => void;
  onShowVariables: () => void;
  onShowIOConfig: () => void;
  onShowPOUManager: () => void;
  onShowCrossReferences: () => void;
  onShowForceTable: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onToggleGrid: () => void;
  onToggleAddressLabels: () => void;
  onToggleCrossReferences: () => void;
  viewSettings: ViewSettings;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewProject,
  onOpenProject,
  onSaveProject,
  onSaveAs,
  onExportJSON,
  onExportST,
  onExportLL,
  onShowSettings,
  onShowVariables,
  onShowIOConfig,
  onShowPOUManager,
  onShowCrossReferences,
  onShowForceTable,
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onDelete,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onToggleGrid,
  onToggleAddressLabels,
  onToggleCrossReferences,
  viewSettings
}) => {
  const validationService = new ValidationService(); // Initialize ValidationService

  // "Verify Program" handler
  const handleVerifyProgram = () => {
    const projectData = {
        name: 'Sample Project',
        rungs: [] // TODO: Replace with actual project data
    };

    if (!projectData || !Array.isArray(projectData.rungs)) {
        alert('Invalid project data. Please load a valid project.');
        return;
    }

    const results = validationService.validateProject(projectData);

    // Open a plain-text window to display results
    const validationWindow = window.open('', '_blank', 'width=400,height=600');
    if (validationWindow) {
        if (results.valid) {
            validationWindow.document.write('<pre>Validation Successful: No errors found.</pre>');
        } else {
            validationWindow.document.write('<pre>Validation Failed:\n' + results.errors.join('\n') + '</pre>');
        }
        validationWindow.document.close();
    }
};

  // "Generate Plutus" handler
const handleGeneratePlutus = async () => {
  const ir = JSON.stringify({ name: 'Sample Project', rungs: [] }); // TODO: Replace with actual IR data
  const compilationResult = await compilationService.compileToPlutusTx(ir);
  const compileWindow = window.open('', '_blank', 'width=400,height=600');
  
  if (compileWindow) {
    if (compilationResult.success) {
      compileWindow.document.write(`<pre>Compilation Successful:\n${compilationResult.data}</pre>`);
    } else {
      compileWindow.document.write(`<pre>Compilation Failed:\n${compilationResult.error}</pre>`);
    }
    compileWindow.document.close();
  }
};

  // "Deploy to Network" handler
const handleDeploy = async () => {
  const deploymentResult = await compilationService.deployCompiledScript();
  const deployWindow = window.open('', '_blank', 'width=400,height=600');

  if (deployWindow) {
    if (deploymentResult.success) {
      deployWindow.document.write(
        `<pre>Deployment Successful:\nScript Address: ${deploymentResult.data.scriptAddress}\nTransaction Hash: ${deploymentResult.data.txHash}</pre>`
      );
    } else {
      deployWindow.document.write(`<pre>Deployment Failed:\n${deploymentResult.error}</pre>`);
    }
    deployWindow.document.close();
  }
};


  const menus = [
    {
      label: 'File',
      items: [
        { label: 'New Project', onClick: onNewProject, shortcut: '⌘N' },
        { label: 'Open Project', onClick: onOpenProject, shortcut: '⌘O' },
        { type: 'separator' },
        { label: 'Save', onClick: onSaveProject, shortcut: '⌘S' },
        { label: 'Save As...', onClick: onSaveAs, shortcut: '⇧⌘S' },
        { type: 'separator' },
        { label: 'Export as JSON', onClick: onExportJSON, shortcut: '⌘E' },
        { label: 'Export as ST', onClick: onExportST },
        { label: 'Export as LL', onClick: onExportLL },
        { type: 'separator' },
        { label: 'Project Settings', onClick: onShowSettings }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', onClick: onUndo, shortcut: '⌘Z', disabled: !onUndo },
        { label: 'Redo', onClick: onRedo, shortcut: '⇧⌘Z', disabled: !onRedo },
        { type: 'separator' },
        { label: 'Cut', onClick: onCut, shortcut: '⌘X', disabled: !onCut },
        { label: 'Copy', onClick: onCopy, shortcut: '⌘C', disabled: !onCopy },
        { label: 'Paste', onClick: onPaste, shortcut: '⌘V', disabled: !onPaste },
        { type: 'separator' },
        { label: 'Delete', onClick: onDelete, shortcut: '⌫', disabled: !onDelete }
      ]
    },
    {
      label: 'View',
      items: [
        { 
          label: 'Zoom In',
          onClick: onZoomIn,
          shortcut: '⌘+',
          icon: ZoomIn
        },
        { 
          label: 'Zoom Out',
          onClick: onZoomOut,
          shortcut: '⌘-',
          icon: ZoomOut
        },
        { 
          label: 'Fit to Screen',
          onClick: onFitToScreen,
          shortcut: '⌘0',
          icon: Maximize2
        },
        { type: 'separator' },
        { 
          label: 'Show Grid',
          onClick: onToggleGrid,
          checked: viewSettings.showGrid,
          icon: Grid
        },
        { 
          label: 'Show Address Labels',
          onClick: onToggleAddressLabels,
          checked: viewSettings.showAddresses,
          icon: Tag
        },
        { 
          label: 'Show Cross References',
          onClick: onToggleCrossReferences,
          checked: viewSettings.showCrossReferences,
          icon: GitBranch
        }
      ]
    },
    {
      label: 'Project',
      items: [
        { label: 'Variables', onClick: onShowVariables },
        { label: 'I/O Configuration', onClick: onShowIOConfig },
        { type: 'separator' },
        { label: 'Program Organization Units', onClick: onShowPOUManager },
        { label: 'Add Program', onClick: () => {
          onShowPOUManager();
          // The POUManager will handle creating a new program
        }},
        { label: 'Add Function Block', onClick: () => {
          onShowPOUManager();
          // The POUManager will handle creating a new function block
        }},
        { type: 'separator' },
        { label: 'Cross References', onClick: onShowCrossReferences },
        { label: 'Force Table', onClick: onShowForceTable }
      ]
    },
   {
  label: 'Build',
  items: [
    { label: 'Verify Program', onClick: handleVerifyProgram },
    { label: 'Build Project', onClick: () => {} },
    { label: 'Generate Plutus', onClick: handleGeneratePlutus }, // Now linked to compilation
    { type: 'separator' },
    { label: 'Deploy to Network', onClick: handleDeploy }, // Now linked to deploy function
    { label: 'Build Settings', onClick: () => {} }
  ]
},
    {
      label: 'Debug',
      items: [
        { label: 'Start Debugging', onClick: () => {} },
        { label: 'Stop Debugging', onClick: () => {} },
        { label: 'Pause', onClick: () => {} },
        { label: 'Single Scan', onClick: () => {} },
        { type: 'separator' },
        { label: 'Toggle Breakpoint', onClick: () => {} },
        { label: 'Clear All Breakpoints', onClick: () => {} },
        { type: 'separator' },
        { label: 'Watch Window', onClick: () => {} },
        { label: 'Force Values', onClick: () => {} }
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'Documentation', onClick: () => {} },
        { label: 'Keyboard Shortcuts', onClick: () => {} },
        { type: 'separator' },
        { label: 'About ArkWriter', onClick: () => {} }
      ]
    }
  ];

  return (
    <div className="flex items-center space-x-4">
      {menus.map((menu, index) => (
        <Menu key={index} {...menu} />
      ))}
    </div>
  );
};
