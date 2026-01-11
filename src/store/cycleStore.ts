import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDays, differenceInDays, format } from "date-fns";

export interface InventoryItem {
  id: string;
  label: string;
  checked: boolean;
}

interface CycleState {
  partnerName: string;
  lastPeriodDate: string | null;
  cycleLength: number;
  periodDuration: number;

  history: Record<string, InventoryItem[]>;
  symptoms: Record<string, string[]>; // <--- NEW: Incident Log (Date -> ["Migraine", "Acne"])

  setPartnerName: (name: string) => void;
  setCycleLength: (days: number) => void;
  setPeriodDuration: (days: number) => void;
  logPeriodStart: (date: Date) => void;
  resetData: () => void;

  toggleLogForDate: (date: Date, itemId: string) => void;
  getLogForDate: (date: Date) => InventoryItem[];

  toggleSymptom: (date: Date, symptom: string) => void; // <--- NEW: Action

  getDaysUntilNext: () => number;
  getCurrentPhase: () =>
    | "MENSTRUATION"
    | "FOLLICULAR"
    | "OVULATION"
    | "LUTEAL"
    | "UNKNOWN";
}

// --- PHASE SPECIFIC CHECKLISTS ---
const MENSTRUATION_ITEMS = [
  { id: "m1", label: "Comfort Rations (Chocolate)", checked: false },
  { id: "m2", label: "Pain Management (Meds)", checked: false },
  { id: "m3", label: "Thermal Support (Heat Pad)", checked: false },
  { id: "m4", label: "Sanitary Supplies Restock", checked: false },
  { id: "m5", label: "Hydration Units", checked: false },
];

const FOLLICULAR_ITEMS = [
  { id: "f1", label: "Plan Active Date (Hiking/Gym)", checked: false },
  { id: "f2", label: "Social Event Planning", checked: false },
  { id: "f3", label: "Creative Support", checked: false },
  { id: "f4", label: "High Energy Outing", checked: false },
];

const OVULATION_ITEMS = [
  { id: "o1", label: "Romantic Dinner / Date Night", checked: false },
  { id: "o2", label: "High Confidence Compliments", checked: false },
  { id: "o3", label: "Spontaneous Activity", checked: false },
];

const LUTEAL_ITEMS = [
  { id: "l1", label: "Stock Cravings (Salty/Sweet)", checked: false },
  { id: "l2", label: "De-escalation Protocol (Patience)", checked: false },
  { id: "l3", label: "Low Stress Environment", checked: false },
  { id: "l4", label: "Offer Massage / Relaxation", checked: false },
  { id: "l5", label: "Active Listening Mode", checked: false },
];

const DEFAULT_ITEMS = [
  { id: "d1", label: "Log Cycle Start Date", checked: false },
  { id: "d2", label: "Check In With Partner", checked: false },
];

// --- HELPER: Calculate Phase for ANY date ---
const getPhaseForDate = (
  targetDate: Date,
  lastPeriodDate: string | null,
  cycleLength: number,
  periodDuration: number
) => {
  if (!lastPeriodDate) return "UNKNOWN";

  const lastStart = new Date(lastPeriodDate);
  const daysDiff = differenceInDays(targetDate, lastStart);

  let cycleDay =
    daysDiff >= 0
      ? daysDiff % cycleLength
      : (cycleLength + (daysDiff % cycleLength)) % cycleLength;

  if (cycleDay < periodDuration) return "MENSTRUATION";
  if (cycleDay < 12) return "FOLLICULAR";
  if (cycleDay < 16) return "OVULATION";
  return "LUTEAL";
};

const getListForPhase = (phase: string) => {
  switch (phase) {
    case "MENSTRUATION":
      return [...MENSTRUATION_ITEMS];
    case "FOLLICULAR":
      return [...FOLLICULAR_ITEMS];
    case "OVULATION":
      return [...OVULATION_ITEMS];
    case "LUTEAL":
      return [...LUTEAL_ITEMS];
    default:
      return [...DEFAULT_ITEMS];
  }
};

export const useCycleStore = create<CycleState>()(
  persist(
    (set, get) => ({
      partnerName: "Partner",
      lastPeriodDate: null,
      cycleLength: 28,
      periodDuration: 5,
      history: {},
      symptoms: {}, // <--- Initialize Empty

      setPartnerName: (name) => set({ partnerName: name }),
      setCycleLength: (days) => set({ cycleLength: days }),
      setPeriodDuration: (days) => set({ periodDuration: days }),
      logPeriodStart: (date) => set({ lastPeriodDate: date.toISOString() }),

      resetData: () =>
        set({
          lastPeriodDate: null,
          cycleLength: 28,
          periodDuration: 5,
          history: {},
          symptoms: {},
        }),

      getLogForDate: (date: Date) => {
        const dateKey = format(date, "yyyy-MM-dd");
        const { history, lastPeriodDate, cycleLength, periodDuration } = get();

        if (history[dateKey]) return history[dateKey];

        const phase = getPhaseForDate(
          date,
          lastPeriodDate,
          cycleLength,
          periodDuration
        );
        return getListForPhase(phase);
      },

      toggleLogForDate: (date: Date, itemId: string) =>
        set((state) => {
          const dateKey = format(date, "yyyy-MM-dd");
          let currentLog = state.history[dateKey];

          if (!currentLog) {
            const phase = getPhaseForDate(
              date,
              state.lastPeriodDate,
              state.cycleLength,
              state.periodDuration
            );
            currentLog = getListForPhase(phase);
          }

          const updatedLog = currentLog.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          );

          return {
            history: { ...state.history, [dateKey]: updatedLog },
          };
        }),

      // --- NEW: Toggle Incident Tags ---
      toggleSymptom: (date: Date, symptom: string) =>
        set((state) => {
          const dateKey = format(date, "yyyy-MM-dd");
          const currentSymptoms = state.symptoms[dateKey] || [];

          let updatedSymptoms;
          if (currentSymptoms.includes(symptom)) {
            updatedSymptoms = currentSymptoms.filter((s) => s !== symptom); // Remove
          } else {
            updatedSymptoms = [...currentSymptoms, symptom]; // Add
          }

          return {
            symptoms: { ...state.symptoms, [dateKey]: updatedSymptoms },
          };
        }),

      getDaysUntilNext: () => {
        const { lastPeriodDate, cycleLength } = get();
        if (!lastPeriodDate) return 0;
        const lastDate = new Date(lastPeriodDate);
        const nextDate = addDays(lastDate, cycleLength);
        return differenceInDays(nextDate, new Date());
      },

      getCurrentPhase: () => {
        const { lastPeriodDate, periodDuration, cycleLength } = get();
        return getPhaseForDate(
          new Date(),
          lastPeriodDate,
          cycleLength,
          periodDuration
        ) as any;
      },
    }),
    {
      name: "red-protocol-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
