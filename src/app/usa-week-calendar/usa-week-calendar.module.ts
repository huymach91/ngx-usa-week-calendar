import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { USAWeekCalendarComponent } from './usa-week-calendar.component';
import { FormsModule } from '@angular/forms';
import { CalendarIconComponent } from './calendar-icon.component';

@NgModule({
  declarations: [USAWeekCalendarComponent, CalendarIconComponent],
  imports: [CommonModule, FormsModule],
  exports: [USAWeekCalendarComponent],
  providers: [],
})
export class USAWeekCalendarModule {}
