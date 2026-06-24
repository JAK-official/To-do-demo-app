import React from "react";
import { render } from "@testing-library/react-native";

import TabLayout from "@/app/_layout";


jest.mock("@/components/app-tabs", () => {
  const { View } = require("react-native");

  return function AppTabs() {
    return <View testID="app-tabs" />;
  };
});


jest.mock("@/components/animated-icon", () => {
  const { View } = require("react-native");

  return {
    AnimatedSplashOverlay: () => (
      <View testID="splash-overlay" />
    ),
  };
});


jest.mock("@/context/itemsContext", () => {
  const { View } = require("react-native");

  return {
    ItemsProvider: ({ children }) => (
      <View testID="items-provider">
        {children}
      </View>
    ),
  };
});


jest.mock("@/database/migrations", () => ({
  migrate: jest.fn(),
}));


jest.mock("react-native-gesture-handler", () => {
  const { View } = require("react-native");

  return {
    GestureHandlerRootView: ({ children }) => (
      <View testID="gesture-root">
        {children}
      </View>
    ),
  };
});


jest.mock("expo-router", () => {
  const { View } = require("react-native");

  return {
    DarkTheme: {},
    DefaultTheme: {},

    ThemeProvider: ({ children }) => (
      <View testID="theme-provider">
        {children}
      </View>
    ),
  };
});


describe("TabLayout", () => {

  test("renders without crashing", async () => {
    const screen = await render(<TabLayout />);

    expect(screen.toJSON()).toBeTruthy();
  });


  test("renders gesture root", async () => {
    const screen = await render(<TabLayout />);

    expect(
      screen.getByTestId("gesture-root"),
    ).toBeTruthy();
  });


  test("renders app tabs", async () => {
    const screen = await render(<TabLayout />);

    expect(
      screen.getByTestId("app-tabs"),
    ).toBeTruthy();
  });


  test("runs database migration", async () => {
    const { migrate } = require("@/database/migrations");

    await render(<TabLayout />);

    expect(migrate).toHaveBeenCalled();
  });

});