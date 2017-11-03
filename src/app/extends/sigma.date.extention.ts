interface Date {
   addDays(days: number, useThis?: boolean): Date;
   subtractDays(days: number, useThis?: boolean): Date;
   isToday(): boolean;
   clone(): Date;
   isAnotherMonth(date: Date): boolean;
   isWeekend(): boolean;
   isSameDate(date: Date): boolean;
   getShortDateName(day: number);
   getSQLFormat();
   getFullMonthName();
   getFormattedDate();
   fromSQLFormat(sqlDate: string);
}


Date.prototype.addDays = function (days) {
   const dat = new Date(this.valueOf());
   dat.setDate(dat.getDate() + days);
   return dat;
};

Date.prototype.subtractDays = function (days) {
   const dat = new Date(this.valueOf());
   dat.setDate(dat.getDate() - days);
   return dat;
};

Date.prototype.isToday = function () {
   let today = new Date();
   return this.isSameDate(today);
};

Date.prototype.getShortDateName = (day: number) => {
   const dayNames = ['Sunday', 'Monday', 'Tuesday',
      'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   return dayNames[day].substring(0, 3);
};

Date.prototype.getSQLFormat = function () {
   let month = this.getMonth() + 1;
   let day = this.getDate();

   month = month < 10 ? '0'.concat(month) : month;
   day = day < 10 ? '0'.concat(day) : day;

   return `${this.getFullYear()}-${month}-${day}`;
};

Date.prototype.fromSQLFormat = function (sqlDate) {
   const dateParts = sqlDate.split("-");
   return new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2].substr(0, 2));
}

Date.prototype.getFormattedDate = function () {
   let month = this.getMonth() + 1;
   let day = this.getDate();

   month = month < 10 ? '0'.concat(month) : month;
   day = day < 10 ? '0'.concat(day) : day;

   return `${day}/${month}/${this.getFullYear()}`;
};

Date.prototype.getFullMonthName = function () {
   const months = ['January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
   const dat = new Date(this.valueOf())
   const month = months[dat.getMonth()];
   return month;
};

Date.prototype.isSameDate = function (date: Date) {
   return date && this.getFullYear() === date.getFullYear()
      && this.getMonth() === date.getMonth() && this.getDate() === date.getDate();
};
