import { ProjectData, POU } from '../types/project';
import { fileService } from './FileService';
import { toastService } from './ToastService';

const DEFAULT_PROJECT: ProjectData = {
  name: "Untitled Project",
  rungs: [{ components: [] }],
  settings: {
    name: "Untitled Project",
    description: "",
    author: "",
    gridSize: 40,
    showGrid: true,
    showAddresses: true,
    autoSave: false
  },
  pous: []
};

class ProjectService {
  private currentProject: ProjectData = DEFAULT_PROJECT;

  getCurrentProject(): ProjectData {
    return this.currentProject;
  }

  async createNewProject(): Promise<ProjectData> {
    try {
      this.currentProject = { ...DEFAULT_PROJECT };
      toastService.success('New project created');
      return this.currentProject;
    } catch (error: any) {
      toastService.error(`Failed to create new project: ${error.message}`);
      throw error;
    }
  }

  async openProject(): Promise<ProjectData> {
    try {
      const options = {
        types: [
          {
            description: 'Project Files',
            accept: {
              'application/json': ['.json'],
              'text/plain': ['.ll', '.st']
            }
          }
        ]
      };

      const [fileHandle] = await window.showOpenFilePicker(options);
      const file = await fileHandle.getFile();
      const content = await file.text();

      let project: ProjectData;

      if (file.name.endsWith('.json')) {
        project = JSON.parse(content);
      } else if (file.name.endsWith('.ll')) {
        project = await fileService.parseLLFormat(content);
      } else if (file.name.endsWith('.st')) {
        project = await fileService.parseSTFormat(content);
      } else {
        throw new Error('Unsupported file format');
      }

      this.currentProject = project;
      toastService.success('Project opened successfully');
      return project;
    } catch (error: any) {
      toastService.error(`Failed to open project: ${error.message}`);
      throw error;
    }
  }

  async saveProject(project: ProjectData): Promise<void> {
    try {
      await fileService.saveProject(project, 'json');
      this.currentProject = project;
      toastService.success('Project saved successfully');
    } catch (error: any) {
      toastService.error(`Failed to save project: ${error.message}`);
      throw error;
    }
  }

  async saveProjectAs(project: ProjectData): Promise<void> {
    try {
      const options = {
        suggestedName: `${project.name}.json`,
        types: [
          {
            description: 'Project File',
            accept: {
              'application/json': ['.json']
            }
          }
        ]
      };

      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(project, null, 2));
      await writable.close();

      this.currentProject = project;
      toastService.success('Project saved successfully');
    } catch (error: any) {
      toastService.error(`Failed to save project: ${error.message}`);
      throw error;
    }
  }
}

export const projectService = new ProjectService();