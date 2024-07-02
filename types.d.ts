interface eventType {
  title: string;
  start: Date | null;
  end: Date | null;
  color?: string;
  duration?: number;
  location?: string;
  description?: string;
  departments: string[] | { code: string }[];
  notes?: string;
  _id?: string;
  recurringType: string;
  involvedUsers: string[];
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
  eventTo: number | string;
  eventFrom: number | string;
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
}
