import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ITask, ITaskApiResponse } from "@/types";
import TaskTable from "./TaskTable";
import { Input } from "../ui/input";

const TaskManager = ({ data }: { data: ITaskApiResponse }) => {
  console.log(data.tasks);
  const openTasks = data.tasks.filter((task: ITask) => task.status === "OPEN");
  const closedTasks = data.tasks.filter(
    (task: ITask) => task.status === "CLOSED"
  );
  const inProgressTasks = data.tasks.filter(
    (task: ITask) => task.status === "IN_PROGRESS"
  );

  return (
    <div className="w-[300px] xs:w-[500px] md:w-[1200px] sm:w-[500] p-0 sm:p-4 md:p-20">
        <div className="flex items-center py-4">
        <Input
          placeholder="Search tasks"
          className="max-w-sm"
        />
        </div>
      <Tabs
        defaultValue="open"
        className=""
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="open">Open {openTasks.length}</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress {inProgressTasks.length}</TabsTrigger>
          <TabsTrigger value="closed">Completed {closedTasks.length}</TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          <TaskTable tasks={openTasks} />
        </TabsContent>
        <TabsContent value="inprogress">
          <TaskTable tasks={inProgressTasks} />
        </TabsContent>
        <TabsContent value="closed">
          <TaskTable tasks={closedTasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskManager;
