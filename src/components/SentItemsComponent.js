import React, { Component } from "react"
import { Input } from "reactstrap"
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import { Button, ButtonGroup } from 'reactstrap';
import {IdGenerator} from '../utils/IdGenerator'

class SentItemsComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            totalPrice:0,
            rows:[{id:IdGenerator(),name:"",qty:0,mPrice:0,tPrice:0}]
        }
    }
    addRow=(row)=>{
        this.state.rows.push({
            id:IdGenerator(),
            name:row.name,
            qty:row.qty,
            mPrice:row.mPrice,
            tPrice:row.tPrice
        })
        this.forceUpdate();
    }

    removeRow=(row)=>{
        
    }

    updateValue=(event)=>{
        console.log(event.target.name+" : "+event.target.value)
    }

    render(){
        return(
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
                        {this.state.rows.map((row,index)=>{
                           return (
                            <tr key={row.id}>
                            <td><Input type="text" name={"name_"+row.id} value={row.name} onChange={this.updateValue}/></td>
                            <td><Input type="number" name={"qty_"+row.id} value={row.qty} onChange={this.updateValue}/></td>
                            <td><Input type="number" name={"mPrice_"+row.id} value={row.mPrice} disabled={true}/></td>
                            <td><Input type="number" name={"tPrice_"+row.id} value={row.tPrice} disabled={true}/></td>
                            <td>
                            <div>
                                <ButtonGroup>
                                    <Button color="success" onClick={this.addRow}>+</Button>
                                    <Button color="danger" onClick={this.removeRow}>-</Button>
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

export default SentItemsComponent;