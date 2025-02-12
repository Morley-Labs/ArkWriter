interface SelectedTool {
  type: string;
  icon: any;
}

declare global {
  interface Window {
    selectedTool?: SelectedTool;
  }
}