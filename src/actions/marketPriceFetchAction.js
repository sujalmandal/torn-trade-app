import axios from 'axios';

export const fetchPrice = (apiKey, itemName, itemsStore, tradeList, rowId,dispatchBody) => {
  return dispatch => {
    var itemId = itemsStore.idByName[itemName];
    var itemPriceUrl="https://api.torn.com/market/" + itemId + "?selections=itemmarket&key=" + apiKey;
    console.log(itemPriceUrl);
    axios.get(itemPriceUrl)
      .then(res => {
        var listings = res.data.itemmarket;
        var bestPrice = 0;
        if (listings.length > 0) {
          bestPrice = listings[0].cost;
        }
        var updatedTradeList = tradeList.map(row => {
          var newRow = { ...row };
          if (newRow.id === rowId) {
            newRow.mPrice = bestPrice;
            newRow.tPrice = bestPrice * newRow.qty;
          }
          return newRow;
        });
        if(dispatchBody.type==='UPDATE_RECEIVED_ITEMS'){
          dispatchBody.payload.receivedItems=updatedTradeList;
        }
        if(dispatchBody.type==='UPDATE_SENT_ITEMS'){
          dispatchBody.payload.sentItems=updatedTradeList;
        }
        dispatch(dispatchBody);
      })
      .catch(err => {
        console.log(err.message)
      });
  };
};