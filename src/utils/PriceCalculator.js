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