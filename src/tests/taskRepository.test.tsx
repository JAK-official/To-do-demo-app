import { render, act, waitFor } from "@testing-library/react-native";
import { useEffect } from "react";
import { ItemsProvider, useItems } from "@/context/itemsContext";

import {
  getTasks,
  insertTask,
  deleteTask,
  updateTaskPosition,
} from "@/database/taskRepository";

jest.mock("@/database/taskRepository", () => ({
  getTasks: jest.fn(),
  insertTask: jest.fn(),
  updateTaskCompleted: jest.fn(),
  updateTaskPosition: jest.fn(),
  deleteTask: jest.fn(),
}));

const mockedGetTasks = getTasks as jest.Mock;
const mockedInsertTask = insertTask as jest.Mock;
const mockedDeleteTask = deleteTask as jest.Mock;
const mockedUpdatePosition = updateTaskPosition as jest.Mock;

async function renderItemsContext() {
  const resultRef = { current: null as any };

  function HookConsumer() {
    const value = useItems();

    useEffect(() => {
      resultRef.current = value;
    }, [value]);

    return null;
  }

  await act(async () => {
    render(
      <ItemsProvider>
        <HookConsumer />
      </ItemsProvider>,
    );
  });

  await waitFor(() => {
    expect(resultRef.current).not.toBeNull();
  });

  return resultRef;
}

describe("ItemsContext", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    mockedGetTasks.mockResolvedValue([
      {
        id: 1,
        title: "Active",
        completed: 0,
        position: 0,
      },
      {
        id: 2,
        title: "Done",
        completed: 1,
        position: 0,
      },
    ]);
  });


  test("loads tasks into active and completed", async () => {
    const result = await renderItemsContext();

    await waitFor(() => {
      expect(result.current?.items).toEqual([
        {
          id: 1,
          name: "Active",
          position: 0,
        },
      ]);
    });

    expect(result.current.completedItems).toEqual([
      {
        id: 2,
        name: "Done",
        position: 0,
      },
    ]);
  });



  test("adds item", async () => {

    mockedInsertTask.mockReturnValue({
      id: 3,
    });


    const result = await renderItemsContext();


    await waitFor(() => {
      expect(result.current?.items.length).toBe(1);
    });


    await act(async () => {
      result.current.addItem("Milk");
    });


    await waitFor(() => {
      expect(result.current.items).toContainEqual({
        id: 3,
        name: "Milk",
        position: 1,
      });
    });
  });



  test("removes item", async () => {

    const result = await renderItemsContext();


    await waitFor(() => {
      expect(result.current?.items.length).toBe(1);
    });


    await act(async () => {
      result.current.removeItem(1, false);
    });


    expect(mockedDeleteTask).toHaveBeenCalledWith(1);

    await waitFor(() => {
      expect(result.current.items).toHaveLength(0);
    });
  });



  test("reorders items", async () => {

    const result = await renderItemsContext();


    await waitFor(() => {
      expect(result.current?.items.length).toBe(1);
    });


    await act(async () => {
      result.current.reorderItems(
        "items",
        [
          {
            id: 1,
            name: "Active",
            position: 0,
          },
        ],
      );
    });


    expect(mockedUpdatePosition)
      .toHaveBeenCalledWith(1, 0);

  });

});