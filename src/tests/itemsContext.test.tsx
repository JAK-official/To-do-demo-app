import React from "react";
import { render, act, waitFor } from "@testing-library/react-native";

import { ItemsProvider, useItems } from "@/context/itemsContext";

import {
  getTasks,
  insertTask,
  updateTaskCompleted,
  updateTaskPosition,
  deleteTask,
} from "@/database/taskRepository";


jest.mock("@/database/taskRepository", () => ({
  getTasks: jest.fn(),
  insertTask: jest.fn(),
  updateTaskCompleted: jest.fn(),
  updateTaskPosition: jest.fn(),
  deleteTask: jest.fn(),
}));


const mockedGetTasks = getTasks as jest.MockedFunction<typeof getTasks>;
const mockedInsertTask = insertTask as jest.MockedFunction<typeof insertTask>;
const mockedUpdateCompleted =
  updateTaskCompleted as jest.MockedFunction<typeof updateTaskCompleted>;
const mockedUpdatePosition =
  updateTaskPosition as jest.MockedFunction<typeof updateTaskPosition>;
const mockedDeleteTask =
  deleteTask as jest.MockedFunction<typeof deleteTask>;


function TestConsumer({ onRender }) {
  const context = useItems();

  onRender(context);

  return null;
}


async function renderProvider() {
  let context;

  await act(async () => {
    render(
      <ItemsProvider>
        <TestConsumer
          onRender={(value) => {
            context = value;
          }}
        />
      </ItemsProvider>,
    );
  });

  return () => context;
}


describe("ItemsProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, "log")
      .mockImplementation(() => {});

    mockedGetTasks.mockReturnValue([]);
  });


  test("loads and separates active and completed tasks", async () => {
    mockedGetTasks.mockReturnValue([
      {
        id: 1,
        title: "Active",
        completed: 0,
        position: 0,
        created_at: "",
      },
      {
        id: 2,
        title: "Done",
        completed: 1,
        position: 1,
        created_at: "",
      },
    ]);


    const getContext = await renderProvider();


    await waitFor(() => {
      expect(getContext().items).toEqual([
        {
          id: 1,
          name: "Active",
          position: 0,
        },
      ]);
    });


    expect(getContext().completedItems).toEqual([
      {
        id: 2,
        name: "Done",
        position: 1,
      },
    ]);
  });



  test("adds item", async () => {
    mockedInsertTask.mockReturnValue({
      id: 10,
    });

    mockedGetTasks.mockReturnValue([]);


    const getContext = await renderProvider();


    await act(async () => {
      getContext().addItem("Task");
    });


    await waitFor(() => {
      expect(getContext().items).toContainEqual({
        id: 10,
        name: "Task",
        position: 0,
      });
    });


    expect(mockedInsertTask)
      .toHaveBeenCalledWith("Task");
  });



  test("moves item to completed", async () => {
    mockedGetTasks.mockReturnValue([
      {
        id: 1,
        title: "Task",
        completed: 0,
        position: 0,
        created_at: "",
      },
    ]);


    const getContext = await renderProvider();


    await waitFor(() => {
      expect(getContext().items.length).toBe(1);
    });


    await act(async () => {
      getContext().moveItem(1, false);
    });


    await waitFor(() => {
      expect(getContext().items).toEqual([]);
    });


    expect(getContext().completedItems).toEqual([
      {
        id: 1,
        name: "Task",
        position: 0,
      },
    ]);


    expect(mockedUpdateCompleted)
      .toHaveBeenCalledWith(1, 1);
  });



  test("reorders items", async () => {
    const getContext = await renderProvider();


    await act(async () => {
      getContext().reorderItems(
      "items",
      [
        {
          id: 2,
          name: "B",
          position: 0,
        },
        {
          id: 1,
          name: "A",
          position: 1,
        },
      ],
      );
    });


    await waitFor(() => {
      expect(getContext().items).toEqual([
        {
          id: 2,
          name: "B",
          position: 0,
        },
        {
          id: 1,
          name: "A",
          position: 1,
        },
      ]);
    });


    expect(mockedUpdatePosition)
      .toHaveBeenCalledWith(2, 0);
  });



  test("removes item", async () => {
    mockedGetTasks.mockReturnValue([
      {
        id: 1,
        title: "Delete",
        completed: 0,
        position: 0,
        created_at: "",
      },
    ]);


    const getContext = await renderProvider();


    await waitFor(() => {
      expect(getContext().items.length).toBe(1);
    });


    await act(async () => {
      getContext().removeItem(1, false);
    });


    await waitFor(() => {
      expect(getContext().items).toEqual([]);
    });


    expect(mockedDeleteTask)
      .toHaveBeenCalledWith(1);
  });
});