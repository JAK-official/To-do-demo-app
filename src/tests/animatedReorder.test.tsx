import React from "react";

import { render, fireEvent } from "@testing-library/react-native/pure";

import AnimatedReorderList from "@/components/ui/animatedReorder";
import { useItems } from "@/context/itemsContext";

jest.mock("@/context/itemsContext", () => ({
  useItems: jest.fn(),
}));

jest.mock("react-native-draggable-flatlist", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    __esModule: true,

    default: ({ data, renderItem }: any) => (
      <View testID="draggable-list">
        {data.map((item: any) => (
          <React.Fragment key={item.id}>
            {renderItem({
              item,
              drag: jest.fn(),
              isActive: false,
            })}
          </React.Fragment>
        ))}
      </View>
    ),

    ScaleDecorator: ({ children }: any) => children,
  };
});

jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const { View } = require("react-native");

  const AnimatedView = React.forwardRef(
    ({ children, ...props }: any, ref: any) => (
      <View ref={ref} {...props}>
        {children}
      </View>
    ),
  );

  return {
    __esModule: true,

    default: {
      View: AnimatedView,
    },

    View: AnimatedView,

    FadeIn: {},

    useSharedValue: () => ({
      value: 0,
    }),

    useAnimatedStyle: () => ({}),

    useAnimatedProps: () => ({}),

    withSpring: (value: any) => value,
  };
});

jest.mock("react-native-gesture-handler", () => ({
  GestureDetector: ({ children }: any) => children,

  Gesture: {
    Pan: () => ({
      enabled: () => ({
        activeOffsetX: () => ({
          failOffsetY: () => ({
            onUpdate: () => ({
              onEnd: jest.fn(),
            }),
          }),
        }),
      }),
    }),
  },
}));

jest.mock("expo-checkbox", () => {
  const { Pressable } = require("react-native");

  return ({ onValueChange }: any) => (
    <Pressable testID="checkbox" onPress={onValueChange} />
  );
});

jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: () => null,
}));

describe("AnimatedReorderList", () => {
  const moveItem = jest.fn();
  const removeItem = jest.fn();
  const reorderItems = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useItems as jest.Mock).mockReturnValue({
      items: [
        {
          id: 1,
          name: "Active Task",
        },
      ],

      completedItems: [
        {
          id: 2,
          name: "Completed Task",
        },
      ],

      moveItem,
      removeItem,
      reorderItems,
    });
  });

  test("renders active items", async () => {
    const result = await render(<AnimatedReorderList />);

    expect(result.getByText("Active Task")).toBeTruthy();
  });

  test("renders completed items", async () => {
    const result = await render(<AnimatedReorderList completed />);

    expect(result.getByText("Completed Task")).toBeTruthy();
  });

  test("renders draggable list", async () => {
    const result = await render(<AnimatedReorderList />);

    expect(result.getByTestId("draggable-list")).toBeTruthy();
  });

  test("moves item when checkbox pressed", async () => {
    const result = await render(<AnimatedReorderList />);

    fireEvent.press(result.getByTestId("checkbox"));

    expect(moveItem).toHaveBeenCalledWith(1, false);
  });
});
