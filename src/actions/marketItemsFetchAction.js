import axios from 'axios';

export const fetchAllItemMetaData = (apiKey) => {
  localStorage.setItem("API_KEY",apiKey);
  return dispatch => {
    dispatch(started());
    axios.get("https://api.torn.com/torn/?selections=items&key=" + apiKey)
      .then(res => {
        var itemNameList = [];
        var itemsStore = {
          idByName: {},
          nameById: {}
        };
        Object.entries(res.data.items).forEach(([key, value]) => {
          var itemId = parseInt(key);
          var itemName = value.name;
          var isIllegalItemName=itemName.toLowerCase().includes("undefined");
          if(!isIllegalItemName){
            itemsStore.idByName[itemName] = itemId;
            itemsStore.nameById[itemId] = itemName;
            itemNameList.push(itemName);
          }
        });
        localStorage.setItem("MARKET_ITEMS", JSON.stringify(itemsStore))
        localStorage.setItem("MARKET_ITEMS_SIMPLE", JSON.stringify(itemNameList))
        dispatch(success(itemsStore, itemNameList));
      })
      .catch(err => {
        dispatch(failed(err.message));
      });
  };
};

const success = (itemsStore, itemNameList) => ({
  type: "MARKET_ITEMS_FETCH_SUCCESS",
  payload: {
    loading: false,
    itemsStore: { ...itemsStore },
    itemNameList: [...itemNameList]
  }
});

const started = () => ({
  type: "MARKET_ITEMS_FETCH_STARTED",
  payload: {
    loading: true
  }
});

const failed = (error) => ({
  type: "API_CALL_FAILED",
  payload: {
    error,
    loading: false
  }
});