import { create } from "zustand";
import { ITask } from "@/types";

interface DialogState {
    isOpen: boolean;
    task: ITask | null;
    openDialog: (task: ITask | null) => void;
    closeDialog: () => void;
    updateTask: (task: ITask | null) => void;
}

const useDialogStore = create<DialogState>((set) => ({
    isOpen: false,
    task: null,
    updateTask: (task) => {
        set({ task, isOpen: true })
    },
    openDialog: (task) => {
        set({ isOpen: true, task })},
    closeDialog: () => {
        set({ isOpen: false, task: null })},
}));

export default useDialogStore;