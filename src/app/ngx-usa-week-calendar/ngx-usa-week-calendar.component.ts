import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import moment = require('moment');
import {
  IDate,
  IReplaceIndex,
  IValueFromView,
} from './ngx-usa-week-calendar.interface';

const USA_CALENDAR_INPUT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgxUSAWeekCalendarComponent),
  multi: true,
};

interface IValue {
  weekNumber: any;
  year: any;
  month: any;
}

@Component({
  selector: 'ngx-usa-week-calendar',
  templateUrl: './ngx-usa-week-calendar.component.html',
  styleUrls: ['./ngx-usa-week-calendar.component.scss'],
  providers: [USA_CALENDAR_INPUT_VALUE_ACCESSOR],
})
export class NgxUSAWeekCalendarComponent
  implements OnInit, AfterViewInit, ControlValueAccessor
{
  @Input() formControlName: string;

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

  private replaceIndex: IReplaceIndex = {
    weekNumber: 3,
    year: 1,
  };

  private onTouched: Function;
  private onModelChange: Function;

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

  private modelToView(value: IValue) {
    if (!value) return;

    if (value.weekNumber && value.year) {
      this.display.weekNumber = '' + value.weekNumber;
      this.display.year = '' + value.year;
      this.updateModelByDisplay();
    }
  }

  private viewToModel(value: IValueFromView = null) {
    this.onModelChange(value);
    this.onTouched();
  }

  ngAfterViewInit() {
    this.wrapper = this.calendarWrapper.nativeElement;
    this.toggle = this.calendarToggle.nativeElement;
    this.dropdown = this.calendarDropdown.nativeElement;
    this.weekNumber = this.weekNumberRef.nativeElement;
    this.year = this.yearRef.nativeElement;

    this.toggle.onclick = (event: any) => {
      this.openDropdown(event);
    };

    this.wrapper.onclick = (event: MouseEvent) => {
      if (this.wrapper !== event.target) return;
      this.selectWeekNumberNode();
    };
  }

  writeValue(value) {
    this.modelToView(value);
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  registerOnChange(fn) {
    this.onModelChange = fn;
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
      (key === 'ArrowRight' || key === 'Tab')
    ) {
      setTimeout(() => this.onClickYear());
    }

    if (this.year.contains(selection.anchorNode) && key === 'ArrowLeft') {
      setTimeout(() => this.onClickWeekNumber());
    }

    if (
      this.weekNumber.contains(selection.anchorNode) &&
      (key === 'Backspace' || key === 'Delete')
    ) {
      // reset
      this.display.weekNumber = '--';
      this.replaceIndex.weekNumber = 1;
      // node selection
      this.selectWeekNumberNode();
      // reset model
      this.resetModel();
    }

    if (
      this.year.contains(selection.anchorNode) &&
      (key === 'Backspace' || key === 'Delete')
    ) {
      // reset
      this.display.year = '----';
      this.replaceIndex.weekNumber = 3;
      // node selection
      this.selectYearNode();
      // reset model
      this.resetModel();
    }

    // case 2: enter week number
    // week number: '--', index starts from 0 to 1
    if (this.weekNumber.contains(selection.anchorNode) && /[\d]/.test(key)) {
      // move to year if replace index starts from 0
      const weekNumbers = this.display.weekNumber.split('');
      const newWeekNumber = this.rollValueToEnd(
        weekNumbers,
        key,
        this.replaceIndex.weekNumber,
        1
      );
      this.display.weekNumber = +newWeekNumber > 52 ? '52' : newWeekNumber;
      this.handleReplaceIndexBySection(
        'weekNumber',
        1,
        this.selectWeekNumberNode.bind(this)
      );
      this.updateModelByDisplay();
    }

    // case 3: enter year
    if (this.year.contains(selection.anchorNode) && /[\d]/.test(key)) {
      // year: '----', index starts from 0 to 3
      const years = this.display.year.split('');
      this.display.year = this.rollValueToEnd(
        years,
        key,
        this.replaceIndex.year,
        3
      );
      this.handleReplaceIndexBySection(
        'year',
        3,
        this.selectYearNode.bind(this)
      );
      this.updateModelByDisplay();
    }
  }

  private swap(list: Array<any>, indexA: number, indexB: number) {
    const temp = list[indexA];
    list[indexA] = list[indexB];
    list[indexB] = temp;
  }

  // role value to from index to index
  private rollValueToEnd(
    list: Array<any>,
    value: any,
    from: number,
    to: number
  ) {
    for (let i = 0; i < to; i++) {
      if (i >= from) {
        this.swap(list, i, i + 1);
      } else {
        list[i] = 0;
      }
    }
    list[to] = value;
    return list.join('');
  }

  /*
    Summary: this is common handle for week number and year
    @param section index: weekNumber or year
    @param length: 1 for weekNumber, 3 for year
    @param selectNodeFunc: select node function
  */
  private handleReplaceIndexBySection(
    sectionIndex: 'weekNumber' | 'year',
    length,
    selectNodeFunc: Function
  ) {
    this.replaceIndex[sectionIndex]--;
    // reset
    if (this.replaceIndex[sectionIndex] < 0) {
      this.replaceIndex[sectionIndex] = length;
    }
    // remaining node selection
    if (this.replaceIndex[sectionIndex] >= 0) {
      selectNodeFunc();
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
    const monthDate = new Date(year, month, 0);
    let daysInMonth = monthDate.getDate();
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
    this.viewToModel(value);
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
    this.replaceIndex.weekNumber = 1; // set replace index to last index
    this.selectWeekNumberNode();
  }

  public onClickYear() {
    // year: '----'
    this.replaceIndex.year = 3; // set replace index to last index
    this.selectYearNode();
  }

  private selectNode(node, start: number, end: number) {
    const selection = document.getSelection();
    const range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, end);
    document.getSelection().removeAllRanges();
    selection.addRange(range);
  }

  private selectWeekNumberNode() {
    setTimeout(() => this.selectNode(this.weekNumber.firstChild, 0, 2));
  }

  private selectYearNode() {
    setTimeout(() => this.selectNode(this.year.firstChild, 0, 4));
    // default week number
    const weekNumber = this.display.weekNumber;
    this.display.weekNumber = weekNumber === '00' ? '01' : weekNumber;
  }

  private updateModelByDisplay() {
    const pattern = /^[\d]+$/;
    this.resetModel();
    if (
      !pattern.test(this.display.weekNumber) ||
      !pattern.test(this.display.year) ||
      this.display.weekNumber === '00'
    )
      return;
    const weekNumber = +this.display.weekNumber;
    const year = +this.display.year;

    // get start, end date by week number
    const m = moment().year(year).week(weekNumber);
    this.selectedMonth = m.get('month') + 1;
    this.selectedYear = m.get('year');
    this.calcWeeks();
    // update selected new value
    this.value.weekNumber = weekNumber;
    this.value.year = this.selectedYear;
    this.value.month = this.selectedMonth;
    // update model
    this.selectedWeekNumber = weekNumber;
    const from = this.dateGroupByWeek[weekNumber][0] as IDate;
    const to = this.dateGroupByWeek[weekNumber][
      this.dateGroupByWeek[weekNumber].length - 1
    ] as IDate;
    const value = {
      weekNumber: this.selectedWeekNumber,
      from: from.shortDate,
      to: to.shortDate,
      ...this.value,
    };
    // update model
    this.viewToModel(value);
  }

  public resetModel() {
    this.viewToModel();
  }
}
