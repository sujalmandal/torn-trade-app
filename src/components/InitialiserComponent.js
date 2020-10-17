import React, { Component } from "react";
import { Button } from "reactstrap";
import { Input } from "reactstrap";
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import {fetchAllItemMetaData} from "../actions/marketItemsFetchAction"

class InitialiserComponent extends Component{

    constructor(props) {
        super(props)
        this.state = {
         apiKey : props.apiKey,
         itemsStore : props.itemsStore
       }
    }

    updateApiKey=(event)=>{
        this.setState({apiKey : event.target.value})
    }

    saveApiKeyAndInit=()=>{
        if(!localStorage.getItem("MARKET_ITEMS")){
          console.log("item details not found in cache; thus, calling the items api now!");
          this.props.fetchMarketItemDetails(this.state.apiKey);
        }
        else{
          console.log("item details already present");
        }
    }

    render() {
      let btnName;
      let btnColor;
      if(this.state.loading){
        btnName="loading...";
        btnColor="info";
      }
      else{
        if(this.state.itemsStore===null || !this.state.itemsStore){
          btnName="Initialise";
          btnColor="primary";
        }
        else{
          btnName="Update";
          btnColor="secondary";
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
              <Input type="text" placeholder="Your API KEY goes here.." value={this.state.apiKey} onChange={this.updateApiKey}/>
            </Col>
            <Col>
              <Button color={btnColor} onClick={()=>{this.saveApiKeyAndInit()}}>{btnName}</Button>
            </Col>
          </Row>
          <Row>
            <hr></hr>
          </Row>
        </Container>
        )
    }
}

/* mapping for redux */
const mapStateToProps = state => {
  return {
      apiKey: state.apiKey,
      loading: state.loading,
      apiCallSuccess: state.apiCallSuccess,
      apiErrorMsg: state.apiErrorMsg,
      itemsStore:state.itemsStore
  };
};

const mapDispatchToProps = dispatch => {
  return {
      fetchMarketItemDetails: function(apiKey){
        dispatch(fetchAllItemMetaData(apiKey))
      }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(InitialiserComponent);