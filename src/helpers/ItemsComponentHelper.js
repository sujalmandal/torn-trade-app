import { IdGenerator } from '../utils/IdGeneratorUtil'

/* methods common for both SentItemsComponent & ReceivedItemsComponent */

export function updateTypeAheadSelectedName(selectedItemName, rowId, componentContext) {
    var itemName = selectedItemName[0];
    componentContext.state.rows.forEach((row) => {
        if (row.id === rowId) {
            row.name = itemName;
            row.mPrice=0;
            row.tPrice=0;
        }
    });
    componentContext.state.forceRecalculation = true;
    componentContext.props.fetchItemPrice(
        componentContext.props.apiKey, 
        itemName, 
        componentContext.props.itemsStore,
        componentContext);
}

/* methods exclusive to ReceivedItemsComponent */

export function addRowInReceivedItems(componentContext){
    componentContext.state.rows.push({
        id: IdGenerator(),
        name: "",
        qty: 0,
        mPrice: 0,
        tPrice: 0
    })
    componentContext.forceUpdate();
    componentContext.props.pushReceivedItemsDetail(componentContext.state.rows,componentContext.state.totalPrice);
}

export function removeRowFromReceivedItems (currentRow,componentContext) {
    componentContext.state.rows = componentContext.state.rows.filter((row) => {
        return row.id !== currentRow.id;
    });
    componentContext.state.forceRecalculation=true;
    componentContext.forceUpdate();
    componentContext.props.pushReceivedItemsDetail(componentContext.state.rows,componentContext.state.totalPrice);
}

export function updateQtyInReceivedItems(event,componentContext){
    var fieldName = event.target.name.split("_")[0];
    var rowId = event.target.name.split("_")[1];
    var value = event.target.value;
    componentContext.state.rows.forEach((row) => {
        if (row.id === rowId) {
            row[fieldName] = value;
        }
    });
    componentContext.state.forceRecalculation=true;
    componentContext.forceUpdate();
    componentContext.props.pushReceivedItemsDetail(componentContext.state.rows,componentContext.state.totalPrice);
}

/* methods exclusive to SentItemsComponent */

export function addRowInSentItems(componentContext){
    componentContext.state.rows.push({
        id: IdGenerator(),
        name: "",
        qty: 0,
        mPrice: 0,
        tPrice: 0
    })
    componentContext.forceUpdate();
    componentContext.props.pushSentItemDetails(componentContext.state.rows, componentContext.state.totalPrice);
}

export function removeRowFromSentItems(currentRow,componentContext){
    componentContext.state.rows = componentContext.state.rows.filter((row) => {
        return row.id !== currentRow.id;
    });
    componentContext.state.forceRecalculation = true;
    componentContext.forceUpdate();
    componentContext.props.pushSentItemDetails(componentContext.state.rows, componentContext.state.totalPrice);
}

export function updateQtyInSentItems(event,componentContext){
    var fieldName = event.target.name.split("_")[0];
    var rowId = event.target.name.split("_")[1];
    var value = event.target.value;
    componentContext.state.rows.forEach((row) => {
        if (row.id === rowId) {
            row[fieldName] = value;
        }
    });
    componentContext.state.forceRecalculation = true;
    componentContext.forceUpdate();
    componentContext.props.pushSentItemDetails(componentContext.state.rows, componentContext.state.totalPrice);
}