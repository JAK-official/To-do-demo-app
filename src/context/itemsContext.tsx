import { createContext, useContext, useState } from 'react';

const ItemsContext = createContext<any>(null);

export function ItemsProvider({ children }) {
  const [items, setItems] = useState([
  { id: 1, name: 'Avocado toast' },
  { id: 2, name: 'Bagel with cream cheese' },
  { id: 3, name: 'Cappuccino' },
]);
  const [completedItems, setCompletedItems] = useState([]);

  const moveItem = (id: number, completed: boolean) => {
  if (!completed) {
    const item = items.find(i => i.id === id);

    if (!item) return;

    setItems(prev => prev.filter(i => i.id !== id));
    setCompletedItems(prev => [...prev, item]);
  } else {
    const item = completedItems.find(i => i.id === id);

    if (!item) return;

    setCompletedItems(prev => prev.filter(i => i.id !== id));
    setItems(prev => [...prev, item]);
  }
};

  return (
    <ItemsContext.Provider
      value={{
        items,
        setItems,
        completedItems,
        setCompletedItems,
        moveItem,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  return useContext(ItemsContext);
}