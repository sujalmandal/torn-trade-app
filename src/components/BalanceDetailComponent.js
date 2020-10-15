import React, { Component } from "react"
import { Input } from "reactstrap"
import { Button } from "reactstrap"
import { Container, Row, Col } from 'reactstrap';

class BalanceDetailComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            balance:0
        }
    }

    render(){
        return(
            <Container>
                <Row>
                    <Col>
                    {(() => {
                        if(this.state.balance>0)
                            return <h5 style={{color:"green"}}>You are owed {this.state.balance} $</h5>;
                        if(this.state.balance<0)
                            return <h5 style={{color:"red"}}>You owe {this.state.balance} $</h5>;
                        if(this.state.balance===0){
                            return <h5 style={{color:"green"}}>The trade is balanced</h5>;
                        }
                    })()}
                    </Col>
                    <Row>
                        <Col><Button color="primary">Copy to Clipboard</Button></Col>
                    </Row>
                </Row>
            </Container>
        )
    }
}

export default BalanceDetailComponent;