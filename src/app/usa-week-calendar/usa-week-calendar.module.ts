import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { USAWeekCalendarComponent } from './usa-week-calendar.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [USAWeekCalendarComponent],
  imports: [CommonModule, FormsModule],
  exports: [USAWeekCalendarComponent],
  providers: [],
})
export class USAWeekCalendarModule {}
