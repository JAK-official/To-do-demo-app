import { createContext, useContext, useEffect, useState } from "react";
import {
  getTasks,
  insertTask,
  updateTaskCompleted,
} from "@/database/taskRepository";

const ItemsContext = createContext<any>(null);

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  function loadTasks() {
    console.log("Loading tasks...");

    const tasks = getTasks();
    console.log("Tasks from DB:", tasks);
    const active = tasks
      .filter((task) => task.completed === 0)
      .map((task) => ({
        id: task.id,
        name: task.title,
      }));

    const completed = tasks
      .filter((task) => task.completed === 1)
      .map((task) => ({
        id: task.id,
        name: task.title,
      }));

    setItems(active);
    setCompletedItems(completed);
  }

  function addItem(name: string) {
    const result = insertTask(name);

    setItems((prev) => [
      ...prev,
      {
        id: result.id,
        name,
      },
    ]);
  }

  function moveItem(id: number, completed: boolean) {
    updateTaskCompleted(id, completed ? 0 : 1);

    if (!completed) {
      const item = items.find((i) => i.id === id);

      if (!item) return;

      setItems((prev) => prev.filter((i) => i.id !== id));

      setCompletedItems((prev) => [...prev, item]);
    } else {
      const item = completedItems.find((i) => i.id === id);

      if (!item) return;

      setCompletedItems((prev) => prev.filter((i) => i.id !== id));

      setItems((prev) => [...prev, item]);
    }
  }

  function reorderItems(list, newData) {
    if (list === "items") {
      setItems(newData);
    } else {
      setCompletedItems(newData);
    }
  }

  return (
    <ItemsContext.Provider
      value={{
        items,
        completedItems,
        addItem,
        moveItem,
        loadTasks,
        reorderItems
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  return useContext(ItemsContext);
}
