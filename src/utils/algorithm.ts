import { addDays, differenceInDays } from "date-fns";

export const getTacticalStatus = (
  lastPeriodDate: Date,
  cycleLength: number = 28
) => {
  const today = new Date();
  const nextPeriod = addDays(lastPeriodDate, cycleLength);
  const daysUntil = differenceInDays(nextPeriod, today);
  const currentDay = differenceInDays(today, lastPeriodDate);

  if (currentDay < 7)
    return {
      status: "GREEN",
      message: "Clear Skies. High Energy.",
      code: "RECOVERY",
    };
  if (currentDay >= 7 && currentDay < 14)
    return {
      status: "PURPLE",
      message: "Peak Performance.",
      code: "OVULATION",
    };
  if (currentDay >= 14 && currentDay < 21)
    return {
      status: "YELLOW",
      message: "Clouds Forming. Patience Required.",
      code: "LUTEAL_EARLY",
    };
  if (daysUntil <= 3)
    return {
      status: "RED",
      message: "Storm Warning. Initiate Protocol.",
      code: "PMS_ALERT",
    };

  return { status: "GRAY", message: "Recalculating...", code: "UNKNOWN" };
};
