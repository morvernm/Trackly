import logo from '../logo.svg'
import record from '../images/droidrec-svgrepo-com.svg'
import album from '../album-placeholder.png'
import { Container, Card, Button} from "react-bootstrap"
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

                 {/*for artist page?*/}

                 <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={album} />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
            </div>

                   </Container>
        );

};