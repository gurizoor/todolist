
let inp = <HTMLInputElement>document.getElementById("inp");
let add = <HTMLButtonElement>document.getElementById("add");
let daylist = <HTMLDivElement>document.getElementById("daylist");
let weeklist = <HTMLDivElement>document.getElementById("weeklist");
let monthlist = <HTMLDivElement>document.getElementById("monthlist");
let generallist = <HTMLDivElement>document.getElementById("generallist");
let day = <HTMLInputElement>document.getElementById("day");
let week = <HTMLInputElement>document.getElementById("week");
let month = <HTMLInputElement>document.getElementById("month");
let general = <HTMLInputElement>document.getElementById("general");

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
//===indexeddb===
// 

let db: IDBDatabase;
const dbName: string = "listArrayDB";
const storeName: string = "listStore";

function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request: IDBOpenDBRequest = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = request.result;
            if (!db.objectStoreNames.contains(storeName)) {
                // キーパスを設定してオブジェクトストアを作成
                db.createObjectStore(storeName, { keyPath: "id" });
            }
        };

        request.onsuccess = (event) => {
            db = request.result;
            resolve(db);
        };

        request.onerror = (event) => {
            console.error("IndexedDBのオープンエラー", event);
            reject(event);
        };
    });
}


async function idataSet(): Promise<void> {
    const db = await openDatabase();
    const transaction: IDBTransaction = db.transaction(storeName, "readwrite");
    const store: IDBObjectStore = transaction.objectStore(storeName);

    // 保存するデータ
    const data = {
        id: "listAndDate",   // 固定キーでデータを保存
        listArray: lists.objArr(),
        preDate: todayObj
    };

    // データを保存
    const request: IDBRequest = store.put(data);
    request.onsuccess = () => {
        //console.log("データがIndexedDBに保存されました");
    };

    request.onerror = (e) => {
        console.error("データ保存に失敗しました", e);
    };
}


async function idataLoad(): Promise<void> {
    const db = await openDatabase();
    const transaction: IDBTransaction = db.transaction(storeName, "readonly");
    const store: IDBObjectStore = transaction.objectStore(storeName);

    const request: IDBRequest<any> = store.get("listAndDate");
    request.onsuccess = () => {
        if (request.result) {
            const { listArray: storedListArray, preDate: storedPreDate } = request.result;

            // listArrayとpreDateを復元
            lists.objToList(storedListArray);
            preDate = storedPreDate;
            //console.log("データが読み込まれました", storedListArray, storedPreDate);

            // 読み込んだリストを表示
            lists.show();
            checkDWM();
        } else {
            console.log("IndexedDBに保存されたデータがありません");
        }
    };

    request.onerror = (e) => {
        console.error("データ読み込みに失敗しました", e);
    };
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

    public static objArr(): {
        dwmId: string;
        l: string;
        i: boolean;
    }[] {
        return listArray.map(list => (
            {
                dwmId: list.dwmId,
                l: list.l.innerHTML,
                i: list.i.checked

            }
        ))
    }
    public static objToList(listobj: {
        dwmId: string,
        l: string,
        i: boolean
    }[]) {
        listArray = listobj.map(list => {
            let listelement = document.getElementById(list.dwmId) as HTMLDivElement;
            return new lists(listelement, list.l, list.i);
        }).filter((item: any):item is lists => item !== null);
    }
}
//
//===リストクラスおわり===
//

//
//===クリック処理===
//

add?.addEventListener("click", () => {
    let selectlist: HTMLDivElement = generallist;
    day.checked ? selectlist = daylist : {};
    week.checked ? selectlist = weeklist : {};
    month.checked ? selectlist = monthlist : {};
    general.checked ? selectlist = generallist : {};
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
    idataLoad();
}

window.addEventListener("beforeunload", () => {
    idataSet();
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
