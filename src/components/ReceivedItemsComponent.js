/* eslint-disable react/no-direct-mutation-state */
/* core imports */
import React, { Component } from "react"
import { connect } from 'react-redux';
/* UI element imports */
import { Input, Container, Row, Col, Table, Button, ButtonGroup } from "reactstrap"
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
/* custom import */
import { fetchPrice } from '../actions/MarketPriceFetchAction'
import { isCurrentRowEmpty, isItemListNotInitialised, refinedOptions } from '../utils/ItemRowUtil'
import {
    updateTypeAheadSelectedName,
    addRowInReceivedItems,
    removeRowFromReceivedItems,
    updateQtyInReceivedItems
} from '../helpers/ItemsComponentHelper'

class ReceivedItemsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalPrice: this.props.received.total,
            rows: this.props.received.items,
            forceRecalculation: false,
            type: "RECEIVED"
        }
        props.updateContextInReduxStore(this);
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col><h4>Received</h4></Col>
                </Row>
                <Row>
                    <Table id="receivedListTable">
                        <thead>
                            <tr>
                                <th>Item name</th>
                                <th>Quantity</th>
                                <th>Best Price</th>
                                <th>Total Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.rows.map((row, index) => {
                                return (
                                    <tr key={row.id}>
                                        <td>
                                            <Typeahead id={"name_" + row.id} maxResults={5} disabled={this.props.itemNameList === null} onChange={(selected) => { updateTypeAheadSelectedName(selected, row.id, this) }} options={refinedOptions(this.props, this.state.rows)} />
                                        </td>
                                        <td><Input type="number" disabled={this.props.itemNameList === null} name={"qty_" + row.id} value={row.qty} onChange={(event) => { updateQtyInReceivedItems(event, this) }} min={0} /></td>
                                        <td><Input type="number" name={"mPrice_" + row.id} value={row.mPrice} disabled={true} /></td>
                                        <td><Input type="number" name={"tPrice_" + row.id} value={row.tPrice} disabled={true} /></td>
                                        <td>
                                            <div>
                                                <ButtonGroup>
                                                    <Button color="success" disabled={isCurrentRowEmpty(row) || isItemListNotInitialised(this.props)} onClick={() => { addRowInReceivedItems(this) }}>+</Button>
                                                    <Button color="danger" disabled={this.state.rows.length === 1 || isItemListNotInitialised(this.props)} onClick={() => { removeRowFromReceivedItems(row, this) }}>-</Button>
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
                    <Col>Total market price of items received: {this.state.totalPrice}</Col>
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
            dispatch(fetchPrice(apiKey, itemName, itemsStore, componentContext, updatesCallback));
        },

        pushReceivedItemsDetail: (items, totalPrice) => {
            dispatch({
                type: 'UPDATE_RECEIVED_ITEMS', payload: {
                    received: {
                        items: items,
                        total: totalPrice
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