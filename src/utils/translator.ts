import { differenceInDays } from "date-fns";

export type TacticalStatus = {
  phase: string;
  weather: string;
  message: string;
  actionItem: string;
  color: string;
  icon: string;
};

export const getTacticalIntel = (
  lastPeriodDate: string | null,
  cycleLength: number,
  periodDuration: number = 5 // New parameter
): TacticalStatus => {
  if (!lastPeriodDate) {
    return {
      phase: "NO DATA",
      weather: "Offline",
      message: "System waiting for synchronization.",
      actionItem: "Tap a date on the calendar to log Start Date.",
      color: "#8E8E93",
      icon: "question",
    };
  }

  const today = new Date();
  const lastDate = new Date(lastPeriodDate);
  const daysPassed = differenceInDays(today, lastDate);

  if (daysPassed > 45) {
    return {
      phase: "OVERDUE",
      weather: "Data Stale",
      message: "Cycle input required. Predictions paused.",
      actionItem: "Update log manually below.",
      color: "#8E8E93",
      icon: "alert-circle",
    };
  }

  // PHASE 1: MENSTRUATION (Dynamic Duration)
  if (daysPassed >= 0 && daysPassed < periodDuration) {
    return {
      phase: "MENSTRUATION",
      weather: "Thunderstorms",
      message: "Energy levels critical. Maintenance mode active.",
      actionItem: "Provide comfort items (Chocolate, Heat).",
      color: "#FF453A", // Red
      icon: "cloud-rain",
    };
  }

  // PHASE 2: FOLLICULAR
  if (daysPassed >= periodDuration && daysPassed <= 11) {
    return {
      phase: "FOLLICULAR",
      weather: "Clear Skies",
      message: "Energy rising. Mood optimal.",
      actionItem: "Great time for date nights or heavy lifting.",
      color: "#32D74B", // Green
      icon: "sun",
    };
  }

  // PHASE 3: OVULATION
  if (daysPassed > 11 && daysPassed <= 16) {
    return {
      phase: "OVULATION",
      weather: "Heatwave",
      message: "Peak estrogen. High energy & confidence.",
      actionItem: "Social events are highly recommended.",
      color: "#BF5AF2", // Purple
      icon: "zap",
    };
  }

  // PHASE 4: LUTEAL
  return {
    phase: "LUTEAL",
    weather: "Overcast / Storm Watch",
    message: "Progesterone rising. Patience buffer required.",
    actionItem: "Avoid controversial topics. Stock inventory.",
    color: "#FFD60A", // Yellow
    icon: "wind",
  };
};
