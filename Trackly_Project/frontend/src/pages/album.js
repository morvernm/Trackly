import {Container, Row, Col, Button, Card, ListGroup, Modal, Form, Image} from "react-bootstrap";
import albumImage from "../album-placeholder.png"
import ReactPlayer from 'react-player'
import {Link, useParams, useNavigate} from "react-router-dom";
import{BiStar, BiDislike, BiSolidStar, BiSolidDislike, BiPlayCircle, BiHeart, BiSolidHeart} from "react-icons/bi";
import {useEffect, useState, useContext, } from "react";
import {Rating, } from "@mui/material";
import axios from "axios";
import AuthContext from "../AuthProvider";

export const Album = () => {
    const { albumName } = useParams();
    const {auth, userId} = useContext(AuthContext);
    const [album, setAlbum] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        if(auth) {
            setShow(true);
        }else {
            navigate("/login");
        }

    }

    const [favourite, setFavourite] = useState(false);
    const [dislike, setDislike] = useState(false);

    const initialData = Object.freeze( {
        title: '',
        album: '',
        author: userId,
        content: '',
        rating: '',
        status: 'draft'
        }

    )
    const [reviewContent, setReviewContent] = useState(initialData);

    const navigate = useNavigate();

    if(auth) {

    }

  const handleChange = (e) => {
        setReviewContent({
            ...reviewContent,
            // trimming data as it has spaces
            [e.target.name]: e.target.value.trim(),
        });
        console.log(reviewContent);
    };

    // useEffect(() => {
            async function getAlbum() {

    //     const getAlbum = async () => {
            try {
                           // setAlbumName();
                           //   console.log(albumName);
                 await axios.get(`http://127.0.0.1:8000/api/album/${albumName}`)
                 .then((res) => {
                     console.log("album id is " + res.data.id);
                     setReviewContent({...reviewContent, album: res.data.id});
                     setAlbum(res.data);

                 })
                 // setAlbum(res.data);
            } catch(error) {
                return (
                    <div>Error loading album!</div>
                )
            }

        }
    // });

    // getAlbum();
  //  useEffect(() => {
  //   getAlbum().then(r =>  console.log("fetched album"));
  // }, []);
 useEffect(() => {
    getAlbum();
  }, [albumName]);

    if(!album) {
        return (<div>Loading album information</div>)
    }


    function addFavourite() {
        if(favourite) {
                    console.log("unfavourited");
        setFavourite(false);
             console.log(favourite);

        }else {
            setFavourite(true);
                 console.log(favourite);
        }


    }

    function addDislike() {
        console.log("disliked");
        setDislike(true);
        console.log(dislike);
    }

    async function publish() {
        if(auth)  {
            // setReviewContent({...reviewContent, status: 'published'});
            console.log("publishing review");
            await axios.post('http://127.0.0.1:8000/api/review/create/', {
                title: reviewContent.title,
                album: reviewContent.album,
                author: reviewContent.author,
                content: reviewContent.content,
                rating: reviewContent.rating,
                status: "published"
        }).catch(Exception => {
                return(
                    <div><p>Sorry we couldn't post your review. Please try again later</p></div>
                );
            })

        }else {
            navigate('/login');
        }

        }


    // }

    function draft() {

        console.log("saving as draft");

    }
    function playSong() {
        console.log("Now playing song");
        setPlaying(true);
    }



    return (
        <Container className="album-page-container">
            <Card className="main-card">
            <Row className="album-pg-row">
                <Col>
                    <Card.Img src={album.img_url} />
                    {/*<Image src={album.img_url} alt="album-name" fluid/>*/}
                </Col>
                <Col>
                    <h3>{albumName.replace(/-/g, " ")}</h3>
                    <h5>{album.artist}</h5>
                </Col>
                <Col>
                    <h5> <Rating value={1} max={1} readOnly emptyIcon={<BiSolidStar></BiSolidStar>}></Rating> 4.5 average star rating</h5>
                    <h5><Rating onClick={addFavourite} max={1} emptyIcon={<BiHeart></BiHeart>} icon={<BiSolidHeart></BiSolidHeart>}></Rating>{album.favourited_by} Favourites</h5>
                    <h5><Rating onClick={addDislike} max={1} emptyIcon={<BiDislike></BiDislike>} icon={<BiSolidDislike></BiSolidDislike>}></Rating>{album.disliked_by} Dislikes</h5>
                       <Button variant="info" style={{ textTransform: 'none' }} onClick={handleShow}>Write a Review</Button>
                </Col>
                <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
        <Modal.Header style={{color: 'black'}} closeButton><Modal.Title>Draft your review</Modal.Title></Modal.Header>
        <Modal.Body>
                 <Form id="review-form">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title of your review"
                autoFocus
                name="title"
                required
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="review-content">
              <Form.Label>Your review:</Form.Label>
              <Form.Control as="textarea" rows={3} name="content" required
                onChange={handleChange}/>
            </Form.Group>
                     <Form.Group
              className="mb-3"
              controlId="rating" required
                >
              <Form.Label>Rating </Form.Label>
                         <Rating name="rating" onChange={handleChange}></Rating>
            </Form.Group>
          {/*                     <Button variant="secondary" onClick={draft}>*/}
          {/*  Save as draft*/}
          {/*</Button>*/}
          {/*                  <Button variant="primary" type="submit">Publish</Button>*/}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={draft}>
            Save as draft
          </Button>
          <Button variant="primary" type="submit" onClick={publish}>Publish</Button>
        </Modal.Footer>
      </Modal>
            </Row>

                <Row className="album-pg-row">
                    <Col>
                        <h4>Tracklist</h4>
                        <ListGroup as="ol" numbered>
                           <ListGroup.Item as="li">Dancer  <Button variant="outline-dark"  className="album-page-icons"  size="lg" onClick={playSong}><BiPlayCircle></BiPlayCircle></Button>
                                  {/*<Button variant="outline-dark"  className="album-page-icons"  size="lg" >   */}
                                      <Rating onClick={addFavourite} max={1} emptyIcon={<BiHeart></BiHeart>} icon={<BiSolidHeart></BiSolidHeart>}></Rating>
                                  {/*</Button>*/}
                           </ListGroup.Item>

                        </ListGroup>

                    </Col>
                    <Col>
                        <h4>{album.review_count} Reviews</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                          <div className="react-player">

                      <ReactPlayer playing={playing} controls="true" url="https://p.scdn.co/mp3-preview/ecc6383aac4b3f4240ae699324573e61c39e6aaf?cid=b471434334d6439ea71999b5d6294d6a"></ReactPlayer>

                </div>
                    </Col>

                </Row>
                <Row>
                       <Col>
                                   <Link to="">Listen to full song on Spotify</Link>
                    </Col>
                </Row>

                </Card>
        </Container>
    )
}