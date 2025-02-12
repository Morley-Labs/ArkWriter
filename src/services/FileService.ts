import { ProjectData } from '../types/project';

export type FileFormat = 'll' | 'st' | 'json';

class FileService {
  async saveProject(projectData: ProjectData, format: FileFormat): Promise<void> {
    try {
      if (!window.showSaveFilePicker) {
        throw new Error('Your browser does not support the File System Access API. Please use a modern browser like Chrome or Edge.');
      }

      let fileContent: string;
      let fileExtension: string;
      let mimeType: string;

      switch (format) {
        case 'll':
          fileContent = this.convertToLL(projectData);
          fileExtension = '.ll';
          mimeType = 'application/octet-stream';
          break;
        case 'st':
          fileContent = this.convertToST(projectData);
          fileExtension = '.st';
          mimeType = 'text/plain';
          break;
        case 'json':
          fileContent = JSON.stringify(projectData, null, 2);
          fileExtension = '.json';
          mimeType = 'application/json';
          break;
        default:
          throw new Error('Unsupported file format');
      }

      const options = {
        suggestedName: `${projectData.name}${fileExtension}`,
        types: [
          {
            description: 'Project File',
            accept: {
              [mimeType]: [fileExtension]
            }
          }
        ]
      };

      const handle = await window.showSaveFilePicker(options);
      const writable = await handle.createWritable();
      await writable.write(fileContent);
      await writable.close();
    } catch (error: any) {
      throw new Error(`Failed to save project: ${error.message}`);
    }
  }

  async openProject(): Promise<ProjectData> {
    try {
      if (!window.showOpenFilePicker) {
        throw new Error('Your browser does not support the File System Access API. Please use a modern browser like Chrome or Edge.');
      }

      const options = {
        types: [
          {
            description: 'Project Files',
            accept: {
              'application/json': ['.json'],
              'text/plain': ['.ll', '.st']
            }
          }
        ],
        multiple: false
      };

      const [fileHandle] = await window.showOpenFilePicker(options);
      const file = await fileHandle.getFile();
      const content = await file.text();
      
      if (!content) {
        throw new Error('The selected file is empty');
      }

      let project: ProjectData;
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.json')) {
        try {
          project = JSON.parse(content);
          if (!project.rungs || !Array.isArray(project.rungs)) {
            throw new Error('Invalid project format: missing or invalid rungs');
          }
        } catch (e) {
          throw new Error('Invalid JSON format in the selected file');
        }
      } else if (fileName.endsWith('.ll')) {
        project = await this.parseLLFormat(content);
      } else if (fileName.endsWith('.st')) {
        project = await this.parseSTFormat(content);
      } else {
        throw new Error('Unsupported file format. Please select a .json, .ll, or .st file');
      }

      return project;
    } catch (error: any) {
      throw new Error(`Failed to open project: ${error.message}`);
    }
  }
  async parseLLFormat(content: string): Promise<ProjectData> {
    const lines = content.split('\n');
    const project: ProjectData = {
      name: 'Untitled Project',
      rungs: [],
      settings: {
        name: 'Untitled Project',
        description: '',
        author: '',
        gridSize: 40,
        showGrid: true,
        showAddresses: true,
        autoSave: false
      }
    };

    let currentRung: any = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('PROJECT:')) {
        project.name = trimmedLine.substring(8).trim();
        project.settings.name = project.name;
      } else if (trimmedLine.startsWith('AUTHOR:')) {
        project.settings.author = trimmedLine.substring(7).trim();
      } else if (trimmedLine.startsWith('DESCRIPTION:')) {
        project.settings.description = trimmedLine.substring(12).trim();
      } else if (trimmedLine === 'RUNG') {
        currentRung = { components: [] };
      } else if (trimmedLine === 'END_RUNG' && currentRung) {
        project.rungs.push(currentRung);
        currentRung = null;
      } else if (currentRung && trimmedLine) {
        const [type, position, ...rest] = trimmedLine.split(' ');
        const variables = rest.length ? JSON.parse(rest.join(' ')) : undefined;
        
        currentRung.components.push({
          type,
          position: parseInt(position, 10),
          variables
        });
      }
    }

    // Ensure at least one rung exists
    if (project.rungs.length === 0) {
      project.rungs.push({ components: [] });
    }

    return project;
  }

  async parseSTFormat(content: string): Promise<ProjectData> {
    const project: ProjectData = {
      name: 'Untitled Project',
      rungs: [{ components: [] }],
      settings: {
        name: 'Untitled Project',
        description: '',
        author: '',
        gridSize: 40,
        showGrid: true,
        showAddresses: true,
        autoSave: false
      }
    };

    // Extract program name
    const programMatch = content.match(/PROGRAM\s+(\w+)/);
    if (programMatch) {
      project.name = programMatch[1].replace(/_/g, ' ');
      project.settings.name = project.name;
    }

    // Extract author and description from comments
    const commentMatch = content.match(/\(\*([\s\S]*?)\*\)/);
    if (commentMatch) {
      const comment = commentMatch[1];
      const authorMatch = comment.match(/Author:\s*(.*)/);
      const descMatch = comment.match(/Description:\s*(.*)/);
      
      if (authorMatch) project.settings.author = authorMatch[1].trim();
      if (descMatch) project.settings.description = descMatch[1].trim();
    }

    return project;
  }

  private convertToLL(projectData: ProjectData): string {
    let output = `PROJECT: ${projectData.name}\n`;
    output += `AUTHOR: ${projectData.settings.author}\n`;
    output += `DESCRIPTION: ${projectData.settings.description}\n\n`;

    projectData.rungs.forEach((rung, index) => {
      output += `RUNG ${index + 1}\n`;
      rung.components.forEach(component => {
        output += `  ${component.type} ${component.position} `;
        if (component.variables) {
          output += JSON.stringify(component.variables);
        }
        output += '\n';
      });
      output += 'END_RUNG\n\n';
    });

    return output;
  }

  private convertToST(projectData: ProjectData): string {
    let output = `PROGRAM ${projectData.name.replace(/\s+/g, '_')}\n`;
    output += `(*\n  Author: ${projectData.settings.author}\n`;
    output += `  Description: ${projectData.settings.description}\n*)\n\n`;
    output += 'VAR\n';
    
    // Collect all variables
    const variables = new Set<string>();
    projectData.rungs.forEach(rung => {
      rung.components.forEach(component => {
        if (component.variables?.address) {
          variables.add(component.variables.address);
        }
      });
    });

    // Declare variables
    variables.forEach(variable => {
      output += `  ${variable} : BOOL;\n`;
    });
    
    output += 'END_VAR\n\n';

    // Convert ladder logic to ST
    projectData.rungs.forEach((rung, index) => {
      output += `(* Rung ${index + 1} *)\n`;
      // Convert rung components to ST logic
      const stLogic = this.convertRungToST(rung);
      output += stLogic + '\n\n';
    });

    output += 'END_PROGRAM\n';
    return output;
  }

  private convertRungToST(rung: any): string {
    let output = '';
    let conditions: string[] = [];
    let actions: string[] = [];

    rung.components.forEach((component: any) => {
      if (component.type.includes('CONTACT')) {
        const varName = component.variables?.address || 'UnknownVar';
        conditions.push(component.type === 'CONTACT_NO' ? varName : `NOT(${varName})`);
      } else if (component.type === 'COIL') {
        const varName = component.variables?.address || 'UnknownVar';
        actions.push(varName);
      }
    });

    if (conditions.length > 0) {
      output += `IF ${conditions.join(' AND ')} THEN\n`;
      actions.forEach(action => {
        output += `  ${action} := TRUE;\n`;
      });
      output += 'END_IF;';
    }

    return output;
  }
}

export const fileService = new FileService();