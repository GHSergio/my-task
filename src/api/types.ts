export interface Project {
  id: string;
  name: string;
  description?: string;
  owner: string;
  dueDate?: string;
}

export interface Task {
  id: number;
  projectId: string;
  title: string;
  completed: boolean;
  dueDate: string;
}
