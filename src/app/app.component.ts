import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  IValueFromModel,
  IValueFromView,
} from './ngx-usa-week-calendar/ngx-usa-week-calendar.interface';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public selectedWeek = 42;
  public control = this.formBuilder.control(null);

  public form = this.formBuilder.group({
    weekNumber: this.control,
  });

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    setTimeout(() => {
      const value: IValueFromModel = {
        year: '',
        weekNumber: '',
      };
      this.control.patchValue(value);
    });
  }

  public onChangeWeekCalendar(value: IValueFromView) {}
}
