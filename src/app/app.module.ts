import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgxUSAWeekCalendarModule } from './ngx-usa-week-calendar/ngx-usa-week-calendar.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxUSAWeekCalendarModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
