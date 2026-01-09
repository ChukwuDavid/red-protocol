import { differenceInDays, addDays } from "date-fns";

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
  cycleLength: number
): TacticalStatus => {
  if (!lastPeriodDate) {
    return {
      phase: "NO DATA",
      weather: "Offline",
      message: "System waiting for initial input.",
      actionItem: "Tap the button to log Start Date.",
      color: "#8E8E93",
      icon: "question",
    };
  }

  const today = new Date();
  const lastDate = new Date(lastPeriodDate);
  const daysPassed = differenceInDays(today, lastDate);

  // SANITY CHECK: If it's been 40+ days, we missed a log.
  if (daysPassed > 40) {
    return {
      phase: "OVERDUE",
      weather: "Data Stale",
      message: "Cycle is longer than expected.",
      actionItem: "Check in with partner or update log.",
      color: "#8E8E93",
      icon: "alert-circle",
    };
  }

  // PHASE 1: MENSTRUATION (Days 0-5)
  if (daysPassed >= 0 && daysPassed <= 5) {
    return {
      phase: "MENSTRUATION",
      weather: "Thunderstorms",
      message: "Energy levels critical. Maintenance mode active.",
      actionItem: "Provide comfort items (Chocolate, Heat).",
      color: "#FF453A", // Red
      icon: "cloud-rain",
    };
  }

  // PHASE 2: FOLLICULAR (Days 6-11)
  if (daysPassed > 5 && daysPassed <= 11) {
    return {
      phase: "FOLLICULAR",
      weather: "Clear Skies",
      message: "Energy rising. Mood optimal.",
      actionItem: "Great time for date nights or heavy lifting.",
      color: "#32D74B", // Green
      icon: "sun",
    };
  }

  // PHASE 3: OVULATION (Days 12-16)
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

  // PHASE 4: LUTEAL (Days 17-End)
  // This is the danger zone.
  return {
    phase: "LUTEAL",
    weather: "Overcast / Storm Watch",
    message: "Progesterone rising. Patience buffer required.",
    actionItem: "Avoid controversial topics. Stock inventory.",
    color: "#FFD60A", // Yellow
    icon: "wind",
  };
};
