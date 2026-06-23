import { createContext, useContext, useEffect, useState } from "react";
import {
  getTasks,
  insertTask,
  updateTaskCompleted,
  updateTaskPosition,
  deleteTask,
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
        position: task.position,
      }));

    const completed = tasks
      .filter((task) => task.completed === 1)
      .map((task) => ({
        id: task.id,
        name: task.title,
        position: task.position,
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
        position: prev.length,
      },
    ]);
  }

  function moveItem(id: number, completed: boolean) {
    const source = completed ? completedItems : items;
    const item = source.find((i) => i.id === id);

    if (!item) return;

    const destinationLength = completed ? items.length : completedItems.length;

    updateTaskCompleted(id, completed ? 0 : 1);
    updateTaskPosition(id, destinationLength);

    const movedItem = {
      ...item,
      position: destinationLength,
    };

    if (!completed) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setCompletedItems((prev) => [...prev, movedItem]);
    } else {
      setCompletedItems((prev) => prev.filter((i) => i.id !== id));
      setItems((prev) => [...prev, movedItem]);
    }
  }

  function reorderItems(list, newData) {
    const updated = newData.map((item, index) => ({
      ...item,
      position: index,
    }));

    if (list === "items") {
      setItems(updated);
    } else {
      setCompletedItems(updated);
    }

    updated.forEach((item) => {
      updateTaskPosition(item.id, item.position);
    });
  }

  function removeItem(id: number, completed: boolean) {
    deleteTask(id);

    if (completed) {
      setCompletedItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
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
        reorderItems,
        removeItem,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  return useContext(ItemsContext);
}
