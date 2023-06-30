import {Container, Col, Image, Row,} from "react-bootstrap";
import album from "../album-placeholder.png";

export const albumGrid = () => {
    return(
        <Container>
             <Row id="album-row">
                     <Col className="album-col">
                         {/*<h4>Artist name</h4>*/}
                        <Image src={album} className="img-thumbnail" alt="Album cover" />
                     </Col>
                     <Col className="album-col">
                        <Image src={album} className="img-thumbnail" alt="Album cover" />
                    </Col>
                    <Col className="album-col">
                        <Image src={album} className="img-thumbnail" alt="Album cover" />
                    </Col>
                 </Row>
                <br />
                 <Row id="album-row">
                     <Col className="album-col">
                       <Image src={album} className="img-thumbnail" alt="Album cover" />
                     </Col>
                     <Col className="album-col">
                       <Image src={album} className="img-thumbnail" alt="Album cover" />
                    </Col>
                    <Col className="album-col">
                        <Image src={album} className="img-thumbnail" alt="Album cover" />
                    </Col>
                </Row>
        </Container>

    )
}
