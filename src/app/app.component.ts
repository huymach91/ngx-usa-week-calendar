import { Component, OnInit, VERSION } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IValueFromModel } from './usa-week-calendar/usa-week-calendar.interface';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public selectedWeek = 42;
  public control = this.formBuilder.control('');

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    setTimeout(() => {
      const value: IValueFromModel = {
        year: 2021,
        weekNumber: 39,
      };
      this.control.patchValue(value);
    });
  }

  public onChangeWeekCalendar(value) {
    console.log(value);
  }
}
