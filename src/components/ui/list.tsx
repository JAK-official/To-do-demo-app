import { useState } from 'react';
import { Host, List, ListItem, Text } from '@expo/ui';

export default function CustomList({ items = [] }: { items?: any[] }) {
  const [selected, setSelected] = useState<string | null>(null);

   return (
    <Host style={{ flex: 1 }}>
      <List>
        {items.map((item: any) => (
          <ListItem
            key={item.id}
            onPress={() => setSelected(item.name)}
          >
            <Text style={{ color: 'white' }}>
              {item.name}
            </Text>
          </ListItem>
        ))}
      </List>
    </Host>
  );
}
