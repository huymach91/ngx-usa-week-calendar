export interface IDate {
  shortDate: string;
  date: string;
  dayInWeek: string;
  week: number;
}

export interface IReplaceIndex {
  weekNumber: number;
  year: number;
}

export interface IValueFromModel {
  weekNumber: any;
  year: any;
}

export interface IValueFromView {
  weekNumber: number;
  from: string;
  to: string;
  year: number;
  month: number;
}
