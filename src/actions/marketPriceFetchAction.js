import axios from 'axios';
import debugConsole from '../utils/ConsoleUtil'

export const fetchPrice = (apiKey, itemName, itemsStore, componentContext, forceApiCall, updatesCallback) => {
  return (dispatch) => {
    var itemId = itemsStore.idByName[itemName];
    var itemPriceUrl = "https://api.torn.com/market/" + itemId + "?selections=itemmarket,bazaar&key=" + apiKey;
    var cachedBestPriceForItem = componentContext.props.priceMap[itemName];
    if (cachedBestPriceForItem === 0 || forceApiCall) {
      debugConsole("prices to be fetched from the API");
      var itemPricePromise = axios.get(itemPriceUrl);
      itemPricePromise.then((response) => {
        var itemMarketListings = response.data.itemmarket;
        var privateBazaarListings = response.data.bazaar;
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

        pushPriceAndRowDetailsInReduxStore(itemName, bestPriceAvailable, dispatch, updatesCallback);

      }).catch((err) => {
        console.error(JSON.stringify(err));
        dispatch(failed(err));
      });
    }
    else {
      debugConsole("price for " + itemName + " is already fetched, value = " + cachedBestPriceForItem);
      pushPriceAndRowDetailsInReduxStore(itemName, cachedBestPriceForItem, dispatch, updatesCallback);
    }
  };
};

const failed = (error) => ({
  type: "API_CALL_FAILED",
  payload: {
    error,
    loading: false
  }
});

function pushPriceAndRowDetailsInReduxStore(itemName, bestPriceAvailable, dispatch, updatesCallback) {
  dispatch({ type: 'MARKET_PRICE_FETCHED', payload: { "price": bestPriceAvailable, "itemName": itemName } });
  //execute the updates after the price has been fetched
  updatesCallback();
}