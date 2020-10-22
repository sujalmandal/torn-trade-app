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

export function getUpdatedRowDataWithProfit(rows,itemNamesList,priceMap){
    return rows.map((row)=>{
        if(itemNamesList.includes(row.name)){
            //actual market price
            var marketPrice=priceMap[row.name];
            row.mPrice=marketPrice;
            //price after taking profit
            row.actualPrice=marketPrice-((marketPrice*row.profitPercent)/100);
            //total price calculated with market price
            row.tPrice=row.qty*row.mPrice;
            //actual total price calculated after taking profit
            row.actualTotalPrice=row.qty*row.actualPrice;
        }
        return {...row};
    });
}

export function getTotalPriceWithProfit(rows,itemNamesList,priceMap){
    var totalPrice=0;
    var totalPriceAfterProfit=0;
    rows.forEach((row)=>{
        if(itemNamesList.includes(row.name)){
            totalPrice+=priceMap[row.name]*row.qty;
            totalPriceAfterProfit=totalPrice-((totalPrice*row.profitPercent)/100);
        }
    });
    return totalPriceAfterProfit;
}