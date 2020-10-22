/* eslint-disable react/no-direct-mutation-state */
/* core imports */
import React, { Component } from "react"
import { connect } from 'react-redux';
/* UI element imports */
import { Input, Row, Col, Table, Button, ButtonGroup } from "reactstrap"
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
/* custom import */
import { fetchPrice } from '../actions/MarketPriceFetchAction'
import { isCurrentRowEmpty, isItemListNotInitialised, refinedOptions } from '../utils/ItemRowUtil'
import {
    updateTypeAheadSelectedName,
    addRowInReceivedItems,
    removeRowFromReceivedItems,
    updateNumericInputInReceivedItems
} from '../helpers/ItemsComponentHelper'

class ReceivedItemsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalPrice: this.props.received.total,
            totalActualPrice: this.props.received.totalActual,
            rows: this.props.received.items,
            forceRecalculation: false,
            type: "RECEIVED"
        }
        props.updateContextInReduxStore(this);
    }

    render() {
        return (
            <>
                <Row>
                    &nbsp;<h5>Received</h5>
                </Row>
                <Row>
                    <Table id="receivedListTable" size="sm">
                        <thead>
                            <tr style={{"fontSize":"0.85rem"}}>
                                <th>Item name</th>
                                <th style={{width:"12%"}}>Qty</th>
                                <th>Market Price</th>
                                <th>Your Price</th>
                                <th>Total</th>
                                <th style={{width:"10%"}}>Profit %</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.rows.map((row, index) => {
                                return (
                                    <tr key={row.id}>
                                        <td>
                                            <Typeahead id={"name_" + row.id} maxResults={5} disabled={this.props.itemNameList === null} onChange={(selected) => { updateTypeAheadSelectedName(selected, row.id, this) }} options={refinedOptions(this.props, this.state.rows)} />
                                        </td>
                                        <td><Input type="number" disabled={this.props.itemNameList === null} name={"qty_" + row.id} value={row.qty} onChange={(e) => { updateNumericInputInReceivedItems(e, this) }} min={0} /></td>
                                        <td><Input type="number" name={"mPrice_" + row.id} value={row.mPrice} disabled={true}/></td>
                                        <td><Input type="number" name={"actualPrice_" + row.id} value={row.actualPrice} disabled={true}/></td>
                                        <td><Input type="number" name={"actualTotalPrice_" + row.id} value={row.actualTotalPrice} disabled={true}/></td>
                                        <td><Input type="number" name={"profitPercent_" + row.id} value={row.profitPercent} onChange={(e)=>{updateNumericInputInReceivedItems(e,this)}} /></td>
                                        <td>
                                            <div>
                                                <ButtonGroup>
                                                    <Button size="sm" color="success" disabled={isCurrentRowEmpty(row) || isItemListNotInitialised(this.props)} onClick={() => { addRowInReceivedItems(this) }}>+</Button>
                                                    <Button size="sm" color="danger" disabled={this.state.rows.length === 1 || isItemListNotInitialised(this.props)} onClick={() => { removeRowFromReceivedItems(row, this) }}>-</Button>
                                                </ButtonGroup>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Row>
                <Row>
                    <Col>Total market price: {this.state.totalPrice}</Col>
                    <Col>Total price after profits: {this.state.totalActualPrice}</Col>
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
                type: "RECEIVED_ITEM_COMPONENT_CONTEXT_UPDATED", payload: {
                    receivedItemComponentContext: componentContext
                }
            });
        },

        updateReceivedItemsData: (apiKey, itemName, itemsStore, componentContext, updatesCallback) => {
            dispatch(fetchPrice(apiKey, itemName, itemsStore, componentContext, false, updatesCallback));
        },

        pushReceivedItemsDetail: (items, totalPrice, totalActualPrice) => {
            dispatch({
                type: 'UPDATE_RECEIVED_ITEMS', payload: {
                    received: {
                        items: items,
                        total: totalPrice,
                        totalActualPrice: totalActualPrice
                    }
                }
            });
        },

        pushTradeSummary: (calculatedBalance) => {
            dispatch({ type: "UPDATE_TRADE_SUMMARY", payload: { summary: { balance: calculatedBalance } } });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceivedItemsComponent);