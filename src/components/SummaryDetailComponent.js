import React, { Component } from "react"
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

class SummaryDetailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            received: this.props.received,
            sent: this.props.sent,
            tradeSummary: this.props.tradeSummary,
            isSummaryDialogOpen: false
        }
    }

    toggleSummaryDialog=()=> {
        this.setState({
            ...this.state,
            isSummaryDialogOpen: !this.state.isSummaryDialogOpen
        })
    }

    copySummaryDataToClipboard=(event)=> {
        var textArea = document.getElementById("summaryText");
        textArea.select()
        document.execCommand('copy')
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("BalanceDetailComponent updated()");
        if ((this.props.received.total - this.props.sent.total) !== this.props.tradeSummary.balance) {
            this.props.pushTradeSummary(this.props.received.total - this.props.sent.total);
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
                        <Col>
                            <Button 
                                color={btnColor}
                                disabled={this.props.itemNameList === null}
                                onClick={this.toggleSummaryDialog}>
                                    Show Summary
                            </Button>
                            <Modal isOpen={this.state.isSummaryDialogOpen} toggle={this.toggleSummaryDialog}>
                                <ModalHeader toggle={this.toggleSummaryDialog}>Trade Summary</ModalHeader>
                                    <ModalBody>
                                        <Input type="textarea" name="text" value={"trade info here"} id="summaryText" />
                                    </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.copySummaryDataToClipboard}>Copy To Clipboard</Button>{' '}
                                    <Button color="secondary" onClick={this.toggleSummaryDialog}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </Row>
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
        pushTradeSummary: (calculatedBalance) => {
            dispatch({ type: "UPDATE_TRADE_SUMMARY", payload: { summary: { balance: calculatedBalance } } });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryDetailComponent);