import { create } from 'zustand';

// Створення магазину
const useBooleanStore = create((set) => ({
  isSynced: false, // Початковий стан для булевого значення
  setIsSynced: (newState: boolean) => set({ isSynced: newState }), // Функція для оновлення булевого значення
}));

export default useBooleanStore;