import { create } from "zustand";
import { ITask } from "@/types";

interface DialogState {
    isOpen: boolean;
    task: ITask | null;
    openDialog: (task: ITask | null) => void;
    closeDialog: () => void;
}

const useDialogStore = create<DialogState>((set) => ({
    isOpen: false,
    task: null,
    openDialog: (task) => {
        console.log("task in use", task);
        set({ isOpen: true, task })},
    closeDialog: () => {
        console.log("auto closing")
        set({ isOpen: false, task: null })},
}));

export default useDialogStore;