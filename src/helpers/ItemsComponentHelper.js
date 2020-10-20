import { IdGenerator } from '../utils/IdGeneratorUtil'
import { getUpdatedRowData, getTotalPrice } from '../utils/PriceCalculatorUtil'

/* methods common for both SentItemsComponent & ReceivedItemsComponent */

export function updateTypeAheadSelectedName(selectedItemName, rowId, componentContext) {
    var itemName = selectedItemName[0];
    componentContext.state.rows.forEach((row) => {
        if (row.id === rowId) {
            row.name = itemName;
            row.mPrice = 0;
            row.tPrice = 0;
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
    componentContext.state.rows.push({
        id: IdGenerator(),
        name: "",
        qty: 0,
        mPrice: 0,
        tPrice: 0
    })
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

export function updateQtyInReceivedItems(event, componentContext) {
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
    componentContext.state.rows.push({
        id: IdGenerator(),
        name: "",
        qty: 0,
        mPrice: 0,
        tPrice: 0
    });
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

export function updateQtyInSentItems(event, componentContext) {
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

//internal functions
function triggerSentItemsDataUpdates(componentContext) {
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
    updateLocalState(componentContext, updatedTotal, updatedRows);
    //update the received items in redux's global store
    componentContext.props.pushSentItemDetails(updatedRows, updatedTotal);
    //update the summary details in redux's global store
    componentContext.props.pushTradeSummary(componentContext.props.received.total - updatedTotal);
}

function triggerReceivedItemsDataUpdates(componentContext) {
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
    updateLocalState(componentContext, updatedTotal, updatedRows);
    //update the received items in redux's global store
    componentContext.props.pushReceivedItemsDetail(updatedRows, updatedTotal);
    //update the summary details in redux's global store
    componentContext.props.pushTradeSummary(updatedTotal - componentContext.props.sent.total);
}

function updateLocalState(componentContext, updatedTotal, updatedRows) {
    componentContext.setState({
        ...componentContext.state,
        totalPrice: updatedTotal,
        rows: updatedRows
    });
}