/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from "react"
import { Input } from "reactstrap"
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import { Button, ButtonGroup } from 'reactstrap';
import { IdGenerator } from '../utils/IdGenerator'
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { connect } from 'react-redux';

class SentItemsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalPrice: 0,
            rows: [{ id: IdGenerator(), name: "", qty: 0, mPrice: 0, tPrice: 0 }],
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
        this.props.handleSentItemsUpdated(this.state.rows);
    }

    removeRow = (currentRow) => {
        this.state.rows = this.state.rows.filter((row) => {
            return row.id !== currentRow.id;
        });
        this.forceUpdate();
        this.props.handleSentItemsUpdated(this.state.rows);
    }

    updateValue = (event) => {
        var fieldName = event.target.name.split("_")[0];
        var rowId = event.target.name.split("_")[1];
        var value = event.target.value;
        this.state.rows.forEach((row) => {
            if (row.id === rowId) {
                row[fieldName] = value;
            }
        });
        this.forceUpdate();
        this.props.handleSentItemsUpdated(this.state.rows);
    }

    updateTypeAheadSelectedName = (selectedItemName, rowId) => {
        this.state.rows.forEach((row) => {
            if (row.id === rowId) {
                row["name"] = selectedItemName;
            }
        });
        this.forceUpdate();
        this.props.handleSentItemsUpdated(this.state.rows);
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col><h4>Items sent</h4></Col>
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
                                            <Typeahead id={"name_" + row.id} maxResults={5} disabled={this.props.itemNameList === null} onChange={(selected) => { this.updateTypeAheadSelectedName(selected, row.id) }} options={this.props.itemNameList} />
                                        </td>
                                        <td><Input type="number" disabled={this.props.itemNameList === null} name={"qty_" + row.id} value={row.qty} onChange={this.updateValue} /></td>
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
                    <Col>Total market price of items sent: {this.state.totalPrice}</Col>
                </Row>
            </Container>
        )
    }
}

/* mapping for redux */
const mapStateToProps = state => {
    return {
        itemNameList: state.itemNameList
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleSentItemsUpdated: (sentList) => dispatch({ type: 'UPDATE_SENT_ITEMS', payload: { "sentItems": sentList } })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SentItemsComponent);