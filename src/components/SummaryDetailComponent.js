import React, { Component } from "react"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { sentAndReceivedItemsEmpty } from '../utils/ItemRowUtil'
import * as clipboard from "clipboard-polyfill/text";

class SummaryDetailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            received: this.props.received,
            sent: this.props.sent,
            tradeSummary: this.props.tradeSummary,
            isSummaryDialogOpen: false,
            showCopiedButtonName: false
        }
    }

    toggleSummaryDialog = () => {
        this.setState({
            ...this.state,
            isSummaryDialogOpen: !this.state.isSummaryDialogOpen
        })
    }

    copySummaryDataToClipboard = (event) => {
        var context = this;
        var textToCopy = document.getElementById("summaryText").innerText;
        clipboard.writeText(textToCopy).then(
            function () {
                context.setState({
                    ...context.state,
                    showCopiedButtonName: true
                },
                    () => {
                        window.setTimeout(() => {
                            context.setState({
                                ...context.state,
                                showCopiedButtonName: false
                            })
                        }, 1000)
                    });

            },
            function () {
                console.error("failed to copy!");
            }
        );
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("BalanceDetailComponent updated()");
        if ((this.props.received.total - this.props.sent.total) !== this.props.tradeSummary.balance) {
            this.props.pushTradeSummary(this.props.received.total - this.props.sent.total);
        }
    }

    render() {
        let btnColor;
        let balanceText = "";
        let balanceColor = "green";

        if (this.props.itemsStore === null || !this.props.itemsStore) {
            btnColor = "secondary";
        }
        else {
            btnColor = "primary";
        }
        //user received less
        if (this.props.tradeSummary.balance < 0) {
            balanceText = this.props.tradeSummary.yourName + " gets $" + this.props.tradeSummary.balance + ".";
        }
        //user received more
        else if (this.props.tradeSummary.balance > 0) {
            balanceColor = "red";
            balanceText = this.props.tradeSummary.yourName + " needs to send an additional $" + this.props.tradeSummary.balance + ".";
        }
        //balanced
        else if (this.props.tradeSummary.balance === 0) {
            balanceText = "The trade is balanced.";
        }

        return (
            <Container>
                <Row>
                    <Col>
                        <h5 style={{ color: balanceColor }}>{balanceText}</h5>
                    </Col>
                    <Row>
                        <Col>
                            <Button
                                color={btnColor}
                                disabled={sentAndReceivedItemsEmpty(this.props)}
                                onClick={this.toggleSummaryDialog}>
                                Show Summary
                            </Button>
                            <Modal isOpen={this.state.isSummaryDialogOpen} toggle={this.toggleSummaryDialog}>
                                <ModalHeader toggle={this.toggleSummaryDialog}>Trade Summary</ModalHeader>
                                <ModalBody>
                                    {sentAndReceivedItemsEmpty(this.props) ?
                                        null :
                                        (
                                            <div id="summaryText">
                                                <div>
                                                    <span style={{"text-decoration":"underline"}}>
                                                        {this.props.tradeSummary.yourName}
                                                        {" sent the following items, "}
                                                        {"worth $" + this.props.sent.total}
                                                    </span>
                                                </div>
                                                <div>
                                                {this.props.sent.items.map((row) => {
                                                    return <span>
                                                            <span style={{"font-weight":"bold"}}>{row.name}</span>
                                                            <span style={{"color":"blue"}}>{" x"+row.qty}</span>
                                                            {" at $"}
                                                            <span style={{"color":"green"}}>{row.mPrice}</span>
                                                            {"  each"}<br/>
                                                        </span>
                                                })}
                                                </div>
                                                <div>
                                                    <span style={{"text-decoration":"underline"}}>
                                                        {this.props.tradeSummary.yourName}
                                                        {" received the following items, "}
                                                        {"worth $" + this.props.received.total}
                                                    </span>
                                                </div>
                                                <div>
                                                {this.props.received.items.map((row) => {
                                                    return <span>
                                                    <span style={{"font-weight":"bold"}}>{row.name}</span>
                                                    <span style={{"color":"blue"}}>{" x"+row.qty}</span>
                                                    {" at $"}
                                                    <span style={{"color":"green"}}>{row.mPrice}</span>
                                                    {"  each"}<br/>
                                                </span>
                                                })}
                                                </div>
                                                <span style={{"font-weight":"bold"}}>{balanceText}</span>
                                            </div>
                                        )}
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.copySummaryDataToClipboard}>
                                        {this.state.showCopiedButtonName ? "Copied!" : "Copy To Clipboard"}
                                    </Button>{' '}
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