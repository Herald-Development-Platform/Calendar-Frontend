interface eventType {
  title: string;
  start: Date | null;
  end: Date | null;
  color?: string;
  duration?: number;
  location?: string;
  description?: string;
  departments?: string[];
  notes?: string;
}

type setDateAndTimeTypes = {
  hours: number;
  minutes: number;
  type: "start" | "end";
};
