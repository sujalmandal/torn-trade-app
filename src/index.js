import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import { IdGenerator } from './utils/IdGenerator'
import { populateDefaultPriceMap } from './utils/priceMapGenerator'
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger'

const mainReducer = function (
  state = {
    apiKey: localStorage.getItem("API_KEY"),
    receivedItems:[{ id: IdGenerator(), name: "", qty: 0, mPrice: 0, tPrice: 0 }],
    sentItems:[{ id: IdGenerator(), name: "", qty: 0, mPrice: 0, tPrice: 0 }],
    priceMap:populateDefaultPriceMap(),
    balance:"",
    time:new Date(),
    loading:false,
    apiErrorMsg:"",
    apiCallSuccess:undefined,
    itemsStore:JSON.parse(localStorage.getItem("MARKET_ITEMS")),
    itemNameList:JSON.parse(localStorage.getItem("MARKET_ITEMS_SIMPLE"))
  }, action) {
  switch (action.type) {
    case "MARKET_PRICE_FETCHED":
      var updatedPriceMap={...state.priceMap};
      updatedPriceMap[action.payload.itemName]=action.payload.price;
      return {
        ...state,
        time:new Date(),
        priceMap:updatedPriceMap
    };
    case "UPDATE_RECEIVED_ITEMS":
      return {
        ...state,
        receivedItems:action.payload.receivedItems,
        time:new Date(),
        apiCallSuccess:undefined,
        loading:false
    };
    case "UPDATE_SENT_ITEMS":
      return  {
        ...state,
        time:new Date(),
        apiCallSuccess:undefined,
        loading:false
      };
    case "MARKET_ITEMS_FETCH_STARTED":
      return  {
        ...state,
        time:new Date(),
        loading:action.payload.loading,
        apiCallSuccess:undefined
      };
    case "MARKET_ITEMS_FETCH_SUCCESS":
      return {
        ...state,
        time:new Date(),
        loading:action.payload.loading,
        itemsStore:action.payload.itemsStore,
        itemNameList:action.payload.itemNameList,
        apiCallSuccess:true
      };
    case "MARKET_ITEMS_FETCH_FAILED":
      return {
        ...state,
        time:new Date(),
        loading:action.payload.loading,
        apiCallSuccess:false,
        apiErrorMsg:action.payload.error
      };
    default:
      return state;
  }
};

let store = createStore(mainReducer,applyMiddleware(thunk,logger));

const ReactApp = () => (
  <Provider store={store}>
    <App/>
  </Provider>
);
ReactDOM.render(<ReactApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
