/*
 options :{
    elem: HtmlElement;
    previousSelection: Date;
    currentSelection: Date;
    onClick: (Date) => void;
    available: Date[],

    // ???
    min: {month, year} => ??
    max: {month, year} = > ??
 }
*/

(function starrezCalendar() {
  window.starrezCalendar = (month, year, options) => {
    function createCalendar(month, year) {
      const elem = options.elem;
      elem.classList.add("starrezCalendar");

      const header = document.createElement("header");
      header.classList.add("starrezCalendar_header");
      header.innerText = `${toMonth(month)} ${year}`;

      const prev = document.createElement("button");
      prev.classList.add("starrezCalendar_header_button");
      prev.innerHTML = `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 12.8032C7.00775 12.5827 7.10476 12.3641 7.29149 12.1956L15.2983 4.97102C15.6868 4.61943 16.3181 4.61943 16.7078 4.97102C17.0974 5.3216 17.0974 5.89118 16.7078 6.2428L9.43702 12.8032L16.7078 19.3637C17.0974 19.7153 17.0974 20.2849 16.7078 20.6355C16.3181 20.9871 15.6868 20.9871 15.2983 20.6355L7.29149 13.4109C7.10473 13.2424 7.00772 13.0238 7 12.8032V12.8032Z" fill="currentColor"/>
                        </svg>`;
      prev.onclick = () => {
        let newMonth = month - 1;
        let newYear = year;
        if (newMonth <= 0) {
          newMonth = 12;
          newYear = year - 1;
        }

        createCalendar(newMonth, newYear);
      };

      const next = document.createElement("button");
      next.classList.add("starrezCalendar_header_button");
      next.innerHTML = `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 12.8033C16.9922 13.0239 16.8952 13.2424 16.7085 13.411L8.70173 20.6355C8.31319 20.9871 7.68191 20.9871 7.29225 20.6355C6.90258 20.285 6.90258 19.7154 7.29225 19.3638L14.563 12.8033L7.29225 6.2429C6.90258 5.89127 6.90258 5.32169 7.29225 4.97112C7.68191 4.61949 8.31316 4.61949 8.70173 4.97112L16.7085 12.1957C16.8953 12.3642 16.9923 12.5828 17 12.8033V12.8033Z" fill="currentColor"/>
                        </svg>`;
      next.onclick = () => {
        let newMonth = month + 1;
        let newYear = year;
        if (newMonth > 12) {
          newMonth = 1;
          newYear = year + 1;
        }
        createCalendar(newMonth, newYear);
      };

      const today = document.createElement("button");
      today.innerHTML = "Today";
      today.classList.add("starrezCalendar_header_button");
      today.onclick = () => {
        const d = new Date();
        createCalendar(d.getMonth() + 1, d.getFullYear());
      };

      header.append(prev);
      header.append(today);
      header.append(next);

      const tableElement = document.createElement("table");

      tableElement.append(buildTableHeader());
      tableElement.append(buildTable(month, year));

      elem.innerHTML = "";

      elem.append(header);
      elem.append(tableElement);
    }

    function getDay(date) {
      // get day number from 0 (monday) to 6 (sunday)
      let day = date.getDay();
      if (day === 0) day = 7; // make Sunday (0) the last day
      return day - 1;
    }

    function buildTableHeader() {
      const thead = document.createElement("thead");
      const tableHeader = document.createElement("tr");
      const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

      days.forEach((day) => {
        const th = document.createElement("th");
        th.innerText = day;
        tableHeader.append(th);
      });

      thead.append(tableHeader);
      return thead;
    }

    function buildTable(month, year) {
      const tbody = document.createElement("tbody");

      let mon = month - 1; // months in JS are 0..11, not 1..12
      let d = new Date(year, mon);

      let tr = document.createElement("tr");

      // * * * 1  2  3  4
      for (let i = 0; i < getDay(d); i++) {
        const td = document.createElement("td");
        // add the previous month here
        tr.append(td);
      }

      // add the dates
      while (d.getMonth() === mon) {
        const td = document.createElement("td");
        const button = document.createElement("button");
        button.dataset.date = d.toDateString();

        button.onclick = function () {
          options.onClick(new Date(this.dataset.date));
        };

        button.innerText = d.getDate();
        button.classList.add("starrezCalendar_button");

        if (isToday(d)) {
          button.classList.add("today");
        }

        if (hasData(d)) {
          button.classList.add("has-data");
        }

        if (isDate(d, options.previousSelection)) {
          button.classList.add("previous");
        }

        if (isDate(d, options.currentSelection)) {
          button.classList.add("current");
        }

        td.append(button);
        tr.append(td);

        if (getDay(d) % 7 === 6) {
          tbody.append(tr);
          tr = document.createElement("tr");
        }
        d.setDate(d.getDate() + 1);
      }

      if (getDay(d) !== 0) {
        for (let i = getDay(d); i < 7; i++) {
          const td = document.createElement("td");
          // add the next month here
          tr.append(td);
        }
      }

      tbody.append(tr);

      return tbody;
    }

    function isDate(d, e) {
      return (
        d.getDate() === e.getDate() &&
        d.getMonth() === e.getMonth() &&
        d.getFullYear() === e.getFullYear()
      );
    }

    function isToday(someDate) {
      const today = new Date();
      return (
        someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
      );
    }

    function toMonth(monthNo) {
      const date = new Date(2001, monthNo - 1, 1);
      return new Intl.DateTimeFormat(undefined, { month: "long" }).format(date);
    }

    function hasData(d) {
      if (options.available) {
        var found = options.available.find((e) => {
          return (
            d.getDate() === e.getDate() &&
            d.getMonth() === e.getMonth() &&
            d.getFullYear() === e.getFullYear()
          );
        });

        return found;
      }
      return false;
    }

    createCalendar(month, year);
  };
})();
