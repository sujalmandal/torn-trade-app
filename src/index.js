import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const countReducer = function (state = {
    receivedItems:[],
    sentItems:[],
    balance:"",
    time:new Date()
  }, action) {
  switch (action.type) {
    case "UPDATE_RECEIVED_ITEMS":
      console.log("received items updated!");
      console.log(JSON.stringify(action.payload));
      return state;
    case "UPDATE_SENT_ITEMS":
      console.log("sent items updated!");
      console.log(JSON.stringify(action.payload));
      return state;
    default:
      return state;
  }
};

let store = createStore(countReducer);

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
