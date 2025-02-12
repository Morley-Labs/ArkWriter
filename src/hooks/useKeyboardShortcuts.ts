import { useHotkeys } from 'react-hotkeys-hook';
import { fileService } from '../services/FileService';
import { toastService } from '../services/ToastService';
import { ProjectData } from '../types/project';

interface UseKeyboardShortcutsProps {
  projectData: ProjectData;
  onNewProject: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const useKeyboardShortcuts = ({
  projectData,
  onNewProject,
  onSave,
  onUndo,
  onRedo,
}: UseKeyboardShortcutsProps) => {
  // New Project (Ctrl/Cmd + N)
  useHotkeys('mod+n', (event) => {
    event.preventDefault();
    onNewProject();
    toastService.info('New project created');
  });

  // Save (Ctrl/Cmd + S)
  useHotkeys('mod+s', async (event) => {
    event.preventDefault();
    try {
      await onSave();
      toastService.success('Project saved successfully');
    } catch (error: any) {
      toastService.error(`Failed to save project: ${error.message}`);
    }
  });

  // Undo (Ctrl/Cmd + Z)
  useHotkeys('mod+z', (event) => {
    event.preventDefault();
    onUndo();
  });

  // Redo (Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y)
  useHotkeys(['mod+shift+z', 'mod+y'], (event) => {
    event.preventDefault();
    onRedo();
  });

  // Quick Export as JSON (Ctrl/Cmd + E)
  useHotkeys('mod+e', async (event) => {
    event.preventDefault();
    try {
      await fileService.saveProject(projectData, 'json');
      toastService.success('Project exported successfully');
    } catch (error: any) {
      toastService.error(`Failed to export project: ${error.message}`);
    }
  });
};