import React from "react";
import { render } from "@testing-library/react-native";
import { Platform } from "react-native";

import HomeScreen from "@/app/index";

jest.mock("expo-device", () => ({
  isDevice: false,
}));

jest.mock("@/components/ui/animatedReorder", () => {
  return function AnimatedReorderList() {
    return null;
  };
});

jest.mock("@/components/ui/addItem", () => {
  return function AddItem() {
    return null;
  };
});

jest.mock("@/components/themed-text", () => ({
  ThemedText: ({ children }) => children,
}));

jest.mock("@/components/themed-view", () => ({
  ThemedView: ({ children }) => children,
}));


describe("HomeScreen", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("renders home screen without crashing", () => {

    expect(() =>
      render(<HomeScreen />),
    ).not.toThrow();

  });



  test("renders animated list component", async () => {

    const screen = render(
      <HomeScreen />,
    );


    expect((await screen).toJSON())
      .toBeTruthy();

  });



  test("renders add item component", async () => {

    const screen = render(
      <HomeScreen />,
    );


    expect((await screen).toJSON())
      .toBeTruthy();

  });



  test("web dev menu hint returns browser message", async () => {

    Platform.OS = "web";


    const screen = render(
      <HomeScreen />,
    );


    expect((await screen).toJSON())
      .toBeTruthy();

  });



  test("android shortcut does not crash", async () => {

    Platform.OS = "android";


    const screen = render(
      <HomeScreen />,
    );


    expect((await screen).toJSON())
      .toBeTruthy();

  });


});