import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDays, differenceInDays } from "date-fns";

// --- NEW: Define what an inventory item looks like ---
export interface InventoryItem {
  id: string;
  label: string;
  checked: boolean;
}

// 1. Define the shape of our data
interface CycleState {
  partnerName: string;
  lastPeriodDate: string | null;
  cycleLength: number;
  inventory: InventoryItem[]; // <--- NEW: The Supply List

  // Actions
  setPartnerName: (name: string) => void;
  setCycleLength: (days: number) => void;
  logPeriodStart: (date: Date) => void;
  resetData: () => void;
  toggleInventory: (id: string) => void; // <--- NEW: Action to check boxes

  // Computed
  getDaysUntilNext: () => number;
  getCurrentPhase: () =>
    | "MENSTRUATION"
    | "FOLLICULAR"
    | "OVULATION"
    | "LUTEAL"
    | "UNKNOWN";
}

const DEFAULT_INVENTORY = [
  { id: "1", label: "Comfort Rations (Chocolate)", checked: false },
  { id: "2", label: "Pain Management (Meds)", checked: false },
  { id: "3", label: "Thermal Support (Heat Pad)", checked: false },
  { id: "4", label: "Sanitary Supplies", checked: false },
  { id: "5", label: "Hydration Units", checked: false },
];

// 2. Create the store
export const useCycleStore = create<CycleState>()(
  persist(
    (set, get) => ({
      partnerName: "Partner",
      lastPeriodDate: null,
      cycleLength: 28,
      inventory: DEFAULT_INVENTORY, // <--- NEW: Initialize list

      setPartnerName: (name) => set({ partnerName: name }),

      setCycleLength: (days) => set({ cycleLength: days }),

      logPeriodStart: (date) => set({ lastPeriodDate: date.toISOString() }),

      // --- NEW: Toggle Logic ---
      toggleInventory: (id) =>
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),

      resetData: () =>
        set({
          lastPeriodDate: null,
          cycleLength: 28,
          inventory: DEFAULT_INVENTORY,
        }),

      getDaysUntilNext: () => {
        const { lastPeriodDate, cycleLength } = get();
        if (!lastPeriodDate) return 0;

        const lastDate = new Date(lastPeriodDate);
        const nextDate = addDays(lastDate, cycleLength);
        const today = new Date();

        return differenceInDays(nextDate, today);
      },

      getCurrentPhase: () => {
        const { lastPeriodDate } = get();
        if (!lastPeriodDate) return "UNKNOWN";

        const daysPassed = differenceInDays(
          new Date(),
          new Date(lastPeriodDate)
        );

        if (daysPassed < 5) return "MENSTRUATION";
        if (daysPassed < 12) return "FOLLICULAR";
        if (daysPassed < 16) return "OVULATION";
        return "LUTEAL";
      },
    }),
    {
      name: "red-protocol-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
