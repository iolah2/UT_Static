function editButtonAppearance() {
    buttonState = this.getAttribute("value");

    if (buttonState == "0") {
        this.setAttribute("value", "1");
        this.setAttribute("class", "btn btn-success btn-rounded");
        this.innerHTML = '<i class="fas fa-check"></i>';
        editRows(this)
    } else if (buttonState == "1") {
        this.setAttribute("value", "0");
        this.setAttribute("class", "btn btn-info btn-rounded");
        this.innerHTML = '<i class="fas fa-edit"></i>';
        saveRows(this)
    }
}

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


function saveRows(saveBtn) {

    // if (tRow == null) {
    tRow = saveBtn.parentElement.parentElement.parentElement;
    // }

    let cells = tRow.children;
    let userData = {};

    for (let i = 0; i < cells.length; i++)
        if (cells[i].getAttribute("name") == "userName" || cells[i].getAttribute("name") == "userAge") {
            if (cells[i].getAttribute("name") == "userName") {
                userData["name"] = cells[i].firstElementChild.value;
            } else {
                userData["age"] = cells[i].firstElementChild.value;
            }
            value = cells[i].firstElementChild.value;
            cells[i].innerHTML = value;
        } else if (cells[i].getAttribute("name") == "userID") {
            userData["id"] = cells[i].innerHTML.trim();
        }

}

function newRawDefault() {
    let workField = document.getElementById("addNewRow");
    workField.firstElementChild.setAttribute("style", "display:initial");
    workField.querySelector(':nth-child(2)').remove();
}


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
        "onclick": "addData()"
    }, '<i class="fas fa-check"></i>');

}


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



function addData() {
    // ID-t a szervertől kellene kapni, a többi adat az inputboxokból jön

    let name = document.getElementById("newName").value;
    let age = document.getElementById("newAge").value;
    let data = { "userID": "5", "userName": name, "userAge": age };
    tablePopulator(data);
    newRawDefault();
}



function tablePopulator(data = null) {
    /* Accepts dictionary like data in the following format:
    {
        "userID" : "Integer",
        "userName" : "String",
        "userAge" : Integer
    }
    */

    let tbody = document.getElementById("userDataTbody");
    if (data == null) {
        data = {
            "userID": "5",
            "userName": "Matyi",
            "userAge": 15
        };

    }

    let newRow = document.createElement("tr");
    tbody.appendChild(newRow);

    for (const [key, value] of Object.entries(data)) {
        let newCell = document.createElement("td");
        newCell.setAttribute("name", key);
        newRow.appendChild(newCell);
        newCell.innerHTML = value;
    }

    let btnCell = document.createElement("td");
    newRow.appendChild(btnCell);
    btnCell.innerHTML = '<div class="btn-group" role="group" aria-label="modButtons"><button class="btn btn-info btn-rounded" name="editBtn" type="button" value="0"><i class="fas fa-edit"></i></button> <button class="btn btn-danger btn-rounded"><i class="fas fa-eraser"></i></button></div>';
    editDelBtnAddFunc();
}


function editDelBtnAddFunc() {
    let editButton = document.querySelectorAll("button[name='editBtn']");
    for (let i = 0; i < editButton.length; i++) {
        editButton[i].addEventListener("click", editButtonAppearance);
    }
}



function CheckIn(userJSONdata) {
    
    let fetchInit = {
        method: "GET",
        headers: new Headers(),
        mode: "cors",
        cache: "default"
    };

    const postPromise = fetch("http://localhost:3000/users", fetchInit);
    postPromise
        .then(resp => resp.json())
        .then(data => {
            for (const [key,value] of Object.entries(data)) {
                
                tablePopulator(data[key]);
                userJSONdata = FillOut(userJSONdata, data[key]);
            }
            return userJSONdata;
        })
        .catch(err => {
            console.log(err);
        })
}


function FillOut(userJSONdata, dataPoints) {
    userJSONdata.push(dataPoints);
    return userJSONdata;
}

function baseFill(userJSONdata) {
    console.log("ok")
    for (const [k, v] of Object.entries(userJSONdata)) {
            console.log("érték: ", v);
            tablePopulator(v);
        }
    }

let userJSONdata = []; 
window.addEventListener("load", editDelBtnAddFunc);
window.addEventListener("load", CheckIn(userJSONdata));
// window.addEventListener("load", baseFill(userJSONdata));

console.log(userJSONdata[0]);




