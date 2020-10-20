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
                                                    <span>
                                                        {this.props.tradeSummary.yourName}
                                                        {" sent the following items, "}
                                                        {"worth $" + this.props.sent.total+" in total"}
                                                    </span>
                                                    <br/><span>--------------------------------------------------------------------</span>
                                                </div>
                                                <div>
                                                {this.props.sent.items.map((row) => {
                                                    return <span key={row.id}>
                                                            <span style={{"font-weight":"bold"}}>{row.name}</span>
                                                            <span style={{"color":"blue"}}>{" x"+row.qty}</span>
                                                            {" at $"}
                                                            <span style={{"color":"green"}}>{row.mPrice}</span>
                                                            {"  each, $"}
                                                            <span style={{"color":"green"}}>{row.tPrice}</span>
                                                            {" in total"}<br/>
                                                            </span>
                                                })}
                                                </div>
                                                <span><br/></span>
                                                <div>
                                                    <span>
                                                        {this.props.tradeSummary.yourName}
                                                        {" received the following items, "}
                                                        {"worth $" + this.props.received.total+" in total"}
                                                    </span>
                                                    <br/><span>--------------------------------------------------------------------</span>
                                                </div>
                                                <div>
                                                {this.props.received.items.map((row) => {
                                                    return <span key={row.id}>
                                                    <span style={{"font-weight":"bold"}}>{row.name}</span>
                                                    <span style={{"color":"blue"}}>{" x"+row.qty}</span>
                                                    {" at $"}
                                                    <span style={{"color":"green"}}>{row.mPrice}</span>
                                                    {"  each, $"}
                                                    <span style={{"color":"green"}}>{row.tPrice}</span>
                                                    {" in total"}<br/>
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
        updateContextInReduxStore: (componentContext)=>{
            dispatch({type:"SUMMARY_DETAIL_COMPONENT_CONTEXT_UPDATED",payload:{
                summaryDetailComponentContext: componentContext
            }});
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryDetailComponent);