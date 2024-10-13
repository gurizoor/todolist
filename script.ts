
let inp = <HTMLInputElement>document.getElementById("inp");
let add = <HTMLButtonElement>document.getElementById("add");
let daylist = <HTMLDivElement>document.getElementById("daylist");
let weeklist = <HTMLDivElement>document.getElementById("weeklist");
let monthlist = <HTMLDivElement>document.getElementById("monthlist");
let day = <HTMLInputElement>document.getElementById("day");
let week = <HTMLInputElement>document.getElementById("week");
let month = <HTMLInputElement>document.getElementById("month");

let lsid: number = 0;
let listArray: lists[] = [];

// 
//===日付関係の処理===
// 

let today: Date = new Date();
let todayObj: { date: number, day: number, month: number, year: number } = {
    date: today.getDate(),
    day: today.getDay(),
    month: today.getMonth(),
    year: today.getFullYear()
}

let preDate = todayObj;
function checkDWM() {
    //日付が変わったら(preDateがtodayじゃない場合)チェックを外す
    if (
        (todayObj.date !== preDate.date) || 
        (todayObj.month !== preDate.month) || 
        (todayObj.year !== preDate.year)
    ) {
        listArray.map(list => {
            if (list.dwmId == "daylist") list.i.checked = false;
        });
    }
    //月曜を跨いだらチェックを外す
    if (
        (preDate.day === 0 && todayObj.day === 1) ||
        (todayObj.day < preDate.day) ||
        (todayObj.date >= preDate.date + 7) ||
        (todayObj.month !== preDate.month) ||
        (todayObj.year !== preDate.year)
    ) {
        listArray.map(list => {
            if (list.dwmId == "weeklist") list.i.checked = false;
        });
    }
    //月が変わったらチェックを外す
    if (
        (todayObj.month !== preDate.month) || 
        (todayObj.year !== preDate.year)
    ) {
        listArray.map(list => {
            if (list.dwmId == "monthlist") list.i.checked = false;
        });
    }
}

// 
//===ローカルストレージ===
// 

function dataSet() {
    let dataToSet = listArray.map(list => ({
        dwmId: list.dwmId,
        l: list.l.innerHTML,
        i: list.i.checked
    }))
    localStorage.setItem("listArray", JSON.stringify(dataToSet));
    localStorage.setItem("preDate", JSON.stringify(todayObj));
    //console.log("dataSet")
}

function dataLoad(): lists[] {
    //console.log("dataLoad")
    let defaultPreDate = { date: today.getDate(), day: today.getDay(), month: today.getMonth(), year: today.getFullYear() };
    preDate = JSON.parse(localStorage.getItem("preDate") || JSON.stringify(defaultPreDate));

    let retrievedData = JSON.parse(localStorage.getItem("listArray") || "[]");
    return retrievedData.map((data: any) => {
        let listElement = document.getElementById(data.dwmId) as HTMLDivElement;
        if (listElement) {
            return new lists(listElement, data.l, data.i);
        }
    }).filter((item: any) => item !== null);
    
}


//
//===リストクラスはじめ===
//

class lists {
    private d: HTMLDivElement;
    public i: HTMLInputElement;
    public l: HTMLLabelElement;
    private b: HTMLButtonElement;
    private dwm: HTMLDivElement;


    private num: number;
    public dwmId: string;

    constructor(list: HTMLDivElement, showtext: string, prechecked: boolean) {
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
        this.i.className = "ilist"

        this.l.innerHTML = showtext + " ";//inp.value+" ";
        this.l.htmlFor = "ch" + this.num;
        this.l.className = "llist"

        this.d.className = "dlist";

        this.b.type = "button";
        this.b.textContent = "x";
        this.b.className = "blist"

        lsid += 1;

        this.b.addEventListener("click", () => {
            this.remove();
        })
    }

    public show() {
        //console.log("show")
        this.dwm?.appendChild(this.d);
        this.d?.appendChild(this.i);
        this.d?.appendChild(this.l);
        this.d?.appendChild(this.b);
    }

    public remove() {
        //console.log("x was clicked");
        this.d.remove();
        this.i.remove();
        this.l.remove();
        this.b.remove();

        listArray = listArray.filter(list => list !== this);
    }

    public static show() {
        for (let i = 0; i < listArray.length; i++) {
            listArray[i].show();
            //console.log(i);
        }
    }
}
//
//===リストクラスおわり===
//

//
//===クリック処理===
//

add?.addEventListener("click", () => {
    let selectlist: HTMLDivElement = daylist;
    day.checked ? selectlist = daylist : {};
    week.checked ? selectlist = weeklist : {};
    month.checked ? selectlist = monthlist : {};
    listArray[listArray.length] = new lists(selectlist, inp.value, false);
    listArray[listArray.length - 1].show();
    inp.value = "";
    //console.log("click")
})

//
//===起動・終了時の処理===
//

window.onload = () => {
    //console.log("onload")
    listArray = dataLoad();
    lists.show();
    checkDWM();
}

window.addEventListener("beforeunload", () => {
    dataSet();
})

//
//development
//
const devb = document.getElementById("devb");
devb?.addEventListener("click", () => {

    // console.log(preDate);
    // console.log("日にち: " + new Date().getDate());
    // console.log("曜日" + new Date().getDay());
    // console.log("月: " + (new Date().getMonth() + 1));
    // console.log(listArray.map(ls => ls.dwmId));
    // console.log(lsid);
    // console.log(listArray);
    // console.log(dataLoad());
    // console.log(listArray);
    // listArray = [];
    // console.log(day.checked);
    // console.log(week.checked);
    // console.log(month.checked);
})
