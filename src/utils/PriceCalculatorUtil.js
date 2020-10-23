
export function getUpdatedRowData(rows,itemNamesList,priceMap){
    return rows.map((row)=>{
        if(itemNamesList.includes(row.name)){
            //update mPrice
            row.mPrice=priceMap[row.name];
            //update tPrice
            row.tPrice=row.qty*row.mPrice;
        }
        return {...row};
    });
}

export function getTotalPrice(rows,itemNamesList,priceMap){
    var totalPrice=0;
    rows.forEach((row)=>{
        if(itemNamesList.includes(row.name)){
            totalPrice+=priceMap[row.name]*row.qty;
        }
    });
    return totalPrice;
}

export function getUpdatedRowDataWithProfit(rows,itemNamesList,priceMap,changedFieldName){
    return rows.map((row)=>{
        if(itemNamesList.includes(row.name)){
            //actual market price
            var marketPrice=priceMap[row.name];
            row.mPrice=marketPrice;
            //price after taking profit based on either 'actualPrice' or 'profit %', which is the default option
            if(changedFieldName && changedFieldName.includes("actualPrice")){
                row.profitPercent=parseFloat((((marketPrice-parseFloat(row.actualPrice))*100)/marketPrice).toFixed(3));
            }
            else{
                row.actualPrice=(marketPrice-((marketPrice*(parseFloat(row.profitPercent)).toFixed(3))/100)).toFixed();
            }
            //total price calculated with market price
            row.tPrice=row.qty*row.mPrice;
            //actual total price calculated after taking profit
            row.actualTotalPrice=row.qty*row.actualPrice;
        }
        return {...row};
    });
}

export function getTotalPriceWithProfit(rows,itemNamesList,priceMap,changedFieldName){
    var totalPriceAfterProfit=0;
    rows.forEach((row)=>{
        if(itemNamesList.includes(row.name)){
            var marketPrice=priceMap[row.name];
            if(changedFieldName && changedFieldName.includes("actualPrice")){
                totalPriceAfterProfit+=row.actualPrice*row.qty;
            }
            else{
                totalPriceAfterProfit+=marketPrice-((marketPrice*(row.profitPercent)/100))*row.qty;
            }
        }
    });
    return totalPriceAfterProfit.toFixed();
}