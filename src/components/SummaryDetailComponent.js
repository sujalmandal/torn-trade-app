import React, { Component } from "react"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { sentAndReceivedItemsEmpty,getFormattedCurrency} from '../utils/ItemRowUtil'
import * as clipboard from "clipboard-polyfill/text";

class SummaryDetailComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            received: this.props.received,
            sent: this.props.sent,
            tradeSummary: this.props.tradeSummary,
            isSummaryDialogOpen: false,
            showCopiedButtonName: false,
            forceRecalculation: false
        }
        props.updateContextInReduxStore(this);
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
            balanceText = this.props.tradeSummary.yourName + " gets " + getFormattedCurrency(this.props.tradeSummary.balance) + ".";
        }
        //user received more
        else if (this.props.tradeSummary.balance > 0) {
            balanceColor = "red";
            balanceText = this.props.tradeSummary.yourName + " needs to send an additional " + getFormattedCurrency(this.props.tradeSummary.balance) + ".";
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
                                                    <span style={{ "textDecoration": "underline" }}>
                                                        {this.props.tradeSummary.yourName}
                                                        {" received the following items, "}
                                                        {"worth " }
                                                        <span style={{ "color": "green" }}>{getFormattedCurrency(this.props.received.totalActualPrice)}</span>
                                                        {" in total"}
                                                    </span>
                                                    <br />
                                                </div>
                                                <div>
                                                    {this.props.received.items.map((row) => {
                                                        return <span key={row.id}>
                                                            <span style={{ "fontWeight": "bold" }}>{row.name}</span>
                                                            <span style={{ "color": "blue" }}>{" x" + row.qty}</span>
                                                            {" at "}
                                                            <span style={{ "color": "green" }}>{getFormattedCurrency(row.actualPrice)}</span>
                                                            {"  each, "}
                                                            <span style={{ "color": "green" }}>{getFormattedCurrency(row.actualTotalPrice)}</span>
                                                            {" in total"}<br />
                                                        </span>
                                                    })}
                                                    <span style={{ "color": "green","fontWeight": "bold" }}>{this.props.received.cash!==0?this.props.tradeSummary.yourName+" also received "+getFormattedCurrency(this.props.received.cash)+" in cash":""}</span>
                                                </div>
                                                <span><br /></span>

                                                <div>
                                                    <span style={{ "textDecoration": "underline" }}>
                                                        {this.props.tradeSummary.yourName}
                                                        {" sent the following items, "}
                                                        {"worth "}
                                                        <span style={{ "color": "green" }}>{getFormattedCurrency(this.props.sent.total)}</span>
                                                        {" in total"}
                                                    </span>
                                                    <br />
                                                </div>
                                                <div>
                                                    {this.props.sent.items.map((row) => {
                                                        return <span key={row.id}>
                                                            <span style={{ "fontWeight": "bold" }}>{row.name}</span>
                                                            <span style={{ "color": "blue" }}>{" x" + row.qty}</span>
                                                            {" at "}
                                                            <span style={{ "color": "green" }}>{getFormattedCurrency(row.mPrice)}</span>
                                                            {"  each, "}
                                                            <span style={{ "color": "green" }}>{getFormattedCurrency(row.tPrice)}</span>
                                                            {" in total"}<br />
                                                        </span>
                                                    })}
                                                    <span style={{ "color": "green","fontWeight": "bold" }}>{this.props.sent.cash!==0?this.props.tradeSummary.yourName+" also sent "+getFormattedCurrency(this.props.sent.cash)+" in cash":""}</span>
                                                </div>
                                                <span>----------------</span><br/>
                                                <span style={{ "fontWeight": "bold" }}>{balanceText}</span>
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
        updateContextInReduxStore: (componentContext) => {
            dispatch({
                type: "SUMMARY_DETAIL_COMPONENT_CONTEXT_UPDATED", payload: {
                    summaryDetailComponentContext: componentContext
                }
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryDetailComponent);