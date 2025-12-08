/* ---------------------------------------
   Teacher Availability Types
----------------------------------------*/

// Days constant can be used in UI dropdowns, selections, etc.
export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

// Reusable Type for a Day (from const array)
export type DayType = (typeof DAYS)[number];

/* ---------------------------------------
   Client Types (Frontend State)
----------------------------------------*/

export type TimeSlot = {
  id: string;      // unique id from frontend state (not sent to backend)
  start: string;
  end: string;
};

export type DayAvailability = {
  day: DayType;
  enabled: boolean;
  slots: TimeSlot[];
};

/* ---------------------------------------
   API Types (Request/Response)
----------------------------------------*/

export type APITimeSlot = {
  start: string;
  end: string;
};

export type APIDayAvailability = {
  day: DayType;
  enabled: boolean;
  slots: APITimeSlot[];
};

/* ---------------------------------------
   Save Payload for Backend
----------------------------------------*/

export type SaveTimeSlot = {
  start: string;
  end: string;
};

export type SaveDayAvailability = {
  day: DayType;
  enabled: boolean;
  slots: SaveTimeSlot[];
};

export type SaveAvailabilityPayload = {
  week: SaveDayAvailability[];
};
