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
import { getUpdatedRowData, getTotalPrice } from '../utils/PriceCalculator'
import {
    updateTypeAheadSelectedName,
    addRowInSentItems,
    removeRowFromSentItems,
    updateQtyInSentItems
} from '../helpers/ItemsComponentHelper'

class SentItemsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalPrice: this.props.sent.total,
            rows: this.props.sent.items,
            forceRecalculation: false
        }
    }

    //update the market price in the array after API has fetched the price in the priceMap
    componentDidUpdate(prevProps, prevState) {
        console.log("SentItemsComponent updated()");
        if (prevState.forceRecalculation) {
            this.setState({
                totalPrice: getTotalPrice(prevState.rows, prevProps.itemNameList, prevProps.priceMap),
                rows: getUpdatedRowData(prevState.rows, prevProps.itemNameList, prevProps.priceMap),
                forceRecalculation: false
            });
            this.props.pushSentItemDetails(this.state.rows, this.state.totalPrice);
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col><h4>Sent</h4></Col>
                </Row>
                <Row>
                    <Table id="sentListTable">
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
                                            <Typeahead id={"name_" + row.id} maxResults={5} disabled={this.props.itemNameList === null} onChange={(selected) => { updateTypeAheadSelectedName(selected, row.id, this) }} options={this.props.itemNameList === null ? [] : this.props.itemNameList} />
                                        </td>
                                        <td><Input type="number" disabled={this.props.itemNameList === null} name={"qty_" + row.id} value={row.qty} onChange={(event) => { updateQtyInSentItems(event, this) }} min={0} /></td>
                                        <td><Input type="number" name={"mPrice_" + row.id} value={row.mPrice} disabled={true} /></td>
                                        <td><Input type="number" name={"tPrice_" + row.id} value={row.tPrice} disabled={true} /></td>
                                        <td>
                                            <div>
                                                <ButtonGroup>
                                                    <Button color="success" disabled={this.props.itemNameList === null} onClick={() => { addRowInSentItems(this) }}>+</Button>
                                                    <Button color="danger" disabled={this.props.itemNameList === null} onClick={() => { removeRowFromSentItems(row, this) }}>-</Button>
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
                    <Col>Total market price of items sent: {this.state.totalPrice}</Col>
                </Row>
            </Container>
        )
    }
}

/* mapping for redux */
const mapStateToProps = (reduxState) => {
    return {
        apiKey: reduxState.apiKey,
        itemNameList: reduxState.itemNameList,
        sent: reduxState.sent,
        itemsStore: reduxState.itemsStore,
        priceMap: reduxState.priceMap
    };
};

const mapDispatchToProps = dispatch => {
    return {
        pushSentItemDetails: (items, totalPrice) => {
            dispatch({
                type: 'UPDATE_SENT_ITEMS', payload: {
                    sent: {
                        items: items,
                        total: totalPrice
                    }
                }
            });
        },
        fetchItemPrice: (apiKey, itemName, itemsStore) => {
            dispatch(fetchPrice(apiKey, itemName, itemsStore));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SentItemsComponent);