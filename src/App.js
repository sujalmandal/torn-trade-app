import React from 'react';
import InitialiserComponent from './components/InitialiserComponent'
import ReceivedItemsComponent from './components/ReceivedItemsComponent'
import SentItemsComponent from './components/SentItemsComponent'
import SummaryDetailComponent from './components/SummaryDetailComponent'
import FooterComponent from './components/FooterComponent'
import { Container, Row, Col } from 'reactstrap';
import './css/common.css'
function App() {
  return (
    <Container >
      <Row>
        <InitialiserComponent/>
      </Row>
      <Row>
        <Col><ReceivedItemsComponent/></Col>
        <Col><SentItemsComponent/></Col>
      </Row>
      <Row>
        <SummaryDetailComponent/>
      </Row>
      <Row>
        <FooterComponent/>
      </Row>
    </Container>
  );
}

export default App;