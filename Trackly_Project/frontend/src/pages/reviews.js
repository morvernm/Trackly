import {useParams, Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../AuthProvider";
import axios from "axios";
import {Button, Card, Col, Container, Row, Image, Modal, Form, Alert} from "react-bootstrap";
import {Rating} from "@mui/material";
export const Reviews = () => {
    const { id, username } = useParams();
    const {auth, userId} = useContext(AuthContext);
    const [reviews, setReviews] = useState("");
    const [error, setError] = useState("");
    const [isReviewAuthor, setReviewAuthor] = useState(false);
    const [reviewContent, setReviewContent] = useState();
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    // const [showDelete, setShowDelete] = useState(false);
    // const [editingReview, setEditingReview] = useState(-1);

    function checkIfAuthor() {
           console.log("checking if current user is author");
        if(id == userId)  {
            setReviewAuthor(true);
            console.log("current user is the author");
        }
    }
    // async function getReviews() {
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/user/${id}/reviews/`)
            .then((response) => {
                setReviews(response.data)
                checkIfAuthor();
            }).catch(error => {
                setError(error);
                console.log("error fetching reviews");
        });

    }, []);

    const handleShow = (i) => {
        console.log(modalData);
        setShow(true);
    };
    function save() {
        console.log("saving edited review");

    }
    function handleDelete() {
        setDeleteMessage("Deletion is permanent. Are you sure you want to delete this review? ");
        setShowDelete(true);
    //     popup -are you sure
    //     call api to delete

    }

    function deleteReview() {
        console.log("now deleting review");
    }

    const handleClose = () => {
        setShow(false);
    }

    const handleChange = (e) => {
        setReviewContent({
            ...reviewContent,
            // trimming data as it has spaces
            [e.target.name]: e.target.value.trim(),
        });
        console.log(reviewContent);
    };

    // useEffect( () => {
    //     checkIfAuthor();
    // });

    // if(error !== undefined) {
    //     return (<div><h3>Sorry we encountered an error loading this user's reviews</h3>
    //         <h4>Please try again later</h4>
    //     </div>)
    // }


    return (
<Container className="review-container">
     <h1>Reviews</h1>
    <Link to={`/profile/${id}`}><h4>Back to profile</h4></Link>
    {reviews.length === 0 ? console.log("no reviews") : reviews.map((review, i)  => { return (
         <Card className="review-card mt-2 mb-5 p-2" >
                   <Row className="review-row">
                      <Col className="mr-2" sm={3}>
                          <Image src={review.album_data.img_url} style={{width: '10rem'}}></Image>
                          <p><Link to={`/album/${review.album_data.title}`}>{review.album_data.title}</Link></p>
                          <p>{review.album_data.artist}</p>
                          <Rating alt="star-rating"  value={review.rating} readOnly></Rating>
                       </Col>
                       <Col xs={3}>
                       </Col>
                       <Col className="review-content" sm={5}>
                           <h4>Review</h4>
                           <br />
                              <Card.Title>{review.title}</Card.Title>
                              <br/>   <br/>
                            <Card.Text>{review.content}</Card.Text>
                           {isReviewAuthor &&
                               <div>
                                   <Button key={i} variant="secondary" className="m-20" onClick={() => {setModalData(review); handleShow(i)}}>Edit review</Button>

                                 <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
        <Modal.Header style={{color: 'black'}} closeButton><Modal.Title>Edit your review</Modal.Title></Modal.Header>
        <Modal.Body>
                 <Form id="review-form">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Review title</Form.Label>
              <Form.Control
                type="text"
                // placeholder={modalData.title}
                defaultValue={modalData.title}
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
                onChange={handleChange}
                defaultValue={modalData.content}/>
            </Form.Group>
                     <Form.Group
              className="mb-3"
              controlId="rating" required
                >
              <Form.Label>Rating </Form.Label>
                         <Rating name="rating" defaultValue={modalData.rating} onChange={handleChange}></Rating>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" type="submit" onClick={save}>Save</Button>
            <Button variant="danger" type="submit" onClick={handleDelete}>Delete</Button>
            <Alert show={showDelete} variant="danger">{deleteMessage}<br /><br />
                <Button variant="danger"  onClick={deleteReview}>Yes, delete</Button>  <Button onClick={() => setShowDelete(false)}>Cancel</Button></Alert>
        </Modal.Footer>
      </Modal>
                                     </div>
                           }

                       </Col>
                   </Row>
               </Card>
  )})}
     </Container>
    )
}