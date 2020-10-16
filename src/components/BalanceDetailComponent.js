import React, { Component } from "react"
import { Button } from "reactstrap"
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

class BalanceDetailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: 0
        }
    }

    render() {
        let btnColor;

        if (this.props.itemsStore === null || !this.props.itemsStore) {
            btnColor = "secondary";
        }
        else {
            btnColor = "primary";
        }
        return (
            <Container>
                <Row>
                    <Col>
                        {(() => {
                            if (this.state.balance > 0)
                                return <h5 style={{ color: "green" }}>You are owed {this.state.balance} $</h5>;
                            if (this.state.balance < 0)
                                return <h5 style={{ color: "red" }}>You owe {this.state.balance} $</h5>;
                            if (this.state.balance === 0) {
                                return <h5 style={{ color: "green" }}>The trade is balanced</h5>;
                            }
                        })()}
                    </Col>
                    <Row>
                        <Col><Button color={btnColor} disabled={this.props.itemNameList === null} >Copy to Clipboard</Button></Col>
                    </Row>
                </Row>
            </Container>
        )
    }
}

/* mapping for redux */
const mapStateToProps = state => {
    console.log("BalanceDetailComponent props update triggered!");
    return {
        ...state
    };
};

const mapDispatchToProps = dispatch => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BalanceDetailComponent);