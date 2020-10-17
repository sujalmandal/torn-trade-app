export function getUpdatedRowData(rows,priceMap){
    return rows.map((row)=>{
        //update mPrice
        row.mPrice=priceMap[row.name];
        //update tPrice
        row.tPrice=row.qty*row.mPrice;
        return {...row};
    });
}

export function getTotalPrice(rows,priceMap){
    var totalPrice=0;
    rows.forEach((row)=>{
        totalPrice+=priceMap[row.name]*row.qty;
    });
    return totalPrice;
}