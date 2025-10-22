const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;


export type TimeSlot = { id: string; start: string; end: string };
export type DayAvailability = { day: typeof DAYS[number]; enabled: boolean; slots: TimeSlot[] };
export type APITimeSlot = { start: string; end: string };
export type APIDayAvailability = { day: typeof DAYS[number]; enabled: boolean; slots: APITimeSlot[] };
export type SaveTimeSlot = {
  start: string;
  end: string;
};

export type SaveDayAvailability = {
  day: typeof DAYS[number];
  enabled: boolean;
  slots: SaveTimeSlot[];
};

export type SaveAvailabilityPayload = {
  week: SaveDayAvailability[];
};