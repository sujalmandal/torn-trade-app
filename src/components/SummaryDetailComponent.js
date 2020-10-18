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

    toggleSummaryDialog = () => {
        this.setState({
            ...this.state,
            isSummaryDialogOpen: !this.state.isSummaryDialogOpen
        })
    }

    copySummaryDataToClipboard = (event) => {

    }

    componentDidUpdate(prevProps, prevState) {
        console.log("BalanceDetailComponent updated()");
        if ((this.props.received.total - this.props.sent.total) !== this.props.tradeSummary.balance) {
            this.props.pushTradeSummary(this.props.received.total - this.props.sent.total);
        }
    }

    render() {
        let disableShowSummaryButton=false;
        let btnColor;
        let balanceText = "";
        let balanceColor = "green";

        if(this.props.itemNameList === null){
            disableShowSummaryButton=true;
        }

        if (this.props.itemsStore === null || !this.props.itemsStore) {
            btnColor = "secondary";
        }
        else {
            btnColor = "primary";
        }
        //user received less
        if (this.props.tradeSummary.balance < 0){
            balanceText=this.props.tradeSummary.yourName+" gets $"+this.props.tradeSummary.balance+".";
        }
        //user received more
        else if(this.props.tradeSummary.balance > 0){
            balanceColor="red";
            balanceText=this.props.tradeSummary.yourName+" needs to send an additional $"+this.props.tradeSummary.balance+".";
        }
        //balanced
        else if(this.props.tradeSummary.balance === 0){
            balanceText="The trade is balanced.";
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
                                disabled={disableShowSummaryButton}
                                onClick={this.toggleSummaryDialog}>
                                Show Summary
                            </Button>
                            <Modal isOpen={this.state.isSummaryDialogOpen} toggle={this.toggleSummaryDialog}>
                                <ModalHeader toggle={this.toggleSummaryDialog}>Trade Summary</ModalHeader>
                                <ModalBody>
                                    <div id="summaryText">
                                        <span>{this.props.tradeSummary.yourName}</span> {" sent you the following items"}
                                        <br />
                                            {this.props.sent.items.map((row)=>{
                                                var rowText=row.name+" x"+row.qty+" @ $"+row.mPrice;
                                                return <div><span>{rowText}</span><br/></div>
                                            })}
                                        <br />
                                        <span>Total worth{" $" + this.props.sent.total}</span>
                                        <br />
                                        <span>You sent {this.props.tradeSummary.yourName}{" the following items"}</span>
                                        <br />
                                            {this.props.received.items.map((row)=>{
                                                var rowText=row.name+" x"+row.qty+" @ $"+row.mPrice;
                                                return <div><span>{rowText}</span><br/></div>
                                            })}
                                        <br />
                                        <span>Total worth{" $" + this.props.received.total}</span>
                                        <br />
                                        <span>{balanceText}</span>
                                    </div>
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