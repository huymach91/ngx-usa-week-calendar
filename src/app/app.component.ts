import { Component, VERSION } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public selectedWeek = 42;
  public control = this.formBuilder.control('');

  constructor(private formBuilder: FormBuilder) {}

  public onChangeWeekCalendar(value) {
    console.log(value);
  }
}
