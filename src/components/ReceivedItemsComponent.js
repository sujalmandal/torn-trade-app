/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from "react"
import { Input } from "reactstrap"
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import { Button, ButtonGroup } from 'reactstrap';
import { IdGenerator } from '../utils/IdGenerator'
import { fetchPrice } from '../actions/marketPriceFetchAction'
import { getUpdatedRowData,getTotalPrice } from '../utils/PriceCalculator'
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { connect } from 'react-redux';

class ReceivedItemsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalPrice: 0,
            rows: this.props.receivedItems
        }
    }

    addRow = () => {
        this.state.rows.push({
            id: IdGenerator(),
            name: "",
            qty: 0,
            mPrice: 0,
            tPrice: 0
        })
        this.forceUpdate();
        this.props.handleReceivedItemsUpdated(this.state.rows);
    }

    removeRow = (currentRow) => {
        this.state.rows = this.state.rows.filter((row) => {
            return row.id !== currentRow.id;
        });
        this.forceUpdate();
        this.props.handleReceivedItemsUpdated(this.state.rows);
    }

    updateQty = (event) => {
        var fieldName = event.target.name.split("_")[0];
        var rowId = event.target.name.split("_")[1];
        var value = event.target.value;
        this.state.rows.forEach((row) => {
            if (row.id === rowId) {
                row[fieldName] = value;
            }
        });
        this.forceUpdate();
        this.props.handleReceivedItemsUpdated(this.state.rows);
    }

    updateTypeAheadSelectedName = (selectedItemName, rowId) => {
        var itemName = selectedItemName[0];
        this.state.rows.forEach((row) => {
            if (row.id === rowId) {
                row.name = itemName;
            }
        });
        //dispatch a api call to fetch prices in the priceMap in reduxStore
        this.props.fetchItemPrice(this.props.apiKey,itemName,this.props.itemsStore);
        this.forceUpdate();
    }

    //find out if any kind of calculation is required
    calculationRequired=(rows)=>{
        var calculationRequired=false;
        rows.forEach((row)=>{
            //user has selected the name & the api has fetched the value but the state variable mPrice is not updated
            if(row.name!=="" && this.props.priceMap[row.name]!==row.mPrice){
                calculationRequired = true;
                return;
            }
            //if everything is updated but the stateVariable tPrice is not updated
            if(row.name!=="" && this.props.priceMap[row.name]===row.mPrice 
                && row.qty!==0 && row.tPrice!==(parseInt(row.mPrice) * parseInt(row.qty))){
                calculationRequired = true;
                return;
            }
        });
        return calculationRequired;
    }

    //update the market price in the array after API has fetched the price in the priceMap
    componentDidUpdate(prevProps,prevState) {
        if(this.calculationRequired(prevState.rows)){
            this.setState({
                totalPrice:getTotalPrice(prevState.rows,prevProps.priceMap),
                rows:getUpdatedRowData(prevState.rows,prevProps.priceMap)
            });
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col><h4>Items received</h4></Col>
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
                                            <Typeahead id={"name_" + row.id} maxResults={5} disabled={this.props.itemNameList === null} onChange={(selected) => { this.updateTypeAheadSelectedName(selected, row.id) }} options={this.props.itemNameList===null?[]:this.props.itemNameList} />
                                        </td>
                                        <td><Input type="number" disabled={this.props.itemNameList === null} name={"qty_" + row.id} value={row.qty} onChange={this.updateQty} /></td>
                                        <td><Input type="number" name={"mPrice_" + row.id} value={row.mPrice} disabled={true} /></td>
                                        <td><Input type="number" name={"tPrice_" + row.id} value={row.tPrice} disabled={true} /></td>
                                        <td>
                                            <div>
                                                <ButtonGroup>
                                                    <Button color="success" disabled={this.props.itemNameList === null} onClick={() => { this.addRow() }}>+</Button>
                                                    <Button color="danger" disabled={this.props.itemNameList === null} onClick={() => { this.removeRow(row) }}>-</Button>
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
        apiKey: reduxState.apiKey,
        itemNameList: reduxState.itemNameList,
        receivedItems: reduxState.receivedItems,
        itemsStore: reduxState.itemsStore,
        priceMap: reduxState.priceMap
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleReceivedItemsUpdated: (receivedList) => {
            dispatch({ type: 'UPDATE_RECEIVED_ITEMS', payload: { "receivedItems": receivedList } });
        },
        fetchItemPrice: (apiKey,itemName,itemsStore) => {
            dispatch(fetchPrice(apiKey,itemName,itemsStore));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceivedItemsComponent);