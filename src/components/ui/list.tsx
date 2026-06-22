import { useState } from "react";
import { Host, List, ListItem, Checkbox } from "@expo/ui";
import { useItems } from "../../context/itemsContext";

export default function CustomList({
  completed = false,
}: {
  completed?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const { items, completedItems, moveItem } = useItems();

  const data = completed ? completedItems : items;

  return (
    <Host style={{ flex: 1 }}>
      <List>
        {data.map((item: any) => (
          <ListItem key={item.id}>
            <Checkbox
              label={item.name}
              value={completed}
              onValueChange={() => moveItem(item.id, completed)}
            />
          </ListItem>
        ))}
      </List>
    </Host>
  );
}
