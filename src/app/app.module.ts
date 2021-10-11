import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { USAWeekCalendarModule } from './usa-week-calendar/usa-week-calendar.module';

@NgModule({
  imports: [BrowserModule, FormsModule, USAWeekCalendarModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
