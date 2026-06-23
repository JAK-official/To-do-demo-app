import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import Animated, {
  FadeIn,
} from "react-native-reanimated";

import { MaterialIcons } from "@expo/vector-icons";

import {
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import Checkbox from "expo-checkbox";

import { useItems } from "../../context/itemsContext";


export default function AnimatedReorderList({
  completed = false,
}: {
  completed?: boolean;
}) {
  const {
    items,
    completedItems,
    moveItem,
    reorderItems,
  } = useItems();


  const data = completed
    ? completedItems
    : items;


  return (
    <DraggableFlatList
      style={styles.list}
      contentContainerStyle={styles.content}

      data={data}

      keyExtractor={(item) =>
        item.id.toString()
      }

      onDragEnd={({ data }) => {
        reorderItems(
          completed
            ? "completedItems"
            : "items",
          data
        );
      }}

      renderItem={({
        item,
        drag,
        isActive,
      }) => (

        <ScaleDecorator>

          <Animated.View
            entering={FadeIn}
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

                onValueChange={() =>
                  moveItem(
                    item.id,
                    completed
                  )
                }
              />


              <Text style={styles.text}>
                {item.name}
              </Text>


              <MaterialIcons
                name="drag-handle"
                size={28}
                color="white"
              />

            </Pressable>

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

});