# ngx-usa-week-calendar

Angular version 12.1.0

# How to use

This module need to install **moment** and **ngx-moment**. it can be used with reactive form or template driven.

| Event                | Output                 |
| -------------------- | ---------------------- |
| onChangeWeekCalendar | value: IValueFromModel |

```javascript
<form novalidate [formGroup]="form">
  <div class="width-150">
    <ngx-usa-week-calendar
      name="week-calendar"
      (ngModelChange)="onChangeWeekCalendar($event)"
      formControlName="weekNumber"
    ></ngx-usa-week-calendar>
  </div>
</form>
```

## Demo

[Stackblitz](https://stackblitz.com/edit/ngx-usa-week-calendar)

## Screenshots

![App Screenshot](https://raw.githubusercontent.com/huymach91/ngx-usa-week-calendar/master/src/assets/ngx-usa-week-calendar.png?token=AHXRERMNIXKGDSQLD4K7BILBOABMQ)

![App Screenshot](https://raw.githubusercontent.com/huymach91/ngx-usa-week-calendar/master/src/assets/ngx-usa-week-calendar-2.png?token=AHXRERJBF5QEPKBWS3LJCILBOABNQ)

## Browser Support

Latest Chrome.
