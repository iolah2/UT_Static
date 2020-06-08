

function validateform() {
    let price = 1000;
    let amountInput = document.querySelector("input[name='amount']");
    let topInput = document.querySelector("input[name='TOP']");
    let showAmount = document.querySelector("span.show-amount");
    let OrderCost = document.querySelector("span.OrderCost");
    let DeliveryCost = document.querySelector("span.DeliveryCost");
    let amount = parseInt(amountInput.value) * price;
    let amountFin;
    
    amount = isNaN(amount) ? 0 : amount;

    if (amount < 5000) {
        amountFin = amount + 500;
        OrderCost.innerHTML = amount;
        DeliveryCost.innerHTML = "500";
        
        // OrderCost.removeAttribute("hidden"); 
        // DeliveryCost.removeAttribute("hidden"); 
    } else {
        amountFin = amount;
        OrderCost.innerHTML = amount;
        DeliveryCost.innerHTML = "0";
        // OrderCost.hidden = true; 
        // DeliveryCost.hidden = true;  
    }
    
    showAmount.innerHTML = null;
    showAmount.innerHTML = amountFin;
    
}

var Temperatures = [-5, 0, 10, 11, 18, 28, 37];

function weatherApp() {
    let currTemp 
    const daysofWeek = document.getElementById("dayOfWeek").value;
    const tempShow =document.querySelector("span.temp-show");
    if (!(isNaN(daysofWeek))) {
        currTemp = Temperatures[daysofWeek];
        tempShow.innerHTML = currTemp.toString();
    } else {
        let currDate = new Date();
        let today = currDate.getDay();
        currTemp = Temperatures[today-1];
        tempShow.innerHTML = currTemp.toString();
    }

    selectDayOffer(currTemp);
}

function selectDayOffer(temp) {
    let tempRanges = [0, 15, 20, 25];
    let i = 0;
    while (temp > tempRanges[i]){
        i++;
    }
    let dayOffers = ["Forró csoki", "Meleg tea", "Finom süti", "Fagyi", "Jéghideg limonádé"];
    const offerShow =document.querySelector("span.offer-show");
    offerShow.innerHTML = dayOffers[i]
}


// document.querySelector("body").addEventListener("mouseout", function() {
//     alert("Ne menj!!!")
// })

