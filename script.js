"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let inp = document.getElementById("inp");
let add = document.getElementById("add");
let daylist = document.getElementById("daylist");
let weeklist = document.getElementById("weeklist");
let monthlist = document.getElementById("monthlist");
let generallist = document.getElementById("generallist");
let day = document.getElementById("day");
let week = document.getElementById("week");
let month = document.getElementById("month");
let general = document.getElementById("general");
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
    if (preDate.day === 6 && todayObj.day === 0) {
    }
    else if ((preDate.day === 0 && todayObj.day === 1) ||
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
let db;
const dbName = "listArrayDB";
const storeName = "listStore";
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = (event) => {
            const db = request.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: "id" });
            }
        };
        request.onsuccess = (event) => {
            db = request.result;
            resolve(db);
        };
        request.onerror = (event) => {
            alert("IndexedDBのオープンエラー" + event);
            reject(event);
        };
    });
}
function idataSet() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield openDatabase();
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const data = {
            id: "listAndDate",
            listArray: lists.objArr(),
            preDate: todayObj
        };
        const request = store.put(data);
        request.onsuccess = () => {
        };
        request.onerror = (e) => {
            alert("データ保存に失敗しました" + e);
        };
    });
}
function idataLoad() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield openDatabase();
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get("listAndDate");
        request.onsuccess = () => {
            if (request.result) {
                const { listArray: storedListArray, preDate: storedPreDate } = request.result;
                lists.objToList(storedListArray);
                preDate = storedPreDate;
                lists.show();
                checkDWM();
            }
            else {
                console.log("Indexeddbに保存されたデータがありません");
            }
        };
        request.onerror = (e) => {
            alert("データ読み込みに失敗しました" + e);
        };
    });
}
if (!('indexedDB' in window)) {
    alert('お使いのブラウザではIndexedDBがサポートされていません。別のブラウザをご利用ください。');
}
else {
    openDatabase().catch((error) => {
        alert("IndexedDBの初期化に失敗しました:" + error);
    });
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
        this.i.addEventListener("change", () => {
            idataSet();
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
        idataSet();
    }
    static show() {
        for (let i = 0; i < listArray.length; i++) {
            listArray[i].show();
        }
    }
    static objArr() {
        return listArray.map(list => ({
            dwmId: list.dwmId,
            l: list.l.innerHTML,
            i: list.i.checked
        }));
    }
    static objToList(listobj) {
        listArray = listobj.map(list => {
            let listelement = document.getElementById(list.dwmId);
            return new lists(listelement, list.l, list.i);
        }).filter((item) => item !== null);
    }
}
add === null || add === void 0 ? void 0 : add.addEventListener("click", () => {
    let selectlist = generallist;
    day.checked ? selectlist = daylist : {};
    week.checked ? selectlist = weeklist : {};
    month.checked ? selectlist = monthlist : {};
    general.checked ? selectlist = generallist : {};
    listArray[listArray.length] = new lists(selectlist, inp.value, false);
    listArray[listArray.length - 1].show();
    idataSet();
    inp.value = "";
});
window.onload = () => {
    idataLoad();
};
setInterval(() => {
    idataSet();
    checkDWM();
}, 60000);
const devb = document.getElementById("devb");
devb === null || devb === void 0 ? void 0 : devb.addEventListener("click", () => {
});
