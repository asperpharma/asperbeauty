/**
 * [StoreName] Zustand Store
 * 
 * @description Brief description of what this store manages
 * @example
 * ```tsx
 * const { items, addItem, removeItem } = useStoreNameStore();
 * ```
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Item type managed by the store
 */
export interface StoreItem {
  id: string;
  name: string;
  // Add more fields as needed
}

/**
 * Store state interface
 */
interface StoreNameState {
  // State
  items: StoreItem[];
  isOpen: boolean;
  selectedItem: StoreItem | null;
  
  // Actions
  addItem: (item: StoreItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<StoreItem>) => void;
  clearItems: () => void;
  setOpen: (open: boolean) => void;
  selectItem: (item: StoreItem | null) => void;
  
  // Computed/Helper methods
  getItemById: (itemId: string) => StoreItem | undefined;
  getTotalCount: () => number;
  hasItems: () => boolean;
}

/**
 * Create the store with persist middleware
 */
export const useStoreNameStore = create<StoreNameState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      selectedItem: null,

      // Add item
      addItem: (item: StoreItem) => {
        set((state) => {
          // Check if item already exists
          const exists = state.items.find(i => i.id === item.id);
          
          if (exists) {
            // Update existing item or show message
            return state;
          }
          
          return {
            items: [...state.items, item]
          };
        });
      },

      // Remove item
      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
      },

      // Update item
      updateItem: (itemId: string, updates: Partial<StoreItem>) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )
        }));
      },

      // Clear all items
      clearItems: () => {
        set({ items: [], selectedItem: null });
      },

      // Set open state
      setOpen: (open: boolean) => {
        set({ isOpen: open });
      },

      // Select item
      selectItem: (item: StoreItem | null) => {
        set({ selectedItem: item });
      },

      // Get item by ID
      getItemById: (itemId: string) => {
        return get().items.find(item => item.id === itemId);
      },

      // Get total count
      getTotalCount: () => {
        return get().items.length;
      },

      // Check if has items
      hasItems: () => {
        return get().items.length > 0;
      },
    }),
    {
      name: 'store-name-storage', // Name for localStorage key
      // Optional: Specify which parts of state to persist
      partialize: (state) => ({
        items: state.items,
        // Don't persist isOpen or selectedItem
      }),
    }
  )
);

// Example usage in components:
// const { items, addItem, removeItem, isOpen, setOpen } = useStoreNameStore();
// 
// // Add item
// addItem({ id: '1', name: 'Item 1' });
// 
// // Remove item
// removeItem('1');
// 
// // Get total count
// const itemCount = useStoreNameStore(state => state.getTotalCount());
// 
// // Open/close
// setOpen(true);
