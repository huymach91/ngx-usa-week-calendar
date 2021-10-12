import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import moment = require('moment');

interface IDate {
  shortDate: string;
  date: string;
  dayInWeek: string;
  week: number;
}

interface IValue {
  weekNumber: any;
  year: any;
  month: any;
}

@Component({
  selector: 'usa-week-calendar',
  templateUrl: './usa-week-calendar.component.html',
  styleUrls: ['./usa-week-calendar.component.scss'],
})
export class USAWeekCalendarComponent implements OnInit, AfterViewInit {
  @Input('control') control: FormControl;
  @Output('ngModelChange') ngModelChange = new EventEmitter();

  @ViewChild('calendarWrapper', { static: false }) calendarWrapper: ElementRef;
  @ViewChild('calendarToggle', { static: false }) calendarToggle: ElementRef;
  @ViewChild('calendarDropdown', { static: false })
  calendarDropdown: ElementRef;
  @ViewChild('weekNumberRef', { static: false }) weekNumberRef;
  @ViewChild('yearRef', { static: false }) yearRef;

  public wrapper: HTMLDivElement;
  public toggle: HTMLDivElement;
  public dropdown: HTMLDivElement;
  public weekNumber: HTMLSpanElement;
  public year: HTMLSpanElement;

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
  public currentMonth: number;

  public selectedMonth: number; // 1-12
  public selectedYear: number;

  public dateGroupByWeek = {}; // { 36: [], 37: [] }
  public weekNumbers = []; // [36, 37, 38, 39, 40]

  public value: IValue = {
    weekNumber: '',
    year: '',
    month: '',
  };
  public display = {
    weekNumber: '--',
    year: '----',
  };

  public selectedWeekNumber: number;

  public weekNumberReplaceIndex: number;
  public yearReplaceIndex: number;

  constructor() {
    this.currentYear = this.today.getFullYear();
    this.selectedYear = this.today.getFullYear();
    this.currentMonth = this.today.getMonth() + 1;
    this.selectedMonth = this.currentMonth;
    for (let i = this.currentYear; i > this.currentYear - 10; i--) {
      this.years.push(i);
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.wrapper = this.calendarWrapper.nativeElement;
    this.toggle = this.calendarToggle.nativeElement;
    this.dropdown = this.calendarDropdown.nativeElement;
    this.weekNumber = this.weekNumberRef.nativeElement;
    this.year = this.yearRef.nativeElement;

    this.toggle.addEventListener('click', this.openDropdown.bind(this));
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event) {
    if (this.wrapper && !this.wrapper.contains(event.target)) {
      this.dropdown.style.setProperty('display', 'none');
      return;
    }
  }

  @HostListener('document:keydown', ['$event'])
  public onKeydown(event: KeyboardEvent) {
    const key = event.key;
    const selection = document.getSelection();

    // case 1: arrow left, arrow right
    if (
      this.weekNumber.contains(selection.anchorNode) &&
      key === 'ArrowRight'
    ) {
      setTimeout(() => this.onClickYear());
    }

    if (this.year.contains(selection.anchorNode) && key === 'ArrowLeft') {
      setTimeout(() => this.onClickWeekNumber());
    }

    // case 3: enter week number
    if (
      this.weekNumber.contains(selection.anchorNode) &&
      /[\d]/.test(event.key)
    ) {
      // week number: '--', index starts from 0 to 1
      if (this.weekNumberReplaceIndex <= 0) {
        this.onClickYear();
      }
      // replace
      const weekNumbers = this.display.weekNumber.split('');
      weekNumbers[this.weekNumberReplaceIndex] = event.key;
      this.display.weekNumber = weekNumbers.join('');
      // set replace index to 0
      this.weekNumberReplaceIndex--;
      // select again
      if (this.weekNumberReplaceIndex >= 0) {
        setTimeout(() => this.selectNode(this.weekNumber.firstChild, 0, 2));
      }
    }
    // case 4: enter year
    if (this.year.contains(selection.anchorNode) && /[\d]/.test(event.key)) {
      // week number: '----', index starts from 0 to 3
      console.log('case 2');
    }
  }

  private openDropdown(event) {
    if (this.wrapper && !this.wrapper.contains(event.target)) {
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
    this.weekNumbers = Object.keys(this.dateGroupByWeek).map((n) => +n);
  }

  private getDaysOfMonth(year: number, month: number) {
    const monthDate = moment(year + '-' + month, 'YYYY-MM');
    let daysInMonth = monthDate.daysInMonth();
    const arrDays: Array<IDate> = [];
    let i = 1;
    while (i <= daysInMonth) {
      const current = moment(year + '-' + month + '-' + i, 'YYYY-MM-DD').date(
        i
      );
      arrDays.push({
        shortDate: current.format('YYYY-MM-DD'),
        date: current.format('D'),
        dayInWeek: this.weeks[current.day()],
        week: current.week(),
      });
      i++;
    }
    return arrDays;
  }

  public returnDateByWeekNumber(
    list: Array<{ date: any; dayInWeek: string; week: number }>,
    dayInWeek: string
  ) {
    const date = list.find((date) => date.dayInWeek === dayInWeek);
    return date ? date.date : '';
  }

  public onSelectWeekNumber(dateGroupByWeek: Array<IDate>, weekNumber: number) {
    // update selected new value
    this.value.weekNumber = weekNumber;
    this.value.year = this.selectedYear;
    this.value.month = this.selectedMonth;
    // update display
    this.display.year =
      this.value.year >= 10 ? this.value.year : '0' + this.value.year;
    this.display.weekNumber =
      this.value.weekNumber >= 10
        ? this.value.weekNumber
        : '0' + this.value.weekNumber;

    this.selectedWeekNumber = weekNumber;

    const from = dateGroupByWeek[0] as IDate;
    const to = dateGroupByWeek[dateGroupByWeek.length - 1] as IDate;
    // value
    const value = {
      weekNumber: weekNumber,
      from: from.shortDate,
      to: to.shortDate,
      ...this.value,
    };
    // update ngModel
    this.control.patchValue(value);
    this.ngModelChange.emit(value);
    // close dropdown
    setTimeout(() => {
      this.closeDropdown();
    });
  }

  public onSelectThisWeek() {
    const m = moment();
    this.selectedYear = m.get('year');
    this.selectedMonth = m.get('month') + 1;
    this.calcWeeks();
    this.onSelectWeekNumber(
      this.dateGroupByWeek[this.selectedWeekNumber],
      moment().week()
    );
  }

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

  public onClickWeekNumber() {
    // week number: '--'
    this.weekNumberReplaceIndex = 1; // set replace index to last index
    this.selectNode(this.weekNumber.firstChild, 0, 2);
  }

  public onClickYear() {
    // year: '----'
    this.yearReplaceIndex = 3; // set replace index to last index
    this.selectNode(this.year.firstChild, 0, 4);
  }

  private selectNode(node, start: number, end: number) {
    const selection = document.getSelection();
    const range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, end);
    document.getSelection().removeAllRanges();
    selection.addRange(range);
  }
}
