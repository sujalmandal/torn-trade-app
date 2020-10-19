import axios from 'axios';

export const fetchPrice = (apiKey, itemName, itemsStore,componentContext) => {
  return dispatch => {
    var itemId = itemsStore.idByName[itemName];
    var itemPriceUrl = "https://api.torn.com/market/" + itemId + "?selections=itemmarket&key=" + apiKey;
    console.log(itemPriceUrl);
    axios.get(itemPriceUrl)
      .then(res => {
        var listings = res.data.itemmarket;
        var bestPrice = 0;
        if (listings.length > 0) {
          bestPrice = listings[0].cost;
        }
        dispatch({ type: 'MARKET_PRICE_FETCHED', payload: { "price": bestPrice, "itemName": itemName } })
        if(componentContext.state.type==="RECEIVED"){
          componentContext.props.pushReceivedItemsDetail(componentContext.state.rows,componentContext.state.totalPrice);
        }
        if(componentContext.state.type==="SENT"){
          componentContext.props.pushSentItemDetails(componentContext.state.rows, componentContext.state.totalPrice);
        }
      })
      .catch(err => {
        console.log(failed(err.message))
      });
  };
};

const failed = (error) => ({
  type: "API_CALL_FAILED",
  payload: {
    error,
    loading: false
  }
});