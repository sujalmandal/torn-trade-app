import React, { Component } from "react";
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchAllItemMetaData } from "../actions/MarketItemsFetchAction"
import { fetchPrice } from "../actions/MarketPriceFetchAction"
import { fetchUserName } from "../actions/ProfileDetailsFetchAction"
import { triggerSentItemsDataUpdates, triggerReceivedItemsDataUpdates } from '../helpers/ItemsComponentHelper'
import debugConsole from '../utils/ConsoleUtil'

class InitialiserComponent extends Component {

  REFRESH_INTERVAL=3000;
  constructor(props) {
    super(props)
    this.state = {
      apiKey: props.apiKey,
      isRefreshing: false,
      currentItemNameForPriceRefresh: ""
    }
  }

  updateApiKey = (event) => {
    this.setState({ apiKey: event.target.value })
    this.props.updateApiKeyInReduxStore(event.target.value);
  }

  saveApiKeyAndInit = () => {
    if (!localStorage.getItem("MARKET_ITEMS")) {
      debugConsole("item details not found in cache; thus, calling the items api now!");
      this.props.updateMarketItemDetailsInReduxStore(this.state.apiKey);
      this.props.updateUserNameInReduxStore(this.state.apiKey);
    }
    else {
      debugConsole("item details already present");
    }
  }

  refreshPrices = () => {
    this.setState({
      ...this.state,
      isRefreshing: true
    }, () => {
      var componentContext = this;
      var count = 0;
      Object.keys(this.props.priceMap).forEach((itemName) => {
        if (this.props.priceMap[itemName] !== 0) {
          count++;
          setTimeout(function () {
            debugConsole("currently refreshing : " + itemName);
            componentContext.refreshPrice(itemName);
          }, componentContext.REFRESH_INTERVAL * count);
        }
      });
      setTimeout(function () {
        componentContext.setState({
          ...componentContext.state,
          isRefreshing: false,
          currentItemNameForPriceRefresh: ""
        });
      }, componentContext.REFRESH_INTERVAL * count);
    });
  }

  refreshPrice(itemName) {
    this.setState({
      ...this.state,
      currentItemNameForPriceRefresh: itemName
    }, () => {
      this.props.refreshItemPriceInReduxStore(
        this.props.apiKey,
        itemName,
        this.props.itemsStore,
        this
      );
    });
  }

  render() {
    let btnName;
    let btnColor;
    if (this.props.loading) {
      btnName = "loading...";
      btnColor = "info";
    }
    else {
      if (this.props.itemsStore === null || !this.props.itemsStore) {
        btnName = "Initialise";
        btnColor = "primary";
      }
      else {
        btnName = "Update API Key";
        btnColor = "secondary";
      }
    }
    return (
      <Container>
        <Row>
          <hr></hr>
        </Row>
        <Row>
          <Col><h4>Torn barter receipt generator</h4></Col>
          <Col>
            <Input type="text" placeholder="Your API KEY goes here.." value={this.props.apiKey === null ? "" : this.props.apiKey} onChange={this.updateApiKey} />
          </Col>
          <Col>
            <Button color={btnColor} onClick={() => { this.saveApiKeyAndInit() }}>{btnName}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button color="info" onClick={this.refreshPrices}>Fetch Latest Prices</Button>
          </Col>
        </Row>
        <Row>
          <hr></hr>
        </Row>
        <Row>
          <Modal isOpen={this.state.isRefreshing}>
            <ModalHeader>Please wait</ModalHeader>
            <ModalBody>
              {this.state.currentItemNameForPriceRefresh === "" ?
                <h6>Calling Torn API..</h6> :
                <h6>Fetching the latest price of {this.state.currentItemNameForPriceRefresh}..</h6>}
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
          </Modal>
        </Row>
      </Container>
    )
  }
}

/* mapping for redux */
const mapStateToProps = (reduxState) => {
  return {
    ...reduxState
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMarketItemDetailsInReduxStore: function (apiKey) {
      dispatch(fetchAllItemMetaData(apiKey))
    },
    updateApiKeyInReduxStore: function (apiKey) {
      dispatch({ type: "API_KEY_UPDATED", payload: { apiKey } });
    },
    updateUserNameInReduxStore: function (apiKey) {
      dispatch(fetchUserName(apiKey));
    },
    refreshItemPriceInReduxStore: function (apiKey, itemName, itemsStore, componentContext) {
      dispatch(fetchPrice(apiKey, itemName, itemsStore, componentContext, true,
        // updates to fire after price has been fetched
        () => {
          triggerReceivedItemsDataUpdates(componentContext.props.contexts.receivedItemComponentContext);
          triggerSentItemsDataUpdates(componentContext.props.contexts.sentItemComponentContext);
        }
      ));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InitialiserComponent);