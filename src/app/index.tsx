import * as Device from "expo-device";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ListExample from "@/components/ui/list";
import { List } from "@expo/ui";
import CustomList from "@/components/ui/list";
import AddItem from "@/components/ui/addItem";
import { useState } from "react";
import ReorderList from "@/components/ui/animatedReorder";
import AnimatedReorderList from "@/components/ui/animatedReorder";

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const [listItems, setListItems] = useState([
    { id: 1, name: "Avocado toast" },
    { id: 2, name: "Bagel with cream cheese" },
    { id: 3, name: "Cappuccino" },
  ]);

  function addItem(text: any) {
    const newItem = {
      id: Date.now(),
      name: text,
    };

    setListItems((prev) => [...prev, newItem]);
  }

  return (
    <View style={styles.container}>
      <AnimatedReorderList />

      <View style={styles.addButton}>
        <AddItem />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    backgroundColor: "black",
  },

  addButton: {
    position: "absolute",
    right: 25,
    bottom: 40,
  },
});
