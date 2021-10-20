import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUSAWeekCalendarComponent } from './usa-week-calendar.component';
import { FormsModule } from '@angular/forms';
import { CalendarIconComponent } from './calendar-icon.component';

@NgModule({
  declarations: [NgxUSAWeekCalendarComponent, CalendarIconComponent],
  imports: [CommonModule, FormsModule],
  exports: [NgxUSAWeekCalendarComponent],
  providers: [],
})
export class NgxUSAWeekCalendarModule {}
