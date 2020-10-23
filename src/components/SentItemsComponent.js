/* eslint-disable react/no-direct-mutation-state */
/* core imports */
import React, { Component } from "react"
import { connect } from 'react-redux';
/* UI element imports */
import { Input, Row, Col, Table, Button, ButtonGroup, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap"
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
/* custom import */
import { fetchPrice } from '../actions/MarketPriceFetchAction'
import { 
    isCurrentRowEmpty, 
    isItemListNotInitialised, 
    refinedOptions,
    getFormattedCurrency } from '../utils/ItemRowUtil'
import {
    updateTypeAheadSelectedName,
    addRowInSentItems,
    removeRowFromSentItems,
    updateNumericInputInSentItems,
    updateCash
} from '../helpers/ItemsComponentHelper'

class SentItemsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalPrice: this.props.sent.total,
            rows: this.props.sent.items,
            forceRecalculation: false,
            cash : 0,
            type: "SENT"
        }
        props.updateContextInReduxStore(this);
    }

    render() {
        return (
            <>
                <Row>
                &nbsp;<h5>Sent</h5>
                </Row>
                <Row>
                    <Table id="sentListTable" borderless size="sm">
                        <thead>
                        <tr style={{"fontSize":"0.85rem"}}>
                                <th>Item name</th>
                                <th style={{width:"15%"}}>Qty</th>
                                <th>Market Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.rows.map((row, index) => {
                                return (
                                    <tr key={row.id}>
                                        <td>
                                            <Typeahead id={"name_" + row.id} maxResults={5} disabled={this.props.itemNameList === null} onChange={(selected) => { updateTypeAheadSelectedName(selected, row.id, this) }} options={refinedOptions(this.props, this.state.rows)} />
                                        </td>
                                        <td><Input type="number" disabled={this.props.itemNameList === null} name={"qty_" + row.id} value={row.qty} onChange={(event) => { updateNumericInputInSentItems(event, this) }} min={0} /></td>
                                        <td><Input type="number" name={"mPrice_" + row.id} value={row.mPrice} disabled={true}/></td>
                                        <td><Input type="number" name={"tPrice_" + row.id} value={row.tPrice} disabled={true}/></td>
                                        <td>
                                                <ButtonGroup>
                                                    <Button size="sm" color="success" disabled={isCurrentRowEmpty(row) || isItemListNotInitialised(this.props)} onClick={() => { addRowInSentItems(this) }}>+</Button>
                                                    <Button size="sm" color="danger" disabled={this.state.rows.length === 1 || isItemListNotInitialised(this.props)} onClick={() => { removeRowFromSentItems(row, this) }}>-</Button>
                                                </ButtonGroup>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Row>
                <hr/>
                <Row>
                    <Col>Total <b>market price</b> of items: {getFormattedCurrency(this.state.totalPrice)}</Col>
                </Row>
                <hr/>
                <Row>
                    <Col xs="6">
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ "fontSize": ".80rem" }}>$ sent</InputGroupText>
                            </InputGroupAddon>
                            <Input type="number" value={this.state.cash} onChange={(e)=>{ updateCash(this, e.target.value)}}/>
                        </InputGroup>
                    </Col>
                </Row>
 
            </>
        )
    }
}

/* mapping for redux */
const mapStateToProps = (reduxState) => {
    return {
        ...reduxState
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
        updateContextInReduxStore: (componentContext) => {
            dispatch({
                type: "SENT_ITEM_COMPONENT_CONTEXT_UPDATED", payload: {
                    sentItemComponentContext: componentContext
                }
            });
        },

        updateSentItemsData: (apiKey, itemName, itemsStore, componentContext, updatesCallback) => {
            dispatch(fetchPrice(apiKey, itemName, itemsStore, componentContext, false, updatesCallback));
        },

        pushSentItemDetails: (items, totalPrice,cashSent) => {
            dispatch({
                type: 'UPDATE_SENT_ITEMS', payload: {
                    sent: {
                        items: items,
                        total: totalPrice,
                        cash : cashSent
                    }
                }
            });
        },

        pushTradeSummary: (calculatedBalance) => {
            dispatch({ type: "UPDATE_TRADE_SUMMARY", payload: { summary: { balance: calculatedBalance } } });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SentItemsComponent);