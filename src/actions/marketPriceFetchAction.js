import axios from 'axios';

export const fetchPrice = (apiKey, itemName, itemsStore, componentContext) => {
  return (dispatch) => {
    var itemId = itemsStore.idByName[itemName];
    var itemPriceUrl = "https://api.torn.com/market/" + itemId + "?selections=itemmarket&key=" + apiKey;
    var bazaarPriceUrl = "https://api.torn.com/market/" + itemId + "?selections=bazaar&key=" + apiKey;

    var itemPricePromise = axios.get(itemPriceUrl);
    var bazaarPricePromise = axios.get(bazaarPriceUrl);
    Promise.all([itemPricePromise, bazaarPricePromise]).then((responses) => {
      console.log(responses)
      var itemMarketListings = responses[0].data.itemmarket;
      var privateBazaarListings = responses[1].data.bazaar;
      var bestPriceAvailable = 0;
      var bestItemMarketPrice = 0;
      var bestPrivateBazaarPrice = 0;
      if (itemMarketListings !== null && itemMarketListings.length > 0 && itemMarketListings[0].cost !== null) {
        bestItemMarketPrice = itemMarketListings[0].cost;
      }
      if (privateBazaarListings !== null && privateBazaarListings.length > 0 && privateBazaarListings[0].cost !== null) {
        bestPrivateBazaarPrice = privateBazaarListings[0].cost;
      }

      //best price out of bazaar & market
      bestPriceAvailable = bestPrivateBazaarPrice < bestItemMarketPrice ? bestPrivateBazaarPrice : bestItemMarketPrice;
      
      dispatch({ type: 'MARKET_PRICE_FETCHED', payload: { "price": bestPriceAvailable, "itemName": itemName } });

      if (componentContext.state.type === "RECEIVED") {
        componentContext.props.pushReceivedItemsDetail(componentContext.state.rows, componentContext.state.totalPrice);
      }
      if (componentContext.state.type === "SENT") {
        componentContext.props.pushSentItemDetails(componentContext.state.rows, componentContext.state.totalPrice);
      }

    }).catch((errs) => {
      console.error(JSON.stringify(errs));
      errs.forEach(err => {
        dispatch(failed(err));
      });
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