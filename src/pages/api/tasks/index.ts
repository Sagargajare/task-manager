import { ITaskApiResponse, ITask } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

interface ErrorResponse {
  message: string;
}

const STATUSES = ["OPEN", "CLOSED", "IN_PROGRESS"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT", "CRITICAL", "BLOCKER", "TRIVIAL"];
const LABELS = ["frontend", "backend", "urgent", "bug", "feature"];

const generateTasks = (): ITask[] => {
  const tasks: ITask[] = [];
  for (let i = 1; i <= 100; i++) {
    tasks.push({
      id: i,
      name: `Task ${i}`,
      labels: LABELS.slice(0, i % LABELS.length),
      status: STATUSES[i % STATUSES.length],
      priority: PRIORITIES[i % PRIORITIES.length],
      assignee: `assignee${i}@company.com`,
      due_date: `2024-02-01T00:00:00Z`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      comment: `Task ${i} description`,
    });
  }
  return tasks;
};

let tasks = generateTasks();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ITaskApiResponse | ErrorResponse>
) {
  const { method } = req;

  if (method === "GET") {
    const { status, limit = "30", offset = "0" }: { status?: string; limit?: string; offset?: string } = req.query;

    const parsedLimit = parseInt(limit as string, 10);
    const parsedOffset = parseInt(offset as string, 10);

    console.log("status", typeof parsedLimit, typeof parsedOffset);
    
    const filteredTasks = tasks.filter(
      (task) => !status || task.status === status
    );

    const paginatedTasks = filteredTasks.slice(parsedOffset, parsedOffset + parsedLimit);

    const response: ITaskApiResponse = {
      tasks: paginatedTasks,
      pagination: {
        total: filteredTasks.length,
        has_next: filteredTasks.length > parsedOffset + parsedLimit,
        page_size: parsedLimit,
        offset: parsedOffset,
      },
    };

    res.status(200).json(response);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
