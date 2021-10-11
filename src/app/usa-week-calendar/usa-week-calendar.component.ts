import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

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
    // this.dateGroupByWeek = _.groupBy(currentDateList, 'week');
    this.weekNumbers = Object.keys(this.dateGroupByWeek).map((n) => +n);
  }

  private daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  private getDaysOfMonth(year: number, month: number) {
    // var monthDate = moment(year + '-' + month, 'YYYY-MM');
    var daysInMonth = this.daysInMonth(month, year);
    console.log('daysInMonth', daysInMonth);
    // var arrDays = [];

    // while (daysInMonth) {
    //   // var current = moment(
    //   //   year + '-' + month + '-' + daysInMonth,
    //   //   'YYYY-MM-DD'
    //   // ).date(daysInMonth);
    //   // arrDays.push({
    //   //   shortDate: current.format('YYYY-MM-DD'),
    //   //   date: current.format('D'),
    //   //   dayInWeek: this.weeks[current.day()],
    //   //   week: current.week(),
    //   // });
    //   // daysInMonth--;
    // }

    // return arrDays;
    return [];
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
}
