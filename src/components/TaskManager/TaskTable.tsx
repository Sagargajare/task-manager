import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITask } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { ArrowDownWideNarrow } from "lucide-react";

type Props = {
  tasks: ITask[];
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-green-100 text-green-600",
  MEDIUM: "bg-yellow-100 text-yellow-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
  CRITICAL: "bg-red-50 text-red-400",
  BLOCKER: "bg-red-100 text-red-500",
  TRIVIAL: "bg-gray-100 text-gray-600"
};

const TaskTable = ({ tasks }: Props) => {
  return (
    <div className="relative w-full overflow-auto rounded-md border">
      <Table className="table-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">
              <Button variant={"ghost"}>Assignee</Button>
            </TableHead>
            <TableHead className="text-center">
              <Button variant={"ghost"}>
                Priority <ArrowDownWideNarrow />
              </Button>
            </TableHead>
            <TableHead className="text-center">
              <Button variant={"ghost"}>
                Created At <ArrowDownWideNarrow />
              </Button>
            </TableHead>
            <TableHead className="text-center">Labels</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow
              key={index}
              className={`cursor-pointer hover:bg-neutral-100/70 ${
                index % 2 === 0 ? "bg-gray-50" : ""
              }`}
            >
              <TableCell className="font-medium text-center">
                {task.name}
              </TableCell>
              <TableCell className="flex justify-center items-center">
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${
                      task.assignee[0] + task.id
                    }&background=gray&color=fff`}
                    alt={task.assignee}
                  />
                  <AvatarFallback>A{task.id}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="text-center">
                <span className={`text-xs font-bold ${PRIORITY_STYLES[task.priority]} p-1 rounded`}>
                  {task.priority.toLowerCase()}
                </span>
              </TableCell>
              <TableCell className="text-center">
                {new Date(task.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="flex basis-2 justify-center items-center">
                {task.labels.map((label, index) => (
                  <p
                    key={index}
                    className="m-1 bg-neutral-200 rounded-lg text-xs w-fit p-1 text-center"
                  >
                    {label}
                  </p>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTable;
