import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import { populateDefaultPriceMap } from './utils/PriceMapGeneratorUtil'
import { getEmptySentRow,getEmptyReceivedRow } from './utils/ItemRowUtil'
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger'

const mainReducer = function (

  state = {
    time: new Date(),
    apiKey: localStorage.getItem("API_KEY"),
    received: {
      items: [getEmptyReceivedRow()],
      total: 0
    },
    sent: {
      items: [getEmptySentRow()],
      total: 0,
      totalAfterProfit:0
    },
    tradeSummary: {
      yourName: localStorage.getItem("YOUR_NAME"),
      theirName: "",
      balance: 0
    },
    priceMap: populateDefaultPriceMap(),
    loading: false,
    apiErrorMsg: "",
    apiCallSuccess: undefined,
    itemsStore: JSON.parse(localStorage.getItem("MARKET_ITEMS")),
    itemNameList: JSON.parse(localStorage.getItem("MARKET_ITEMS_SIMPLE")),
    contexts:{
      sentItemComponentContext:null,
      receivedItemComponentContext:null,
      summaryDetailComponentContext:null,
    }
  }, action) {

  switch (action.type) {
    case "API_KEY_UPDATED":
      return {
        ...state,
        apiKey: action.payload.apiKey,
        time: new Date()
      };
    case "YOUR_NAME_UPDATED":
      return {
        ...state,
        tradeSummary: {
          ...state.tradeSummary,
          yourName: action.payload.yourName
        },
        time: new Date()
      };
    case "MARKET_PRICE_FETCHED":
      var updatedPriceMap = { ...state.priceMap };
      updatedPriceMap[action.payload.itemName] = action.payload.price;
      return {
        ...state,
        priceMap: updatedPriceMap,
        time: new Date()
      };
    case "UPDATE_RECEIVED_ITEMS":
      return {
        ...state,
        received: action.payload.received,
        apiCallSuccess: undefined,
        loading: false,
        time: new Date()
      };
    case "UPDATE_SENT_ITEMS":
      return {
        ...state,
        sent: action.payload.sent,
        apiCallSuccess: undefined,
        loading: false,
        time: new Date()
      };
    case "UPDATE_TRADE_SUMMARY":
      return {
        ...state,
        tradeSummary: {
          ...state.tradeSummary,
          balance:action.payload.summary.balance
        },
        time: new Date()
      };
    case "MARKET_ITEMS_FETCH_STARTED":
      return {
        ...state,
        loading: action.payload.loading,
        apiCallSuccess: undefined,
        time: new Date()
      };
    case "MARKET_ITEMS_FETCH_SUCCESS":
      return {
        ...state,
        priceMap: populateDefaultPriceMap(),
        loading: action.payload.loading,
        itemsStore: action.payload.itemsStore,
        itemNameList: action.payload.itemNameList,
        apiCallSuccess: true,
        time: new Date()
      };
    case "API_CALL_FAILED":
      return {
        ...state,
        loading: action.payload.loading,
        apiCallSuccess: false,
        apiErrorMsg: action.payload.error,
        time: new Date()
      };
      case "SENT_ITEM_COMPONENT_CONTEXT_UPDATED":
        return {
          ...state,
          contexts: {
            ...state.contexts,
            sentItemComponentContext:action.payload.sentItemComponentContext
          }
        };
        case "RECEIVED_ITEM_COMPONENT_CONTEXT_UPDATED":
        return {
          ...state,
          contexts: {
            ...state.contexts,
            receivedItemComponentContext:action.payload.receivedItemComponentContext
          }
        };
        case "SUMMARY_DETAIL_COMPONENT_CONTEXT_UPDATED":
        return {
          ...state,
          contexts: {
            ...state.contexts,
            summaryDetailComponentContext:action.payload.summaryDetailComponentContext
          }
        };
    default:
      return state;
  }
};

let reduxStore;
if (localStorage.getItem("debug")) {
  reduxStore = createStore(mainReducer, applyMiddleware(thunk, logger));
}
else {
  reduxStore = createStore(mainReducer, applyMiddleware(thunk));
}
const ReactApp = () => (
  <Provider store={reduxStore}>
    <App />
  </Provider>
);
ReactDOM.render(<ReactApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();