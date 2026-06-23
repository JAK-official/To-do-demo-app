import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { useAnimatedProps } from "react-native-reanimated";

import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { MaterialIcons } from "@expo/vector-icons";

import { Text, Pressable, StyleSheet } from "react-native";

import Checkbox from "expo-checkbox";

import { useItems } from "../../context/itemsContext";

function SwipeRow({
  children,
  onDelete,
  isActive,
}: {
  children: React.ReactNode;
  onDelete: () => void;
  isActive: boolean;
}) {
  const translateX = useSharedValue(0);

  const MAX_TRANSLATE = -140;

  const swipeGesture = Gesture.Pan()
    .enabled(!isActive)
    .activeOffsetX([-5, 5])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      translateX.value = Math.max(
        MAX_TRANSLATE,
        Math.min(0, e.translationX * 0.7),
      );
    })
    .onEnd((e) => {
      const shouldOpen = translateX.value < -70 || e.velocityX < -500;

      translateX.value = withSpring(shouldOpen ? MAX_TRANSLATE : 0, {
        damping: 22,
        stiffness: 100,
        mass: 0.8,
      });
    });

  const deleteAnimatedProps = useAnimatedProps(() => ({
    pointerEvents: translateX.value < -5 ? "auto" : "none",
  }));

  const deleteStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -5 ? 1 : 0,
    transform: [
      {
        scale: translateX.value < -5 ? 1 : 0.8,
      },
    ],
  }));

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  return (
    <Animated.View style={styles.container}>
      <Animated.View
        style={[styles.deleteContainer, deleteStyle]}
        animatedProps={deleteAnimatedProps}
      >
        <Pressable style={styles.delete} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </Animated.View>

      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={style}>{children}</Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

export default function AnimatedReorderList({
  completed = false,
}: {
  completed?: boolean;
}) {
  const { items, completedItems, moveItem, reorderItems, removeItem } =
    useItems();

  const data = completed ? completedItems : items;

  return (
    <DraggableFlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      onDragEnd={({ data }) => {
        reorderItems(completed ? "completedItems" : "items", data);
      }}
      renderItem={({ item, drag, isActive }) => (
        <ScaleDecorator>
          <Animated.View entering={FadeIn}>
            <SwipeRow
              isActive={isActive}
              onDelete={() => removeItem(item.id, completed)}
            >
              <Pressable
                onLongPress={drag}
                style={[
                  styles.row,
                  {
                    opacity: isActive ? 0.6 : 1,
                  },
                ]}
              >
                <Checkbox
                  style={styles.checkbox}
                  value={completed}
                  onValueChange={() => moveItem(item.id, completed)}
                />

                <Text style={styles.text}>{item.name}</Text>

                <MaterialIcons name="drag-handle" size={28} color="white" />
              </Pressable>
            </SwipeRow>
          </Animated.View>
        </ScaleDecorator>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },

  content: {
    width: "100%",
    paddingHorizontal: 10,
  },

  row: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingVertical: 16,

    marginVertical: 4,

    backgroundColor: "#222",
    borderRadius: 10,
  },

  checkbox: {
    marginRight: 12,
  },

  text: {
    color: "#fff",

    flex: 1,

    fontSize: 16,
  },
  delete: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 10,
    marginVertical: 4,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  deleteText: {
    color: "white",
    fontWeight: "700",
  },
  container: {
    width: "100%",
    position: "relative",
  },
  deleteContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 140,
  },
});
