import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

import AddItem from "@/components/ui/addItem";
import { useItems } from "@/context/itemsContext";

jest.mock("@/context/itemsContext", () => ({
  useItems: jest.fn(),
}));

jest.mock("@expo/ui", () => {
  const React = require("react");
  const { Pressable, Text, View } = require("react-native");

  return {
    __esModule: true,
    Host: ({ children }: any) => <View>{children}</View>,
    Button: ({ label, onPress }: any) => (
      <Pressable onPress={onPress}>
        <Text>{label}</Text>
      </Pressable>
    ),
  };
});

const mockedUseItems = useItems as jest.Mock;
const mockedAddItem = jest.fn();

describe("AddItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseItems.mockReturnValue({
      addItem: mockedAddItem,
    });
  });

  test("renders", async () => {
    const result = await render(<AddItem />);
    expect(result).toBeTruthy();
  });

  test("opens modal when + button is pressed", async () => {
    const result = await render(<AddItem />);

    await fireEvent.press(result.getByText("+"));

    expect(
      await result.findByPlaceholderText("Write something...")
    ).toBeTruthy();
  });

  test("adds a note and closes modal", async () => {
    const result = await render(<AddItem />);

    await fireEvent.press(result.getByText("+"));

    const input = await result.findByPlaceholderText("Write something...");
    await fireEvent.changeText(input, "Milk");
    await fireEvent.press(result.getByText("Add"));

    expect(mockedAddItem).toHaveBeenCalledWith("Milk");

    await waitFor(() => {
      expect(
        result.queryByPlaceholderText("Write something...")
      ).toBeNull();
    });
  });

  test("does not add empty note", async () => {
    const result = await render(<AddItem />);

    await fireEvent.press(result.getByText("+"));

    const input = await result.findByPlaceholderText("Write something...");
    await fireEvent.changeText(input, "   ");
    await fireEvent.press(result.getByText("Add"));

    expect(mockedAddItem).not.toHaveBeenCalled();
  });

  test("closes modal when cancel is pressed", async () => {
    const result = await render(<AddItem />);

    await fireEvent.press(result.getByText("+"));

    expect(
      await result.findByPlaceholderText("Write something...")
    ).toBeTruthy();

    await fireEvent.press(result.getByText("Cancel"));

    await waitFor(() => {
      expect(
        result.queryByPlaceholderText("Write something...")
      ).toBeNull();
    });
  });

  test("clears the input after successful add", async () => {
    const result = await render(<AddItem />);

    await fireEvent.press(result.getByText("+"));

    const input = await result.findByPlaceholderText("Write something...");
    await fireEvent.changeText(input, "Milk");
    await fireEvent.press(result.getByText("Add"));

    await fireEvent.press(result.getByText("+"));

    const reopenedInput = await result.findByPlaceholderText(
      "Write something..."
    );

    expect(reopenedInput.props.value).toBe("");
  });
});