import React from "react";
import { render } from "@testing-library/react-native";

import TabTwoScreen from "@/app/explore";

import { View, Text } from "react-native";

jest.mock("@/components/ui/animatedReorder", () => {
  const { View } = require("react-native");

  return function AnimatedReorderList(props) {
    return <View testID="animated-list" data={JSON.stringify(props)} />;
  };
});

test("renders completed animated list", async () => {
  const screen = await render(<TabTwoScreen />);

  const list = screen.getByTestId("animated-list");

  expect(list.props.data).toContain(
    '"completed":true',
  );
});

jest.mock("@/components/ui/addItem", () => {
  return function AddItem() {
    return <mock-add-item testID="add-item" />;
  };
});

jest.mock("@/hooks/use-theme", () => ({
  useTheme: jest.fn(() => ({
    background: "black",
    text: "white",
  })),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 10,
    bottom: 20,
    left: 0,
    right: 0,
  })),
}));

describe("Explore Screen", () => {
  test("renders without crashing", () => {
    expect(() => render(<TabTwoScreen />)).not.toThrow();
  });

  test("renders completed animated list", async () => {
    const screen = await render(<TabTwoScreen />);

    const list = screen.getByTestId("animated-list");

    expect(list).toBeTruthy();
    expect(list.props.data).toContain('"completed":true');
  });

  test("renders add button component", async () => {
    const screen = await render(<TabTwoScreen />);

    expect(screen.getByTestId("add-item")).toBeTruthy();
  });

  test("uses safe area insets", async () => {
    const screen = await render(<TabTwoScreen />);

    expect(screen.toJSON()).toBeTruthy();
  });
});
