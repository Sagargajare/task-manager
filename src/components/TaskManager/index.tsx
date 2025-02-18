"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ITaskApiResponse } from "@/types";
import TaskTable from "./TaskTable";
import { Input } from "../ui/input";
import useTaskStore from "@/store/useTaskStore";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const TaskManager = ({ data }: { data: ITaskApiResponse }) => {
  const {
    currentTab,
    setCurrentTab,
    setTasks,
    getTasksByStatus,
    searchQuery,
    setSearchQuery,
    setSorting,
    getFilteredTasks,
  } = useTaskStore();

  useEffect(() => {
    setTasks(data.tasks);
  }, [data.tasks, setTasks]);

  const activeTabTasks = getTasksByStatus(currentTab);

  return (
    <div className="w-[376px] xs:w-[500px] md:w-[1200px] sm:w-[500] p-0 sm:p-4 md:p-20 h-screen overflow-hidden">
      <div className="flex items-center py-4 justify-between">
        <div className="relative max-w-md w-full mr-1">
          <Input
            width={"full"}
            placeholder="Search tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 border border-gray-400"
          />
          <Button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded"
            variant={"ghost"}
            onClick={() => setSearchQuery("")}
          >
            <X />
          </Button>
        </div>
        <Button onClick={() => setSorting("created_at", 1)} className="border border-gray-400" variant={"outline"}>
          Reset Sorting
        </Button>
      </div>
      <Tabs
        defaultValue={currentTab}
        value={currentTab}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onValueChange={(tab) => setCurrentTab(tab as any)}
      >
        <TabsList className="grid w-full grid-cols-3 border border-gray-400">
          <TabsTrigger value="OPEN">
            Open {currentTab == "OPEN" ? activeTabTasks.length : ""}
          </TabsTrigger>
          <TabsTrigger value="IN_PROGRESS">
            In Progress{" "}
            {currentTab == "IN_PROGRESS" ? activeTabTasks.length : ""}
          </TabsTrigger>
          <TabsTrigger value="CLOSED">
            Completed {currentTab == "CLOSED" ? activeTabTasks.length : ""}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="OPEN">
          <TaskTable tasks={getFilteredTasks()} />
        </TabsContent>
        <TabsContent value="IN_PROGRESS">
          <TaskTable tasks={getFilteredTasks()} />
        </TabsContent>
        <TabsContent value="CLOSED">
          <TaskTable tasks={getFilteredTasks()} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskManager;
