import { addDays, differenceInDays, format } from "date-fns";

// Common incidents to track
export const AVAILABLE_INCIDENTS = [
  "Migraine",
  "Cramps",
  "Back Pain",
  "Cravings (Sweet)",
  "Cravings (Salty)",
  "Mood Swing",
  "Fatigue",
  "Insomnia",
  "Acne / Breakout",
  "Bloating",
  "High Anxiety",
  "Nausea",
];

// --- FIX: Added 'export' here so other files can use this type ---
export interface RadarPrediction {
  date: Date;
  daysFromNow: number;
  incidents: string[];
}

export const getRadarPredictions = (
  lastPeriodDate: string | null,
  cycleLength: number,
  symptomsHistory: Record<string, string[]>
): RadarPrediction[] => {
  if (!lastPeriodDate) return [];

  const predictions: RadarPrediction[] = [];
  const today = new Date();
  const lastStart = new Date(lastPeriodDate);

  // Look ahead 5 days
  for (let i = 1; i <= 5; i++) {
    const targetDate = addDays(today, i);

    // 1. Calculate the "Cycle Day" for this future target date
    const daysSinceStart = differenceInDays(targetDate, lastStart);
    // Use modulo to find position in generic cycle (1 to 28)
    const cycleDay =
      ((daysSinceStart % cycleLength) + cycleLength) % cycleLength;

    // 2. Look back at previous 3 cycles to see what happened on this same "Cycle Day"
    const detectedIncidents = new Set<string>();

    // Check last 3 hypothetical cycles
    for (let c = 1; c <= 3; c++) {
      // Calculate the date of this cycle day in previous months
      // Formula: lastPeriodDate - (c * cycleLength) + cycleDay
      const pastCycleStart = addDays(lastStart, -(c * cycleLength));
      const pastDateToCheck = addDays(pastCycleStart, cycleDay);

      const dateKey = format(pastDateToCheck, "yyyy-MM-dd");
      const pastSymptoms = symptomsHistory[dateKey];

      if (pastSymptoms && pastSymptoms.length > 0) {
        pastSymptoms.forEach((s) => detectedIncidents.add(s));
      }
    }

    if (detectedIncidents.size > 0) {
      predictions.push({
        date: targetDate,
        daysFromNow: i,
        incidents: Array.from(detectedIncidents),
      });
    }
  }

  return predictions;
};
