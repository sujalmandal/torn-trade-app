import { getEmptySentRow, getEmptyReceivedRow } from '../utils/ItemRowUtil'
import {
    getUpdatedRowData,
    getTotalPrice,
    getTotalPriceWithProfit,
    getUpdatedRowDataWithProfit,
} from '../utils/PriceCalculatorUtil'

/* methods common for both SentItemsComponent & ReceivedItemsComponent */


export function updateCash(componentContext, cashValue) {
    componentContext.setState({
        ...componentContext.state,
        cash: parseInt(cashValue)
    }, () => {
        if (componentContext.state.type === "RECEIVED") {
            triggerReceivedItemsDataUpdates(componentContext);
        }
        if (componentContext.state.type === "SENT") {
            triggerSentItemsDataUpdates(componentContext);
        }
    });
}

export function updateTypeAheadSelectedName(selectedItemName, rowId, componentContext) {
    var itemName = selectedItemName[0];
    componentContext.state.rows.forEach((row) => {
        if (row.id === rowId) {
            row.name = itemName;
            row.mPrice = 0;
            row.tPrice = 0;
            if (row.itemProfit) {
                row.itemProfit = 0;
            }
            if (row.actualPrice) {
                row.actualPrice = 0;
            }
            if (row.actualTotalPrice) {
                row.actualTotalPrice = 0;
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
    componentContext.state.rows.push(getEmptyReceivedRow());
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
    value = value === 0 ? 0 : value;
    componentContext.state.rows.forEach((row) => {
        if (row.id === rowId) {
            row[fieldName] = value;
        }
    });
    componentContext.forceUpdate();
    triggerReceivedItemsDataUpdates(componentContext, fieldName);
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
    value = value === 0 ? 0 : value;
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
    var cashSentCash = parseInt(componentContext.state.cash === 0 || isNaN(componentContext.state.cash) ? 0 : componentContext.state.cash);
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
    componentContext.props.pushSentItemDetails(updatedRows, updatedTotal, cashSentCash);
    //update the summary details in redux's global store
    var totalValueOfCashAndItemsSent = cashSentCash + parseInt(updatedTotal);
    var totalValueOfCashAndItemsReceived = parseInt(componentContext.props.received.totalActualPrice) + parseInt(componentContext.props.received.cash);
    componentContext.props.pushTradeSummary(totalValueOfCashAndItemsReceived - totalValueOfCashAndItemsSent);
}

export function triggerReceivedItemsDataUpdates(componentContext, changedFieldName) {
    var cashReceivedCash = componentContext.state.cash === 0 || isNaN(componentContext.state.cash) ? 0 : componentContext.state.cash;
    var updatedTotal = getTotalPrice(
        componentContext.state.rows,
        componentContext.props.itemNameList,
        componentContext.props.priceMap
    );
    var updatedTotalActual = getTotalPriceWithProfit(
        componentContext.state.rows,
        componentContext.props.itemNameList,
        componentContext.props.priceMap,
        changedFieldName
    );
    var updatedRows = getUpdatedRowDataWithProfit(
        componentContext.state.rows,
        componentContext.props.itemNameList,
        componentContext.props.priceMap,
        changedFieldName
    );
    //update the component's local variables that are mapped to the UI elements
    updateLocalState(componentContext, updatedRows, updatedTotal, updatedTotalActual);
    //update the received items in redux's global store
    componentContext.props.pushReceivedItemsDetail(updatedRows, updatedTotal, updatedTotalActual, cashReceivedCash);
    //update the summary details in redux's global store
    var totalValueOfCashAndItemsReceived = parseInt(updatedTotalActual) + cashReceivedCash;
    var totalValueOfCashAndItemsSent = parseInt(componentContext.props.sent.total) + parseInt(componentContext.props.sent.cash);
    componentContext.props.pushTradeSummary(totalValueOfCashAndItemsReceived - totalValueOfCashAndItemsSent);
}

function updateLocalState(componentContext, updatedRows, updatedTotal, totalPriceAfterProfit) {
    if (totalPriceAfterProfit) {
        componentContext.setState({
            ...componentContext.state,
            totalActualPrice: totalPriceAfterProfit,
            totalPrice: updatedTotal,
            rows: updatedRows
        });
    }
    else {
        componentContext.setState({
            ...componentContext.state,
            totalPrice: updatedTotal,
            rows: updatedRows
        });
    }
}