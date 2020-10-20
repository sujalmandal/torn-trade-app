import React, { Component } from "react";
import { Container, Row, Col } from 'reactstrap';


class FooterComponent extends Component {

    render() {
        return <Container>
            <Col>
                <Row>
                    <br/>
                </Row>
                <Row>
                    <span style={{ "fontSize": "80%" }}><i>
                        If you think this tool is useful & want to <span style={{ "textDecoration":"line-through" }}>make me rich</span> donate, or if the tool is broken,
                        please click&nbsp;<a href="https://www.torn.com/profiles.php?XID=2575642">here</a>
                    </i></span>
                </Row>
            </Col>
        </Container>
    }
}

export default FooterComponent;