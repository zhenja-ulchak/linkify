import {create} from 'zustand';

// Створення магазину
const useStringStore = create((set) => ({
  text: '', // Початковий стан для рядка
  setText: (newText: string) => set({ text: newText }), // Функція для оновлення тексту
}));

export default useStringStore;