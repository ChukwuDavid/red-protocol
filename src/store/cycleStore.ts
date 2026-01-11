import { create } from "zustand";
import { format, addDays, differenceInDays } from "date-fns";

export interface InventoryItem {
  id: string;
  label: string;
  checked: boolean;
}

interface CycleState {
  // User Profile
  partnerName: string;
  lastPeriodDate: string | null;
  cycleLength: number;
  periodDuration: number;
  isOnboarded: boolean;
  isLoading: boolean;

  // Data
  history: Record<string, InventoryItem[]>;
  symptoms: Record<string, string[]>;

  // Actions
  setProfile: (data: Partial<CycleState>) => void;
  setSyncData: (history: any, symptoms: any) => void;
  setLoading: (loading: boolean) => void;

  // Logic Actions
  logPeriodStart: (date: Date) => void;
  toggleLogForDate: (date: Date, itemId: string) => void;
  toggleSymptom: (date: Date, symptom: string) => void;
  resetData: () => void;

  // Helpers
  getLogForDate: (date: Date) => InventoryItem[];
  getDaysUntilNext: () => number;
  getCurrentPhase: () =>
    | "MENSTRUATION"
    | "FOLLICULAR"
    | "OVULATION"
    | "LUTEAL"
    | "UNKNOWN";
}

// --- Defaults ---
const MENSTRUATION_ITEMS = [
  { id: "m1", label: "Comfort Rations (Chocolate)", checked: false },
  { id: "m2", label: "Pain Management", checked: false },
];
const FOLLICULAR_ITEMS = [
  { id: "f1", label: "Plan Active Date", checked: false },
];
const OVULATION_ITEMS = [
  { id: "o1", label: "Romantic Dinner", checked: false },
];
const LUTEAL_ITEMS = [
  { id: "l1", label: "Stock Cravings", checked: false },
  { id: "l2", label: "Patience Protocol", checked: false },
];
const DEFAULT_ITEMS = [{ id: "d1", label: "Check In", checked: false }];

const getPhaseForDate = (
  targetDate: Date,
  lastPeriodDate: string | null,
  cycleLength: number,
  periodDuration: number
) => {
  if (!lastPeriodDate) return "UNKNOWN";
  const lastStart = new Date(lastPeriodDate);
  const daysDiff = differenceInDays(targetDate, lastStart);
  const cycleDay =
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

export const useCycleStore = create<CycleState>((set, get) => ({
  partnerName: "Partner",
  lastPeriodDate: null,
  cycleLength: 28,
  periodDuration: 5,
  isOnboarded: false,
  isLoading: true,
  history: {},
  symptoms: {},

  setLoading: (isLoading) => set({ isLoading }),

  setProfile: (data) => set((state) => ({ ...state, ...data })),

  setSyncData: (history, symptoms) => set({ history, symptoms }),

  logPeriodStart: (date) => set({ lastPeriodDate: date.toISOString() }),

  toggleLogForDate: (date: Date, itemId: string) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const state = get();
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

    set({ history: { ...state.history, [dateKey]: updatedLog } });
  },

  toggleSymptom: (date: Date, symptom: string) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const state = get();
    const currentSymptoms = state.symptoms[dateKey] || [];
    const updatedSymptoms = currentSymptoms.includes(symptom)
      ? currentSymptoms.filter((s) => s !== symptom)
      : [...currentSymptoms, symptom];

    set({ symptoms: { ...state.symptoms, [dateKey]: updatedSymptoms } });
  },

  resetData: () =>
    set({
      lastPeriodDate: null,
      history: {},
      symptoms: {},
      isOnboarded: false,
    }),

  getLogForDate: (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const state = get();
    if (state.history[dateKey]) return state.history[dateKey];
    const phase = getPhaseForDate(
      date,
      state.lastPeriodDate,
      state.cycleLength,
      state.periodDuration
    );
    return getListForPhase(phase);
  },

  getDaysUntilNext: () => {
    const { lastPeriodDate, cycleLength } = get();
    if (!lastPeriodDate) return 0;
    const nextDate = addDays(new Date(lastPeriodDate), cycleLength);
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
}));
