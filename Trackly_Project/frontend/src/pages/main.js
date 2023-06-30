import logo from '../logo.svg'
import album from '../album-placeholder.png'
import { Container, Row, Col, Image } from "react-bootstrap"
import { albumGrid } from '../components/albumGrid';
export const Main = () => {

    return (
        <Container>
                    <h1>Trackly</h1> <br />
                <img src={logo} className="App-logo" alt="logo" />
               <h2> Connect. Discover. </h2>
            <br />
             <span>Welcome to Trackly - share your reviews and connect with music lovers</span>
                <br />
                <br />
               <card>
                   <h3>Track your music collection</h3>
               </card>
            <br />
            {/*could make below a commponent and import it, instead of having all code in here*/}
            <div>
                {albumGrid()}
                {/* <Row className="album-row">*/}
                {/*     <Col className="album-col">*/}
                {/*         /!*<h4>Artist name</h4>*!/*/}
                {/*        <Image src={album} className="img-thumbnail" alt="Album cover" />*/}
                {/*     </Col>*/}
                {/*     <Col className="album-col">*/}
                {/*        <Image src={album} className="img-thumbnail" alt="Album cover" />*/}
                {/*    </Col>*/}
                {/*    <Col className="album-col">*/}
                {/*        <Image src={album} className="img-thumbnail" alt="Album cover" />*/}
                {/*    </Col>*/}
                {/* </Row>*/}
                {/*<br />*/}
                {/* <Row className="album-row">*/}
                {/*     <Col className="album-col">*/}
                {/*       <Image src={album} className="img-thumbnail" alt="Album cover" />*/}
                {/*     </Col>*/}
                {/*     <Col className="album-col">*/}
                {/*       <Image src={album} className="img-thumbnail" alt="Album cover" />*/}
                {/*    </Col>*/}
                {/*    <Col className="album-col">*/}
                {/*        <Image src={album} className="img-thumbnail" alt="Album cover" />*/}
                {/*    </Col>*/}
                {/*</Row>*/}
            </div>

                   </Container>
        );

};