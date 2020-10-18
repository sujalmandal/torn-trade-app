import React, { Component } from "react"
import { Button } from "reactstrap"
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

class BalanceDetailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            received: this.props.received,
            sent : this.props.sent,
            tradeSummary : this.props.tradeSummary
        }
    }
    componentDidUpdate(prevProps,prevState) {
        console.log("BalanceDetailComponent updated()");
        if((this.props.received.total-this.props.sent.total)!==this.props.tradeSummary.balance){
            this.props.pushTradeSummary(this.props.received.total-this.props.sent.total);
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
                            if (this.props.tradeSummary.balance < 0)
                                return <h5 style={{ color: "green" }}>You are owed {this.props.tradeSummary.balance} $</h5>;
                            if (this.props.tradeSummary.balance > 0)
                                return <h5 style={{ color: "red" }}>You owe {this.props.tradeSummary.balance} $</h5>;
                            if (this.props.tradeSummary.balance === 0) {
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
const mapStateToProps = (state) => {
    return {
        ...state
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        pushTradeSummary: (calculatedBalance) => {
            dispatch({type:"UPDATE_TRADE_SUMMARY",payload:{ summary:{ balance: calculatedBalance } } });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BalanceDetailComponent);