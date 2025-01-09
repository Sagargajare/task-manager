interface ITask {
  id: number;
  name: string;
  labels: string[];
  status: string;
  priority: string;
  assignee: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  comment: string;
}

interface ITaskApiResponse {
    tasks: ITask[];
    pagination: {
      total: number;
      has_next: boolean;
      page_size: number;
      offset: number;
    };
  }

export type { ITask, ITaskApiResponse };