import axios from 'axios';

export const fetchPrice = (apiKey, itemName, itemsStore) => {
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
      })
      .catch(err => {
        console.log(err.message)
      });
  };
};