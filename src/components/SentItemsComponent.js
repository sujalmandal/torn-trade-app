import React, { Component } from "react"
import { Input } from "reactstrap"
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import { Button, ButtonGroup } from 'reactstrap';

class SentItemsComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            totalPrice:0
        }
    }

    render(){
        return(
            <Container>
                <Row>
                    <Col><h4>Items sent</h4></Col>
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
                        <tr>
                        <td><Input type="text" value=""/></td>
                        <td><Input type="number" value="0" /></td>
                        <td><Input type="number" value="" disabled={true}/></td>
                        <td><Input type="number" value="" disabled={true}/></td>
                        <td>
                        <div>
                            <ButtonGroup>
                                <Button color="success">+</Button>
                                <Button color="danger">-</Button>
                            </ButtonGroup>
                        </div>
                        </td>
                        </tr>
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

export default SentItemsComponent;