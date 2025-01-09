import React, { useEffect, useState } from "react";
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
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import useTaskStore from "@/store/useTaskStore";
import clsx from "clsx";

type Props = {
  tasks: ITask[];
};

const SortingButton = ({ field, name }: { field: string; name: string }) => {
  const { sortField, sortOrder, setSorting } = useTaskStore();

  const handleClick = () => {
    setSorting(field, sortOrder === -1 ? 1 : -1);
  };

  return (
    <Button variant={"ghost"} onClick={() => handleClick()}>
      {name}
      {sortField === field && sortOrder === 1 ? (
        <ArrowUpWideNarrow />
      ) : (
        <ArrowDownWideNarrow />
      )}
    </Button>
  );
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-green-100 text-green-600",
  MEDIUM: "bg-yellow-100 text-yellow-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
  CRITICAL: "bg-red-50 text-red-400",
  BLOCKER: "bg-red-100 text-red-500",
  TRIVIAL: "bg-gray-100 text-gray-600",
};

const TaskTable = ({ tasks }: Props) => {
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTableRowElement>,
    index: number
  ) => {
    if (event.key === "ArrowDown") {
      setActiveRowIndex((prevIndex) =>
        prevIndex === null ? 0 : Math.min(prevIndex + 1, tasks.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      setActiveRowIndex((prevIndex) =>
        prevIndex === null ? 0 : Math.max(prevIndex - 1, 0)
      );
    } else if (event.key === "Enter" && activeRowIndex !== null) {
      const task = tasks[activeRowIndex];
      console.log(`Enter pressed, selecting task: ${task.name} (ID: ${task.id})`);
    }
  };

  return (
    <div className="relative w-full overflow-auto rounded-md border">
      <Table className="table-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Assignee</TableHead>
            <TableHead className="text-center">
              <SortingButton field={"priority"} name={"Priority"} />
            </TableHead>
            <TableHead className="text-center">
              <SortingButton field={"created_at"} name={"Created At"} />
            </TableHead>
            <TableHead className="text-center">Labels</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow     
              tabIndex={0}
              key={task.id}
              data-id={task.id}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onFocus={() => setActiveRowIndex(index)}
              className={
                clsx({
                  "cursor-pointer": true,
                  "focus-visible: outline-none": true,
                  "hover:bg-neutral-100/70": true,
                  "outline outline-2 outline-blue-500": activeRowIndex === index,
                  "bg-gray-50": index % 2 === 0,
                })
              }
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
                <span
                  className={`text-xs font-bold ${
                    PRIORITY_STYLES[task.priority]
                  } p-1 rounded`}
                >
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

          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No tasks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTable;
