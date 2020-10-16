import axios from 'axios';

export const fetchAllItemMetaData = (apiKey) => {
    return dispatch => {
      dispatch(started());
      axios.get("https://api.torn.com/torn/?selections=items&key="+apiKey)
        .then(res => {
          var itemMetaData={
            idByName:{},
            nameById:{}
          };
          Object.entries(res.data.items).forEach(([key, value]) => {
            itemMetaData.idByName[value.name]=parseInt(key);
            itemMetaData.nameById[parseInt(key)]=value.name;
          });
          localStorage.setItem("MARKET_ITEMS",JSON.stringify(itemMetaData))
          dispatch(success());
        })
        .catch(err => {
          dispatch(failed(err.message));
        });
    };
  };
  
  const success = items => ({
    type: "MARKET_ITEMS_FETCH_SUCCESS",
    payload: {
      loading: false
    }
  });
  
  const started = () => ({
    type: "MARKET_ITEMS_FETCH_STARTED",
    payload: {
      loading: true
    }
  });
  
  const failed = error => ({
    type: "MARKET_ITEMS_FETCH_FAILED",
    payload: {
      error,
      loading: false
    }
  });