import { ITask } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define custom types
type SortOrder = 1 | -1;
type TabState = "OPEN" | "IN_PROGRESS" | "CLOSED";

// Define priority levels
const PRIORITIES: Record<string, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
  CRITICAL: 5,
  BLOCKER: 6,
  TRIVIAL: 7,
};

// Define the shape of the task state
interface TaskState {
  tasks: ITask[];
  allTasks: ITask[];
  searchQuery: string;
  sortField: string;
  sortOrder: SortOrder;
  currentTab: TabState;
  hasMore: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  loading: boolean;
  loadMore: () => void;

  // Actions/Setters
  setTasks: (tasks: ITask[]) => void;
  updateTask: (task: ITask) => void
  setSearchQuery: (query: string) => void;
  setSorting: (field: string, order: SortOrder) => void;
  setCurrentTab: (tab: TabState) => void;

  // Getters
  getFilteredTasks: () => ITask[];
  getTasksByStatus: (status: TabState) => ITask[];

  // Helpers
  sortTasks: (tasks: ITask[]) => ITask[];
  filterBySearch: (tasks: ITask[]) => ITask[];
}

// Create the task store using Zustand
const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      allTasks: [],
      searchQuery: "",
      sortField: "created_at",
      sortOrder: 1,
      currentTab: "OPEN",
      hasMore: true,
      currentPage: 1,
      itemsPerPage: 30,
      totalPages: 999,
      loading: false,

      // Setter functions
      setTasks: (tasks: ITask[]) => {
        set({ allTasks:tasks, tasks: tasks.slice(0, get().itemsPerPage) });
        set({ totalPages: Math.ceil(tasks.length / get().itemsPerPage) });
      },

      loadMore: () => {
        const state = get();
        if (!state.hasMore) return;
        set({ loading: true });
        setTimeout(() => {
          const start = state.currentPage * state.itemsPerPage;
          const end = start + state.itemsPerPage;
          const newTasks = state.allTasks.slice(start, end);
          set({ tasks: [...state.tasks, ...newTasks] });
          set({ currentPage: state.currentPage + 1 });
          set({ hasMore: state.currentPage < state.totalPages });
          set({ loading: false });
        }, 1000);
      },
      updateTask: (task: ITask) => {
        const state = get();
        const updatedTasks = state.tasks.map((t) =>
          t.id === task.id ? task : t
        );
        set({ tasks: updatedTasks });
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSorting: (field, order) =>
        set({
          sortField: field,
          sortOrder: order,
        }),
      setCurrentTab: (tab) => set({ currentTab: tab }),

      // Sort tasks based on sortField and sortOrder
      sortTasks: (tasks: ITask[]) => {
        const state = get();
        return tasks.sort((a, b) => {
          if (state.sortField === "created_at") {
            const comparison =
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime();
            return state.sortOrder === 1 ? comparison : -comparison;
          }

          if (state.sortField === "priority") {
            const comparison = PRIORITIES[a.priority] - PRIORITIES[b.priority];
            return state.sortOrder === 1 ? comparison : -comparison;
          }
          return 0;
        });
      },

      // Filter tasks based on searchQuery
      filterBySearch: (tasks: ITask[]) => {
        const state = get();
        if (!state.searchQuery) return tasks;

        const query = state.searchQuery.toLowerCase();
        return tasks.filter((task) => task.name.toLowerCase().includes(query));
      },

      // Get tasks filtered by status, sorted, and filtered by searchQuery
      getTasksByStatus: (status: TabState) => {
        const state = get();
        const tasksByStatus = state.tasks.filter(
          (task) => task.status === status
        );
        const filteredTasks = state.filterBySearch(tasksByStatus);
        return state.sortTasks(filteredTasks);
      },

      // Get filtered tasks based on currentTab
      getFilteredTasks: () => {
        const state = get();
        return state.getTasksByStatus(state.currentTab);
      },
    }),
    {
      name: "task-store",
      partialize: (state) => ({
        tasks: state.tasks,
        searchQuery: state.searchQuery,
        sortField: state.sortField,
        sortOrder: state.sortOrder,
        currentTab: state.currentTab,
      }),
    }
  )
);

export default useTaskStore;
