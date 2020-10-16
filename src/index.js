import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

const mainReducer = function (
  state = {
    receivedItems:[],
    sentItems:[],
    balance:"",
    time:new Date(),
    loading:false,
    apiErrorMsg:"",
    apiCallSuccess:undefined
  }, action) {
  switch (action.type) {
    case "UPDATE_RECEIVED_ITEMS":
      console.log("received items updated!");
      console.log(JSON.stringify(action.payload));
      return {
        time:new Date(),
        apiCallSuccess:undefined,
        loading:false,
        ...state
      };
    case "UPDATE_SENT_ITEMS":
      console.log("sent items updated!");
      console.log(JSON.stringify(action.payload));
      return  {
        time:new Date(),
        apiCallSuccess:undefined,
        loading:false,
        ...state
      };
    case "MARKET_ITEMS_FETCH_STARTED":
      return  {
        time:new Date(),
        loading:action.payload.loading,
        apiCallSuccess:undefined,
        ...state
      };
    case "MARKET_ITEMS_FETCH_SUCCESS":
      return {
        time:new Date(),
        loading:action.payload.loading,
        apiCallSuccess:true,
        ...state
      };
    case "MARKET_ITEMS_FETCH_FAILED":
      return {
        time:new Date(),
        loading:action.payload.loading,
        apiCallSuccess:false,
        apiErrorMsg:action.payload.error,
        ...state
      };
    default:
      return state;
  }
};

let store = createStore(mainReducer,applyMiddleware(thunk));

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
