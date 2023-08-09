import {useParams, Link} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../AuthProvider";
import axios from "axios";
import {Button, Card, Col, Container, Row, Image, Modal, Form, Alert} from "react-bootstrap";
import {Rating} from "@mui/material";
import Comment from "../components/Comment";
import {MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBContainer, MDBInput, MDBRow} from "mdb-react-ui-kit";

export const Reviews = () => {
    const { id, username } = useParams();
    const {auth, userId} = useContext(AuthContext);
    const [reviews, setReviews] = useState("");
    const [error, setError] = useState("");
    const [isReviewAuthor, setReviewAuthor] = useState(false);
    const [reviewContent, setReviewContent] = useState([]);
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [deletionStatus, setDeletionStatus] = useState("");
    const [variant, setVariant] = useState("");
    const [showDeleteStatus, setShowDeleteStatus] = useState(false);
    const [comments, setComments] = useState("");


    const reviewData = Object.freeze( {
        title: '',
        album: '',
        author: '',
        content: '',
        rating: '',
        status: ''
        }
    )


    function checkIfAuthor() {
           console.log("checking if current user is author");
        if(id == userId)  {
            setReviewAuthor(true);
            console.log("current user is the author");
        }
    }

    // getting the user's reviews

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


    //  setting the initial content of each review, so it can be modified by the user


            useEffect(() => {
                    if(reviews.length > 1) {
                        const reviewData = reviews.map((review, i) => ({
                     id: review.id,
                    title: review.title,
                    album: review.album,
                    author: userId,
                    content: review.content,
                    rating: review.rating,
                    status: "published"
                }));
                        setReviewContent(reviewData);
                    }else if(reviews.length === 1) {
                        // setReviewContent(reviews);
                        //  console.log(reviews);
                        const reviewData = {
                            id: reviews[0].id,
                            title: reviews[0].title,
                            album: reviews[0].album,
                            author: userId,
                            content: reviews[0].content,
                            rating: reviews[0].rating,
                            status: "published"
                        }
                        setReviewContent([reviewData]);
                    }
                        // console.log("review content data is " + reviewContent);


                console.log("initial review content is: " + reviewContent);
}, [reviews]);
             console.log("initial review content is: " + reviewContent);

        // }


//     fetching all comments for each review


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

    const handleChange = (e) => {
        setReviewContent({
            ...reviewContent,
            // trimming data as it has spaces
            [e.target.name]: e.target.value.trim(),
        });
        console.log(reviewContent);
    };

// console.log(comments);

    const handleShow = (i) => {
        console.log(modalData);
        setShow(true);
    };

    function handleDelete() {
        setDeleteMessage("Deletion is permanent. Are you sure you want to delete this review? ");
        setShowDeleteStatus(true);
    }

    // delete and modify operations

    function deleteReview(reviewId) {
        console.log("now deleting review");
        axios.delete(`http://127.0.0.1:8000/api/review/${reviewId}`)
            .then(response => {
                setShowDelete(false);
                console.log("Review deleted");
                setVariant("success");
                setDeletionStatus("Review deleted");
                setShowDeleteStatus(true);
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

    function save(reviewId) {
        const reviewToEdit = Array.isArray(reviewContent)
    ? reviewContent.find((review) => review.id === reviewId)
    // : reviews[0]
      :  reviewContent
        console.log("final review content is : " + reviewContent);
        // let reviewToEdit;
        // if(Array.isArray(reviewContent)) {
        //     reviewToEdit = reviewContent.find((review) => review.id === reviewId);
        // }else {
        //
        //     reviewToEdit = reviewContent.id;
        // }
        // const reviewToEdit = Array.isArray(reviewContent)
    // ? reviewContent.find((review) => review.id === reviewId)
    // : reviewId;
        // const reviewToEdit = reviewContent.find((review) => review.id === reviewId);
        if(reviewToEdit === undefined) {
            console.log("no changes to review");
            setVariant("danger");
            setDeletionStatus("Please edit your review to save it");
            setShowDeleteStatus(true);
        }
        // const reviewToEdit = reviews.find((review) => review.id === reviewId);
        // console.log("now editing review" + reviewToEdit.id);
        // console.log("review content:" + reviewContent);
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
                setDeletionStatus("Review saved")
                // setShowDeleteStatus(true)

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
    <Link to={`/profile/${id}`}><h4>Back to profile</h4></Link>
    {reviews.length === 0 ? noReviews() : reviews.map((review, i)  => { return (
         <Card className="review-card mt-2 mb-5 p-2" >
                   <Row className="review-row">
                      <Col className="mr-2" sm={3}>
                          <Image src={review.album_data.img_url} style={{width: '10rem'}}></Image>
                          <p><Link to={`/album/${review.album_data.spotify_album_id}`}>{review.album_data.title}</Link></p>
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
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" required>
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
            <Button variant="primary" type="submit" onClick={() => save(modalData.id)}>Save</Button>
            <Button variant="danger" type="submit" onClick={handleDelete}>Delete</Button>
            <Alert show={showDelete} variant="danger">{deleteMessage}<br /><br />
                <Button variant="danger"  onClick={() => deleteReview(modalData.id)}>Yes, delete</Button>  <Button onClick={() => setShowDelete(false)}>Cancel</Button></Alert>
            <Alert show={showDeleteStatus} variant={variant}>{deletionStatus}</Alert>
        </Modal.Footer>
      </Modal>
                                     </div>
                           }
                       </Col>
                       <Col className="comments">
                           <h5>Comments</h5>

 {/*Comment code is from MDB Bootstrap Comment template https://mdbootstrap.com/docs/react/extended/comments/*/}

                           {comments && comments.map((comment, index) => {
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
                      {/*<MDBCardImage*/}
                      {/*  src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp"*/}
                      {/*  alt="avatar"*/}
                      {/*  width="25"*/}
                      {/*  height="25"*/}
                      {/*/>*/}
                      <p className="small mb-0 ms-2">{comment.user}</p>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>)})
                               }
                       </Col>
                   </Row>
               </Card>
  )})}
     </Container>
)


}