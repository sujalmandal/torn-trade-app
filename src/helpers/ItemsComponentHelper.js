import { getEmptySentRow,getEmptyReceivedRow } from '../utils/ItemRowUtil'
import { 
    getUpdatedRowData,
    getTotalPrice,
    getTotalPriceWithProfit,
    getUpdatedRowDataWithProfit,
 } from '../utils/PriceCalculatorUtil'

/* methods common for both SentItemsComponent & ReceivedItemsComponent */

export function updateTypeAheadSelectedName(selectedItemName, rowId, componentContext) {
    var itemName = selectedItemName[0];
    componentContext.state.rows.forEach((row) => {
        if (row.id === rowId) {
            row.name = itemName;
            row.mPrice = 0;
            row.tPrice = 0;
            if(row.itemProfit){
                row.itemProfit=0;
            }
            if(row.actualPrice){
                row.actualPrice=0;
            }
            if(row.actualTotalPrice){
                row.actualTotalPrice=0;
            }
        }
    });

    if (componentContext.state.type === "RECEIVED") {
        componentContext.props.updateReceivedItemsData(
            componentContext.props.apiKey,
            itemName,
            componentContext.props.itemsStore,
            componentContext,
            //chance to update things once the asyc method 'updateReceivedItemsData' has finished
            () => {
                triggerReceivedItemsDataUpdates(componentContext);
            });
    }
    if (componentContext.state.type === "SENT") {
        componentContext.props.updateSentItemsData(
            componentContext.props.apiKey,
            itemName,
            componentContext.props.itemsStore,
            componentContext,
            //chance to update things once the asyc method 'updateReceivedItemsData' has finished
            () => {
                triggerSentItemsDataUpdates(componentContext);
            });
    }

}

/* methods exclusive to ReceivedItemsComponent */

export function addRowInReceivedItems(componentContext) {
    componentContext.state.rows.push(getEmptyReceivedRow())
    componentContext.forceUpdate();
    triggerReceivedItemsDataUpdates(componentContext);
}

export function removeRowFromReceivedItems(currentRow, componentContext) {
    componentContext.state.rows = componentContext.state.rows.filter((row) => {
        return row.id !== currentRow.id;
    });
    componentContext.forceUpdate();
    triggerReceivedItemsDataUpdates(componentContext);
}

export function updateNumericInputInReceivedItems(event, componentContext) {
    var fieldName = event.target.name.split("_")[0];
    var rowId = event.target.name.split("_")[1];
    var value = event.target.value;
    componentContext.state.rows.forEach((row) => {
        if (row.id === rowId) {
            row[fieldName] = value;
        }
    });
    componentContext.forceUpdate();
    triggerReceivedItemsDataUpdates(componentContext);
}

/* methods exclusive to SentItemsComponent */

export function addRowInSentItems(componentContext) {
    componentContext.state.rows.push(getEmptySentRow());
    componentContext.forceUpdate();
    triggerSentItemsDataUpdates(componentContext);
}

export function removeRowFromSentItems(currentRow, componentContext) {
    componentContext.state.rows = componentContext.state.rows.filter((row) => {
        return row.id !== currentRow.id;
    });
    componentContext.forceUpdate();
    triggerSentItemsDataUpdates(componentContext);
}

export function updateNumericInputInSentItems(event, componentContext) {
    var fieldName = event.target.name.split("_")[0];
    var rowId = event.target.name.split("_")[1];
    var value = event.target.value;
    componentContext.state.rows.forEach((row) => {
        if (row.id === rowId) {
            row[fieldName] = value;
        }
    });
    componentContext.forceUpdate();
    triggerSentItemsDataUpdates(componentContext);
}

//updates
export function triggerSentItemsDataUpdates(componentContext) {
    var updatedTotal = getTotalPrice(
        componentContext.state.rows,
        componentContext.props.itemNameList,
        componentContext.props.priceMap
    );
    var updatedRows = getUpdatedRowData(
        componentContext.state.rows,
        componentContext.props.itemNameList,
        componentContext.props.priceMap
    );
    //update the component's local variables that are mapped to the UI elements
    updateLocalState(componentContext, updatedRows, updatedTotal);
    //update the received items in redux's global store
    componentContext.props.pushSentItemDetails(updatedRows, updatedTotal);
    //update the summary details in redux's global store
    componentContext.props.pushTradeSummary(componentContext.props.received.totalActualPrice - updatedTotal);
}

export function triggerReceivedItemsDataUpdates(componentContext) {
    var updatedTotal = getTotalPrice(
        componentContext.state.rows,
        componentContext.props.itemNameList,
        componentContext.props.priceMap
    );
    var updatedTotalActual = getTotalPriceWithProfit(
        componentContext.state.rows,
        componentContext.props.itemNameList,
        componentContext.props.priceMap
    );
    var updatedRows = getUpdatedRowDataWithProfit(
        componentContext.state.rows,
        componentContext.props.itemNameList,
        componentContext.props.priceMap
    );
    //update the component's local variables that are mapped to the UI elements
    updateLocalState(componentContext, updatedRows,updatedTotal, updatedTotalActual);
    //update the received items in redux's global store
    componentContext.props.pushReceivedItemsDetail(updatedRows, updatedTotal, updatedTotalActual);
    //update the summary details in redux's global store
    componentContext.props.pushTradeSummary(updatedTotalActual - componentContext.props.sent.total);
}

function updateLocalState(componentContext, updatedRows, updatedTotal, totalPriceAfterProfit) {
    if(totalPriceAfterProfit){
        componentContext.setState({
            ...componentContext.state,
            totalActualPrice: totalPriceAfterProfit,
            totalPrice: updatedTotal,
            rows: updatedRows
        });
    }
    else{
        componentContext.setState({
            ...componentContext.state,
            totalPrice: updatedTotal,
            rows: updatedRows
        });
    }
    
}