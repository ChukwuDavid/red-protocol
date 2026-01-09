import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDays, differenceInDays } from "date-fns";

// 1. Define the shape of our data
interface CycleState {
  partnerName: string;
  lastPeriodDate: string | null; // We store dates as strings to avoid crashing JSON
  cycleLength: number;

  // Actions (The things we can do)
  setPartnerName: (name: string) => void;
  setCycleLength: (days: number) => void;
  logPeriodStart: (date: Date) => void;
  resetData: () => void;

  // The "Computed" values (The magic numbers)
  getDaysUntilNext: () => number;
  getCurrentPhase: () =>
    | "MENSTRUATION"
    | "FOLLICULAR"
    | "OVULATION"
    | "LUTEAL"
    | "UNKNOWN";
}

// 2. Create the store
export const useCycleStore = create<CycleState>()(
  persist(
    (set, get) => ({
      partnerName: "Partner",
      lastPeriodDate: null,
      cycleLength: 28,

      setPartnerName: (name) => set({ partnerName: name }),

      setCycleLength: (days) => set({ cycleLength: days }),

      logPeriodStart: (date) => set({ lastPeriodDate: date.toISOString() }),

      resetData: () => set({ lastPeriodDate: null, cycleLength: 28 }),

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

        if (daysPassed < 5) return "MENSTRUATION"; // Days 1-5
        if (daysPassed < 12) return "FOLLICULAR"; // Days 6-11
        if (daysPassed < 16) return "OVULATION"; // Days 12-16
        return "LUTEAL"; // Days 17-28 (The Danger Zone)
      },
    }),
    {
      name: "red-protocol-storage", // unique name for storage
      storage: createJSONStorage(() => AsyncStorage), // Use React Native's storage
    }
  )
);
