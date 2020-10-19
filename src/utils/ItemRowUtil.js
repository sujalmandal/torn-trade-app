export function areRowsEmpty(rows) {
    var isEmpty = false;
    rows.forEach(row => {
        if (isCurrentRowEmpty(row)) {
            isEmpty = true;
            return;
        }
    });
    return isEmpty;
}

export function refinedOptions(props,rows){
    if(props.itemNameList===null){
        return [];
    }
    var refinedList=props.itemNameList.filter( item =>{
        var itemAlreadySelected=false;
        rows.forEach((row)=>{
            if(row.name===item){
                itemAlreadySelected=true;
               return; 
            }
        });
        return !itemAlreadySelected;
    });
    return refinedList;
}

export function sentAndReceivedItemsEmpty(props){
    return   isItemListNotInitialised(props)
            || areRowsEmpty(props.sent.items) 
            || areRowsEmpty(props.received.items);
}

export function isCurrentRowEmpty(row){
    return row.name === "" || row.mPrice===0 || row.qty===0;
}

export function isItemListNotInitialised(props){
    return props.itemsNameList === null;
}