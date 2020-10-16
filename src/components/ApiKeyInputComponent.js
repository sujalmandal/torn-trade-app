import React, { Component } from "react";
import { Button } from "reactstrap";
import { Input } from "reactstrap";
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

class ApiKeyInputComponent extends Component{

    constructor(props) {
        super(props)
        this.state = {
         API_KEY: props.API_KEY
       }
    }

    updateApiKey=(event)=>{
        this.setState({API_KEY : event.target.value})
    }

    saveApiKey=()=>{
        this.props.handleUpdateApiKey(this.state.API_KEY);
    }

    render() {
        return (
          <Container>
          <Row>
            <hr></hr>
          </Row>
          <Row>
            <Col><h4>Torn barter receipt generator</h4></Col>
            <Col>
              <Input type="text" placeholder="Your API KEY goes here.." value={this.state.API_KEY} onChange={this.updateApiKey}/>
            </Col>
            <Col>
              <Button color="primary" onClick={()=>{this.saveApiKey()}}>Save</Button>
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
      API_KEY: state.apiKey
  };
};

const mapDispatchToProps = dispatch => {
  return {
      handleUpdateApiKey: (apiKey) => dispatch({ type: 'UPDATE_API_KEY', payload: { "API_KEY": apiKey } })
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeyInputComponent);