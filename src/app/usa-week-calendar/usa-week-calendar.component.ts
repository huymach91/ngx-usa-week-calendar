import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DateTime } from 'luxon';

console.log(DateTime);

@Component({
  selector: 'usa-week-calendar',
  templateUrl: './usa-week-calendar.component.html',
  styleUrls: ['./usa-week-calendar.component.scss'],
})
export class USAWeekCalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('calendarWrapper', { static: false }) calendarWrapper: ElementRef;
  @ViewChild('calendarToggle', { static: false }) calendarToggle: ElementRef;
  @ViewChild('calendarDropdown', { static: false })
  calendarDropdown: ElementRef;

  public wrapper: HTMLDivElement;
  public toggle: HTMLDivElement;
  public dropdown: HTMLDivElement;

  public months = [
    'Jan',
    'Fed',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  public weeks = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sat'];
  public years = [];

  public today = new Date();
  public currentYear: number;

  public selectedMonth: number; // 1-12
  public selectedYear: number;

  public dateGroupByWeek = {}; // { 36: [], 37: [] }
  public weekNumbers = []; // [36, 37, 38, 39, 40]

  constructor() {
    this.currentYear = this.today.getFullYear();
    this.selectedYear = this.today.getFullYear();
    this.selectedMonth = this.today.getMonth() + 1;
    for (let i = this.currentYear; i > this.currentYear - 10; i--) {
      this.years.push(i);
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.wrapper = this.calendarWrapper.nativeElement;
    this.toggle = this.calendarToggle.nativeElement;
    this.dropdown = this.calendarDropdown.nativeElement;

    this.wrapper.addEventListener('click', this.openDropdown.bind(this));
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event) {
    if (!this.wrapper.contains(event.target)) {
      this.dropdown.style.setProperty('display', 'none');
      return;
    }
  }

  private openDropdown(event) {
    if (!this.wrapper.contains(event.target)) {
      this.closeDropdown();
      return;
    }
    this.calcWeeks();
    this.dropdown.style.setProperty('display', 'block');
  }

  private closeDropdown() {
    this.dropdown.style.setProperty('display', 'none');
  }

  public calcWeeks() {
    const currentDateList = this.getDaysOfMonth(
      this.selectedYear,
      this.selectedMonth
    ); // ['2021-09-01', '2021-09-02', ..., '2021-09-30']
    this.dateGroupByWeek = this.groupBy(currentDateList, 'week');
    console.log(this.dateGroupByWeek);
    this.weekNumbers = Object.keys(this.dateGroupByWeek).map((n) => +n);
  }

  private daysInMonth(month, year) {
    const date = new Date(year, month, 0);
    return date.getDate();
  }

  private getWeekOfMonth(date) {
    let adjustedDate = date.getDate() + date.getDay();
    let prefixes = ['0', '1', '2', '3', '4', '5'];
    return parseInt(prefixes[0 | (adjustedDate / 7)]) + 1;
  }

  private getDaysOfMonth(year: number, month: number) {
    let daysInMonth = this.daysInMonth(month, year);
    const date = year + '-' + month + '-' + daysInMonth;
    var arrDays = [];

    while (daysInMonth) {
      const date = year + '-' + month + '-' + daysInMonth;
      arrDays.push({
        shortDate: date,
        date: daysInMonth,
        dayInWeek: this.weeks[new Date(date).getDay()],
        week: this.getWeekOfMonth(new Date(date)),
      });
      daysInMonth--;
    }
    console.log(arrDays);
    return arrDays;
  }

  public returnDateByWeekNumber(
    list: Array<{ date: any; dayInWeek: string; week: number }>,
    dayInWeek: string
  ) {
    const date = list.find((date) => date.dayInWeek === dayInWeek);
    return date ? date.date : '';
  }

  public onSelectWeekNumber(weekNumber: number) {}

  public previous() {
    if (this.selectedMonth === 1) {
      this.selectedMonth = 12;
      this.selectedYear--;
      this.calcWeeks();
      return;
    }
    this.selectedMonth--;
    this.calcWeeks();
  }

  public next() {
    if (this.selectedMonth === 12) {
      this.selectedMonth = 1;
      this.selectedYear++;
      this.calcWeeks();
      return;
    }
    this.selectedMonth++;
    this.calcWeeks();
  }

  private groupBy(list, key) {
    return list.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }
}
