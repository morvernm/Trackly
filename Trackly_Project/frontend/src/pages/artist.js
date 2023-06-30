import { Container, Col, Row } from "react-bootstrap";
import  artistImage from "../album-placeholder.png";
import {albumGrid} from "../components/albumGrid";

export const Artist = () => {
    return (
        <Container>
            <h1>Artist
            </h1>
            <Row>
                <Col>
                    <h2>Artist Name</h2>
                    <img src={artistImage} alt="Artist Name" class="artist-image"/>
                       <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a cursus erat, eget vestibulum
                        tellus. Morbi rhoncus purus non turpis cursus imperdiet. Nam fringilla vulputate eleifend.
                        Aenean euismod mauris non velit finibus efficitur. </p>
                </Col>
                <Col>
                    <h3>Albums</h3>
                    {albumGrid()}

                </Col>
                <Col>
                      <h3>Concerts</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a cursus erat, eget vestibulum
                        tellus. Morbi rhoncus purus non turpis cursus imperdiet. Nam fringilla vulputate eleifend.
                        Aenean euismod mauris non velit finibus efficitur. </p>
                </Col>
            </Row>
        </Container>
    )
}