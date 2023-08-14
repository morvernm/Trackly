import {useParams, Link} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../AuthProvider";
import axios from "axios";
import {Button, Card, Col, Container, Row, Image, Modal, Form, Alert} from "react-bootstrap";
import {Rating} from "@mui/material";
import {MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBContainer, MDBInput, MDBRow} from "mdb-react-ui-kit";
import profilePic from '../images/user-placeholder.jpeg';

export const Reviews = () => {
    const { id } = useParams();
    const {auth, userId} = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState("");
    const [isReviewAuthor, setReviewAuthor] = useState(false);
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState("");
    const [deleteWarning, setDeleteWarning] = useState("");
    const [showWarning, setShowWarning] = useState(false);
    const [showDeleteStatus, setShowDeleteStatus] = useState(false);
    const [deletionStatus, setDeletionStatus] = useState("");
    const [variant, setVariant] = useState("");

    const [comments, setComments] = useState("");
    const [reviewContent, setReviewContent] = useState([]);



    function checkIfAuthor() {
           console.log("checking if the current user is author");
        if(id == userId)  {
            setReviewAuthor(true);
            console.log("current user is the author");
        }
    }

    // getting the user's reviews

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/user/${id}/reviews/`)
            .then((response) => {
                setReviews(response.data);
                setReviewContent(response.data);
                checkIfAuthor();
            }).catch(error => {
                setError(error);
                console.log("error fetching reviews");
        });

    }, []);


//     fetching all the comments for each review


useEffect( () => {
    if (reviews) {
        reviews.map((review, i) => {
            axios.get(`http://127.0.0.1:8000/api/review/${review.id}/comments/`)
                .then((response) => {
                    setComments(response.data);
                }).catch(error => {
                console.log("error fetching comments: " + error.message);
            });
        });
    }
}, [reviews]);


    // changing reviewContent when a user edits a review
    const handleChange = (e, reviewId) => {
        const { name, value } = e.target;
        const index = reviewContent.findIndex(review => review.id === reviewId);

    if (index !== -1) {
        const editedReviewContent = [...reviewContent];
        editedReviewContent[index] = {
            ...editedReviewContent[index],
            [name]: value.trim(),
        };
        setReviewContent(editedReviewContent);
    }
    };


    // to control the visibility of the edit review Modal
    const handleShow = (i) => {
        // setReviewToEdit[reviewContent]
        console.log(modalData);
        setShow(true);
    };


    // delete and modify operations

    function handleDelete() {
        console.log("trying to delete review");
        setDeleteWarning("Deletion is permanent. Are you sure you want to delete this review?");
        setShowWarning(true);
    }


    function deleteReview(reviewId) {
        console.log("now deleting review " + reviewId);
        axios.delete(`http://127.0.0.1:8000/api/review/${reviewId}`)
            .then(response => {
                setShowWarning(false);
                console.log("Review deleted");
                setVariant("success");
                setDeletionStatus("Review deleted");
                setShowDeleteStatus(true);
                const updatedReviews = reviews.filter(review => review.id !== reviewId);
                const updatedReviewContent = reviewContent.filter(review => review.id !== reviewId); //deleting the review from the content
                setReviews(updatedReviews);
                setReviewContent(updatedReviewContent);
            })
                .catch(error =>  {
                    setVariant("danger");
                    setDeletionStatus("Sorry we couldn't delete your review. Please try again later.");
                    setShowDeleteStatus(true);
                    if(error.response) {
                         console.log(error.response.data);

                    }else if(error.request) {
                        console.log(error.request.data);
                    }else {
                         console.log("error deleting review. Error: " + error.message);
                    }
                });
    }

    // console.log(typeof reviewContent);
    function save(reviewId) {
        let indexOfReview;
        reviewContent.map((review, i) => {
            if(review.id === reviewId) {
                indexOfReview = i;
            }
        })
        let reviewToEdit = reviewContent[indexOfReview];
        console.log("review to edit is " + reviewToEdit);
            axios.put(`http://127.0.0.1:8000/api/review/${reviewId}/`, {
                title: reviewToEdit.title,
                album: reviewToEdit.album,
                author: reviewToEdit.author,
                content: reviewToEdit.content,
                rating: reviewToEdit.rating,
                status: "published"
            }).then((response) => {
                setShowDeleteStatus(true);
                setVariant("success");
                setDeletionStatus("Review saved");
                const updatedIndex = reviewContent.findIndex(review => review.id === reviewId);
                if (updatedIndex !== -1) {
                    const updatedReview = {
                    ...reviewContent[updatedIndex],
                    id: reviewContent.id,
                    title: reviewContent.title,
                    album: reviewContent.album,
                    content: reviewContent.content,
                    rating: reviewContent.rating,
                 };
                const updatedReviewContent = [...reviewContent];
                updatedReviewContent[updatedIndex] = updatedReview;
                setReviewContent(updatedReviewContent);
                }
        }).catch(error => {
            setShowDeleteStatus(true);
             setVariant("danger");
             setDeletionStatus("Sorry we couldn't save your review. Error: " + error.message);
        })
    }


    const handleClose = () => {
        setShow(false);
    }


    // to encourage the user to write reviews
    function noReviews() {
        return (
            <div><h3>No published reviews</h3>
                {auth && <Link to="/search"><Button>Write a Review</Button></Link>}
            </div>
        )
    }

    return (
        <Container className="review-container">
            <h1>Reviews</h1>
            <Link to={`/profile/user/${id}`}><h4>Back to profile</h4></Link>


            {reviews.length === 0 ? noReviews() : reviews.map((review, i)  => { return (
            <Card className="review-card mt-2 mb-5 p-2" >
                <Row className="review-row">
                      <Col className="mr-2" sm={3}>
                          <Image src={review.album_data.img_url} style={{width: '10rem'}}></Image>
                          <p><Link to={`/album/${review.album_data.spotify_album_id}`}>{review.album_data.title}</Link></p>
                          <p>{review.album_data.artist}</p>
                          <Rating alt="star-rating"  value={review.rating} readOnly></Rating>
                       </Col>

                       <Col xs={3}></Col>
                       <Col className="review-content" sm={5}>
                           <h4>Review</h4><p>{review.published}</p>

                           <br />
                              <Card.Title>{review.title}</Card.Title>
                              <br/>   <br/>
                            <Card.Text>{review.content}</Card.Text>




                           {/*allowing review author to edit their review*/}

                           {isReviewAuthor &&
                               <div>
                                   <Button key={i} variant="secondary" className="m-20" onClick={() =>
                                   {setModalData(review); handleShow(i)}}>Edit review</Button>

                                   <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
                                        <Modal.Header style={{color: 'black'}} closeButton>
                                            <Modal.Title>Edit your review</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form id="review-form">
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" required>
                                                <Form.Label>Review title</Form.Label>
                                                <Form.Control
                                                type="text"
                                                defaultValue={modalData.title}
                                                autoFocus
                                                name="title"
                                                required
                                                onChange={e => handleChange(e, modalData.id)}
                                                />
                                            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="review-content">
              <Form.Label>Your review:</Form.Label>
              <Form.Control as="textarea" rows={3} name="content" required
                onChange={e => handleChange(e, modalData.id)}
                defaultValue={modalData.content}/>
            </Form.Group>
                     <Form.Group
              className="mb-3"
              controlId="rating" required
                >
              <Form.Label>Rating </Form.Label>
                         <Rating name="rating" defaultValue={modalData.rating} onChange={e => handleChange(e, modalData.id)}></Rating>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" type="submit" onClick={() => save(modalData.id)}>Save</Button>

            <Button variant="danger" type="submit" onClick={handleDelete}>Delete</Button>

            <Alert show={showWarning} variant="danger">{deleteWarning}<br /><br />
                <Button variant="danger"  onClick={() => deleteReview(modalData.id)}>Yes, delete</Button>
                <Button onClick={() => setShowWarning(false)}>Cancel</Button></Alert>

            <Alert show={showDeleteStatus} variant={variant}>{deletionStatus}</Alert>
        </Modal.Footer>
      </Modal>
                                     </div>
                           }
                       </Col>
                       <Col className="comments">
                           <h5>Comments</h5>

                           {/*Comment code is from MDB Bootstrap Comment
                           template https://mdbootstrap.com/docs/react/extended/comments/*/}

                           {comments && comments.map((comment, index) => {
                               if(review.id === comment.review) {
                                              return (
                                   <MDBContainer className="mt-5" style={{ maxWidth: "1000px" }}>
                                    <MDBRow className="justify-content-center">
                                    <MDBCol md="8" lg="6">
                                    <MDBCard className="shadow-0 border" style={{ backgroundColor: "#f0f2f5" }}>
            <MDBCardBody>
              <MDBInput wrapperClass="mb-4" placeholder="Type comment..." label="+ Add a comment" />

              <MDBCard className="mb-4">
                <MDBCardBody>
                  <p>{comment.content}</p>

                  <div className="d-flex justify-content-between">
                    <div className="d-flex flex-row align-items-center">
                        <Link to={`/profile/user/${comment.user}`}><p className="small mb-0 ms-2">{comment.user_data.username}</p></Link>
                        <br /><p className="m-2">{comment.written}</p>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>)

                               }
                    })
                               }
                       </Col>
                   </Row>
               </Card>
  )})}
     </Container>
)
}