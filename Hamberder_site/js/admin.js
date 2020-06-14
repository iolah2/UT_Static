/*
A táblázat soraiban megváltoztatja a szerkesztés gomb kinézetét és kattintásra, valamint állítja a gomb statejét, hogy éppen
menteni vagy szerkeszteni akarunk
*/
function editButtonAppearance() {
    buttonState = this.getAttribute("value");

    if (buttonState == "0") {
        this.setAttribute("value", "1");
        this.setAttribute("class", "btn btn-success btn-rounded btn-sm");
        this.innerHTML = '<i class="fas fa-check"></i>';
        editRows(this)
    } else if (buttonState == "1") {
        if (saveRows(this)) {
            this.setAttribute("value", "0");
            this.setAttribute("class", "btn btn-info btn-rounded btn-sm");
            this.innerHTML = '<i class="fas fa-edit"></i>';
        }
    }
}

/*
Létrehozza az input mezőket a szerkesztés gomb megnyomását követően, valamint feltölti őket az eredeti adatokkal
*/
function editRows(editBtn) {
    let tRow = editBtn.parentElement.parentElement.parentElement;
    let cells = tRow.children;
    let innervalue = "";
    let temp = "";
    for (let i = 0; i < cells.length; i++)
        if (cells[i].getAttribute("name") == "userName" || cells[i].getAttribute("name") == "userAge") {
            innervalue = cells[i].innerHTML.trim();
            if (Number.isInteger(parseInt(innervalue))) {
                cells[i].innerHTML = `<input id="numWorkOn" class="form-control form-control-sm" max="120" type="number" min="0" placeholder="${innervalue}"></input>`;
                temp = document.getElementById("numWorkOn");
                temp.value = innervalue;
            } else {
                cells[i].innerHTML = `<input id="nameWorkOn" class="form-control form-control-sm" maxlength="25" type="text" placeholder="${innervalue}"></input>`;
                temp = document.getElementById("nameWorkOn");
                temp.value = innervalue;
            }
        }
}

/*
Begyűjti az id, userName, userAge adatokat a táblázat soraiból, hogy lehessen rajtuk dolgozni
*/
function getDataFromRow(tRow, userData, mode) {
    let cells = tRow.children;

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].getAttribute("name") == "userName" || cells[i].getAttribute("name") == "userAge") {
            if (cells[i].getAttribute("name") == "userName") {
                if (mode == "change") {
                    userData["userName"] = cells[i].firstElementChild.value; //value-ja csak az inputnak van
                } else {
                    userData["userName"] = cells[i].innerHTML.trim();
                }
            } else {
                if (mode == "change") {
                    userData["userAge"] = parseInt(cells[i].firstElementChild.value);
                } else {
                    userData["userAge"] = parseInt(cells[i].innerHTML.trim());
                }

            }
            // value = cells[i].firstElementChild.value;
        } else if (cells[i].getAttribute("name") == "userID") {
            userData["id"] = parseInt(cells[i].innerHTML.trim());
        }
    }

}

/*
Elmenti a szerkesztett sor adatait és elküldi az adatbázisba
*/
function saveRows(saveBtn) {

    tRow = saveBtn.parentElement.parentElement.parentElement;
    let userData = {};
    getDataFromRow(tRow, userData, "change");

    if (NewUserFormValidation(userData["userName"], userData["userAge"])) {
        let fetchOptions = {
            method: "PUT",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(userData)
        };
        fetch(`http://localhost:3000/users/${userData["id"]}`, fetchOptions).
            then(resp => resp.json()).
            then(data => console.log(data)).
            catch(err => console.error(err));
        tRow.querySelector('td[name="userName"]').innerHTML = userData["userName"];
        tRow.querySelector('td[name="userAge"]').innerHTML = userData["userAge"];
        return true
    } else { return false }
}

/*
Visszaállítja az új sor hozzáadása sor eredeti állapotát
*/
function newRawDefault() {
    let workField = document.getElementById("addNewRow");
    workField.firstElementChild.setAttribute("style", "display:initial");
    workField.querySelector(':nth-child(2)').remove();
}

/*
Létrehozza az inputfieldeket, hogy új adatokat lehessen bevinni
*/
function addNewRowInterface() {
    let workField = document.getElementById("addNewRow");
    workField.firstElementChild.setAttribute("style", "display:none");

    let form = newHtmlElementCreator(workField, "form");

    let mainDiv = newHtmlElementCreator(form, "div", { "class": "form-row text-center" });
    let nextDiv = newHtmlElementCreator(mainDiv, "div", { "class": "form-group col-md-6" });
    newHtmlElementCreator(nextDiv, "input", {
        "type": "text",
        "class": "form-control",
        "id": "newName",
        "placeholder": "Add meg a nevet",
        "maxlength": "25"
    });

    let nextDiv2 = newHtmlElementCreator(mainDiv, "div", { "class": "form-group col-md-3" });
    newHtmlElementCreator(nextDiv2, "input", {
        "type": "number",
        "class": "form-control",
        "id": "newAge",
        "placeholder": "Kor",
        "min": 0,
        "max": 120
    });
    let nextDiv3 = newHtmlElementCreator(mainDiv, "div", { "class": "form-group col-md-3" });
    newHtmlElementCreator(nextDiv3, "button", {
        "class": "btn btn-success btn-rounded btn-block",
        "name": "addNew",
        "type": "button",
        "onclick": "addData(this)"
    }, '<i class="fas fa-check"></i>');

}

/*
Elmenti az adatbázisba az új sorban felvett adatokat
*/
function addData(btn) {
    let newData = {};
    let userName = document.getElementById("newName").value;
    let userAge = parseInt(document.getElementById("newAge").value);

    if (NewUserFormValidation(userName, userAge)) {
        newData["userName"] = userName;
        newData["userAge"] = userAge;
        let fetchOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(newData)
        };
        fetch("http://localhost:3000/users", fetchOptions).
            then(resp => resp.JSON()).
            then(data => console.log(data)).
            catch(err => console.error(err));
    }
    newRawDefault()

}

/*
Ellenőrzi, hogy a módosítandó, felveendő név és kor megfelel-e a feltételeknek 
*/
function NewUserFormValidation(name, age) {

    if ((name == "") || (typeof (name) != "string") || !isNaN(parseInt(name)) || name.length < 3) {
        alert("A név mező értéke nem megfelelő! Kérlek, javítsd!");
        return false;
    } else if ((typeof (age) != "number") || (age > 120) || (age < 0) || (isNaN(age))) {
        alert("A kor mező értéke nem megfelelő! Kérlek, javítsd!");
        return false;
    } else {
        return true
    }

}

/*
Feltölti a táblázatot a felhasználók adataival
*/
function tablePopulator(data = null) {
    /* Accepts dictionary like data in the following format:
    {
        "userID" : "Integer",
        "userName" : "String",
        "userAge" : Integer
    }
    */

    let tbody = document.getElementById("userDataTbody");

    let newRow = document.createElement("tr");
    tbody.appendChild(newRow);
    let keys = ["id", "userName", "userAge"];



    for (const k of keys) {

        let newCell = document.createElement("td");
        if (k == "id") {
            newCell.setAttribute("name", "userID");
            newCell.innerHTML = data[k];
        } else {
            newCell.setAttribute("name", k);
            newCell.innerHTML = data[k];
        }
        newRow.appendChild(newCell);
    }

    let btnCell = document.createElement("td");
    newRow.appendChild(btnCell);
    btnCell.innerHTML = '<div class="btn-group" role="group" aria-label="modButtons"><button class="btn btn-info btn-rounded btn-sm" name="editBtn" type="button" value="0"><i class="fas fa-edit"></i></button> <button class="btn btn-danger btn-rounded btn-sm" name="delbtn"><i class="fas fa-eraser"></i></button></div>';
    editDelBtnAddFunc();

    // sokkal szebb/jobb megoldás lenne, ha a function-t úgy adnám hozz, hogy adja át a (this) -t, mert úgy könnyebb utána dolgozni vele.
}


function clearTable() {
    document.getElementById("userDataTbody").innerHTML = "";
}

/*
Hozzáadja a táblázat soraiban a gombokhoz a funkciókat
*/
function editDelBtnAddFunc() {
    let editButton = document.querySelectorAll("button[name='editBtn']");
    let delButton = document.querySelectorAll("button[name='delbtn']");
    for (let i = 0; i < editButton.length; i++) {
        editButton[i].addEventListener("click", editButtonAppearance);
    }
    for (del of delButton) {
        del.addEventListener("click", delRow, this);
    }
}

/*
Törli a táblázat adott sorát és az adatokat az adatbázisból
*/
function delRow(btn) {
    if (btn.target.parentElement.parentElement.parentElement.tagName == "TR") {
        tRow = btn.target.parentElement.parentElement.parentElement;
    } else {
        tRow = btn.target.parentElement.parentElement.parentElement.parentElement
    }


    let userData = {};
    getDataFromRow(tRow, userData, "del");
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify(userData)
    };

    if (confirm("Biztosan törölni akarod a felhasználót? A törlés nem visszavonható!")) {
        fetch(`http://localhost:3000/users/${userData["id"]}`, fetchOptions).
            then(resp => resp.JSON()).
            then(data => console.log(data)).
            catch(err => console.error(err));
    } else { console.log("Törlés visszavonva") }

}


/*
lehetővé teszi, hogy bármilyen HTML elemet gyorsan létre lehessen hozni, megadott értékkel és attribútumokkal, végül hozzácsatolja
egy szülő elemhez
*/
function newHtmlElementCreator(parent, newElement, attr = null, innerValue = null) {
    /* 
    parent = akihez csatolom
    newElement = a létrehozandó tag
    attr = dict az értékekkel attribútum : érték formában
    innerValue = html belső értéke
    */

    let newTag = document.createElement(newElement);
    if (attr != null) {
        for (const [key, value] of Object.entries(attr)) {
            newTag.setAttribute(key, value);
        }
    }
    if (innerValue != null) {
        newTag.innerHTML = innerValue;
    }
    parent.appendChild(newTag);
    return newTag;
}


/*
Az oldal betöltésekor összegyűjti a felhasználók adatait
*/
function initiateDataGet(userJSONdata = [], intitialPageNum) {
    fetchUserData(`http://localhost:3000/users/?_start=${intitialPageNum * 10}&_end=${(intitialPageNum * 10) + 10}`).
        then(data => {
            let tableData;
            for (const [k, v] of Object.entries(data)) {
                if (k == "data") {
                    tableData = v;
                } else {
                    let pageNum = Math.ceil(v / 10)
                    if (pageNum > 3) {
                        CreatePages(3, intitialPageNum+1)
                    } else {CreatePages(pageNum, intitialPageNum+1);}
                    maxPageLength = pageNum;
                }
            }
            clearTable();
            for (const [key, value] of Object.entries(tableData)) {
                tablePopulator(tableData[key]);
                userJSONdata.push(tableData[key]);

            }
            return userJSONdata;
        }).catch(err => {
            console.error(err)
        })
}


/* Létrehozza az oldalszámozást a táblázat alatt */
function CreatePages(pageNum = 0, active = 1) {
    let navDiv = document.getElementById("Pages");
    if (navDiv.innerHTML.trim() == "") {
        let nav = newHtmlElementCreator(navDiv, "nav", { "aria-label": "..." });
        let ul = newHtmlElementCreator(nav, "ul", { "class": "pagination justify-content-center" });
        let left = newHtmlElementCreator(ul, "li", { "class": "page-item disabled", "name": "LeftShifter" });
        
        newHtmlElementCreator(left, "button", { "class": "page-link", "onclick": "ShiftPageLeft(this)", "value": -1 }, '<i class="fas fa-angle-double-left"></i>')
        
        CreatePageNumbers(ul, pageNum, active)
        let right = newHtmlElementCreator(ul, "li", { "class": "page-item", "name": "RightShifter" });
        newHtmlElementCreator(right, "button", { "class": "page-link", "onclick": "shiftPageRight(this)", "value": "+1" }, '<i class="fas fa-angle-double-right"></i>')
    } /*innen új*/else {
        let ul = navDiv.querySelector("ul");
        ul.innerHTML = "";
        console.log(active)
        if (active > 1) {
            let left = newHtmlElementCreator(ul, "li", { "class": "page-item", "name": "LeftShifter" });
            newHtmlElementCreator(left, "button", { "class": "page-link", "onclick": "ShiftPageLeft(this)", "value": -1 }, '<i class="fas fa-angle-double-left"></i>')
        } else {
            let left = newHtmlElementCreator(ul, "li", { "class": "page-item disabled", "name": "LeftShifter" });
            newHtmlElementCreator(left, "button", { "class": "page-link", "onclick": "ShiftPageLeft(this)", "value": -1 }, '<i class="fas fa-angle-double-left"></i>')
        }

        if (active-1 == 0) {
            CreatePageNumbers(ul, active+2, active);
        } else if (active+1 < maxPageLength)  {            
            CreatePageNumbers(ul, active+1, active, active-1);
        } else {
            CreatePageNumbers(ul, maxPageLength, active, active-1);
        }

        if (active == maxPageLength) {
            let right = newHtmlElementCreator(ul, "li", { "class": "page-item disabled", "name": "RightShifter" });
            newHtmlElementCreator(right, "button", { "class": "page-link", "onclick": "shiftPageRight(this)", "value": "+1" }, '<i class="fas fa-angle-double-right"></i>')
        } else {
            let right = newHtmlElementCreator(ul, "li", { "class": "page-item", "name": "RightShifter" });
            newHtmlElementCreator(right, "button", { "class": "page-link", "onclick": "shiftPageRight(this)", "value": "+1" }, '<i class="fas fa-angle-double-right"></i>')
        }
    }
}

function CreatePageNumbers(parent=null, pageNum, active, startPage=1) {
    for (let i = startPage; i <= pageNum; i++) {
        if (i == active) {
            let li = newHtmlElementCreator(parent, "li", { "class": "page-item active", "name": "PageElement" });
            let btn = newHtmlElementCreator(li, "button", { "class": "page-link", "onclick": "ShowTableData(this)", "value": i - 1 }, i)
        } else {
            let li = newHtmlElementCreator(parent, "li", { "class": "page-item", "name": "PageElement" });
            let btn = newHtmlElementCreator(li, "button", { "class": "page-link", "onclick": "ShowTableData(this)", "value": i - 1 }, i)
        }
    }
}

function shiftPageRight(btn) {
    // jobbra tudj lapozni, a gomb aktív státusza változzon, töltődjön a tábla
    let prevActiveButton = btn.parentElement.parentElement.querySelector("li[class='page-item active']");
    prevActiveButton.setAttribute("class", "page-item");
    let nextPageToShow = parseInt(prevActiveButton.firstElementChild.value) + 1;
    initiateDataGet([], nextPageToShow);
}

function ShiftPageLeft(btn) {
    // balra tudj lapozni, a gomb aktív státusza változzon, töltődjön a tábla
    let prevActiveButton = btn.parentElement.parentElement.querySelector("li[class='page-item active']");
    prevActiveButton.setAttribute("class", "page-item");
    let nextPageToShow = parseInt(prevActiveButton.firstElementChild.value) -1;
    initiateDataGet([], nextPageToShow);
}


function upgradePages(initPageNum, EndPageNum) {
    let PageButtons = document.querySelectorAll("li[name='PageElement']");
    if (EndPageNum - initPageNum == 2) {
        for (let i = 0; i < 3; i++) {
            setPageBtnStatus(PageButtons[i].firstElementChild, { "value": initPageNum + i - 1 }, initPageNum + i);
        }
    } else if (EndPageNum - initPageNum == 1) {
        for (let i = 0; i < 2; i++) {
            setPageBtnStatus(PageButtons[i].firstElementChild, { "value": initPageNum + i - 1 }, initPageNum + i);
        } 
        setPageBtnStatus(PageButtons[2], {"class" : "page-item disabled"});
        setPageBtnStatus(PageButtons[2].firstElementChild, {"style" : "color:white"}, "0");
    } else {
        setPageBtnStatus(PageButtons[0].firstElementChild, { "value": initPageNum + 0 - 1 }, initPageNum + 0);

        setPageBtnStatus(PageButtons[1], {"class" : "page-item disabled"});
        setPageBtnStatus(PageButtons[1].firstElementChild, {"style" : "color:white;"}, "0");
        setPageBtnStatus(PageButtons[2], {"class" : "page-item disabled"});
        setPageBtnStatus(PageButtons[2].firstElementChild, {"style" : "color:white;"}, "0");
    }
}

function setPageBtnStatus(btn, attribute = null, innerValue) {
    if (attribute != null) {
        for (const [key, value] of Object.entries(attribute)) {
            btn.setAttribute(key, value);
        }
    }
    if (innerValue != null) {
        btn.innerHTML = innerValue;
    }
}


function ShowTableData(btn) {
    initiateDataGet([], parseInt(btn.value));
    for (li of btn.parentElement.parentElement.children) {
        if (li.getAttribute("class") == "page-item active") {
            li.setAttribute("class", "page-item")
        }
    }
    if (btn.parentElement.getAttribute("class") == "page-item") {
        btn.parentElement.setAttribute("class", "page-item active")
    }
    if (parseInt(btn.value) + 1 == maxPageLength) {
        btn.parentElement.parentElement.querySelector("li[name='RightShifter']").setAttribute("class", "page-item disabled");
    }
}

async function fetchUserData(url) {
    let dataLength;
    let response = await fetch(url);
    let data = await response.json();
    for (const [key, value] of response.headers.entries()) {
        if (key == "x-total-count") {
            dataLength = value;
        }
    }
    temp = {};
    temp["data"] = data;
    temp["length"] = dataLength;
    return temp
}

var maxPageLength;
let userJSONdata = [];
window.addEventListener("load", editDelBtnAddFunc);
window.addEventListener("load", initiateDataGet(userJSONdata, 0));
