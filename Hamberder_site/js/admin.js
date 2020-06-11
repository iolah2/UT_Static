/*
A táblázat soraiban megváltoztatja a szerkesztés gomb kinézetét és kattintásra, valamint állítja a gomb statejét, hogy éppen
menteni vagy szerkeszteni akarunk
*/
function editButtonAppearance() {
    buttonState = this.getAttribute("value");

    if (buttonState == "0") {
        this.setAttribute("value", "1");
        this.setAttribute("class", "btn btn-success btn-rounded");
        this.innerHTML = '<i class="fas fa-check"></i>';
        editRows(this)
    } else if (buttonState == "1") {
        if (saveRows(this)) {
            this.setAttribute("value", "0");
            this.setAttribute("class", "btn btn-info btn-rounded");
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
    } else {return false}
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
    btnCell.innerHTML = '<div class="btn-group" role="group" aria-label="modButtons"><button class="btn btn-info btn-rounded" name="editBtn" type="button" value="0"><i class="fas fa-edit"></i></button> <button class="btn btn-danger btn-rounded" name="delbtn"><i class="fas fa-eraser"></i></button></div>';
    editDelBtnAddFunc();

    // sokkal szebb/jobb megoldás lenne, ha a function-t úgy adnám hozz, hogy adja át a (this) -t, mert úgy könnyebb utána dolgozni vele.
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
    } else {console.log("Törlés visszavonva")}

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
function initiateDataGet(userJSONdata = []) {
    fetchUserData("http://localhost:3000/users").
        then(data => {
            for (const [key, value] of Object.entries(data)) {

                tablePopulator(data[key]);
                userJSONdata.push(data[key]);

            }
            return userJSONdata;
        }).catch(err => {
            console.error(err)
        })
}

async function fetchUserData(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data
}


let userJSONdata = [];
window.addEventListener("load", editDelBtnAddFunc);
window.addEventListener("load", initiateDataGet(userJSONdata));