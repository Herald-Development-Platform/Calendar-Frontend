interface eventType {
  title: string;
  start: Date | null;
  end: Date | null;
  color?: string;
  duration?: number;
  location?: string;
  description?: string;
  // departments: string[] | { code: string }[];
  departments: string[];
  notes?: string;
  _id?: string;
  recurringType: string;
  involvedUsers: string[];
  recurrenceEnd: Date | null;
  exceptionRanges?: { start: Date; end: Date }[];
  notifyUpdate?: boolean;
}
interface SemesterType {
  semester: string;
  course: string;
  start: Date;
  end: Date;
  color: string;
}
interface SelectedDate {
  start?: Date;
  end?: Date;
  endStr: string;
  startStr: string;
}
type setDateAndTimeTypes = {
  hours: number;
  minutes: number;
  type: "start" | "end";
};

interface eventByParamsType {
  q: string;
  departments: string[];
  colors: string[];
  eventTo: number | "";
  eventFrom: number | "";
}

interface Department {
  _id: string;
  name: string;
  code: string;
  description: string;
  membersCount?: number;
}

interface User {
  _id: string;
  email: string;
  username: string;
  photo?: string;
  permissions: string[];
  role: string;
  department?: Department;
  photo?: string;
  importantDates?: Date[];
  syncWithGoogle: boolean;
  donotDisturbState?: string;
  notificationExpiry?: Date;
  activeSemester?: string[];
}

interface Location {
  _id: string;
  name: string;
  description?: string;
  id?: string;
}

interface Semester {
  _id?: string;
  semester: string;
  course: string;
  start: Date;
  end: Date;
  color: string;
}
