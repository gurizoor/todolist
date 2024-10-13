"use strict";
let inp = document.getElementById("inp");
let add = document.getElementById("add");
let daylist = document.getElementById("daylist");
let weeklist = document.getElementById("weeklist");
let monthlist = document.getElementById("monthlist");
let day = document.getElementById("day");
let week = document.getElementById("week");
let month = document.getElementById("month");
let lsid = 0;
let listArray = [];
let today = new Date();
let todayObj = {
    date: today.getDate(),
    day: today.getDay(),
    month: today.getMonth(),
    year: today.getFullYear()
};
let preDate = todayObj;
function checkDWM() {
    if ((todayObj.date !== preDate.date) ||
        (todayObj.month !== preDate.month) ||
        (todayObj.year !== preDate.year)) {
        listArray.map(list => {
            if (list.dwmId == "daylist")
                list.i.checked = false;
        });
    }
    if ((preDate.day === 0 && todayObj.day === 1) ||
        (todayObj.day < preDate.day) ||
        (todayObj.date >= preDate.date + 7) ||
        (todayObj.month !== preDate.month) ||
        (todayObj.year !== preDate.year)) {
        listArray.map(list => {
            if (list.dwmId == "weeklist")
                list.i.checked = false;
        });
    }
    if ((todayObj.month !== preDate.month) ||
        (todayObj.year !== preDate.year)) {
        listArray.map(list => {
            if (list.dwmId == "monthlist")
                list.i.checked = false;
        });
    }
}
function dataSet() {
    let dataToSet = listArray.map(list => ({
        dwmId: list.dwmId,
        l: list.l.innerHTML,
        i: list.i.checked
    }));
    localStorage.setItem("listArray", JSON.stringify(dataToSet));
    localStorage.setItem("preDate", JSON.stringify(todayObj));
}
function dataLoad() {
    let defaultPreDate = { date: today.getDate(), day: today.getDay(), month: today.getMonth(), year: today.getFullYear() };
    preDate = JSON.parse(localStorage.getItem("preDate") || JSON.stringify(defaultPreDate));
    let retrievedData = JSON.parse(localStorage.getItem("listArray") || "[]");
    return retrievedData.map((data) => {
        let listElement = document.getElementById(data.dwmId);
        if (listElement) {
            return new lists(listElement, data.l, data.i);
        }
    }).filter((item) => item !== null);
}
class lists {
    constructor(list, showtext, prechecked) {
        this.d = document.createElement("div");
        this.i = document.createElement("input");
        this.l = document.createElement("label");
        this.b = document.createElement("button");
        this.num = lsid;
        this.dwm = list;
        this.dwmId = list.id;
        this.i.type = "checkbox";
        this.i.id = "ch" + this.num;
        this.i.checked = prechecked;
        this.i.className = "ilist";
        this.l.innerHTML = showtext + " ";
        this.l.htmlFor = "ch" + this.num;
        this.l.className = "llist";
        this.d.className = "dlist";
        this.b.type = "button";
        this.b.textContent = "x";
        this.b.className = "blist";
        lsid += 1;
        this.b.addEventListener("click", () => {
            this.remove();
        });
    }
    show() {
        var _a, _b, _c, _d;
        (_a = this.dwm) === null || _a === void 0 ? void 0 : _a.appendChild(this.d);
        (_b = this.d) === null || _b === void 0 ? void 0 : _b.appendChild(this.i);
        (_c = this.d) === null || _c === void 0 ? void 0 : _c.appendChild(this.l);
        (_d = this.d) === null || _d === void 0 ? void 0 : _d.appendChild(this.b);
    }
    remove() {
        this.d.remove();
        this.i.remove();
        this.l.remove();
        this.b.remove();
        listArray = listArray.filter(list => list !== this);
    }
    static show() {
        for (let i = 0; i < listArray.length; i++) {
            listArray[i].show();
        }
    }
}
add === null || add === void 0 ? void 0 : add.addEventListener("click", () => {
    let selectlist = daylist;
    day.checked ? selectlist = daylist : {};
    week.checked ? selectlist = weeklist : {};
    month.checked ? selectlist = monthlist : {};
    listArray[listArray.length] = new lists(selectlist, inp.value, false);
    listArray[listArray.length - 1].show();
    inp.value = "";
});
window.onload = () => {
    listArray = dataLoad();
    lists.show();
    checkDWM();
};
window.addEventListener("beforeunload", () => {
    dataSet();
});
const devb = document.getElementById("devb");
devb === null || devb === void 0 ? void 0 : devb.addEventListener("click", () => {
});
