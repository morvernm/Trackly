import {Row, Button, Form, InputGroup, Container, Card, Alert,} from "react-bootstrap";
import {BiSearch} from "react-icons/bi";
import React, {useState, useEffect, useContext} from "react";
import {CLIENT_ID, CLIENT_SECRET} from "../utils/spotify"
import {Link} from "react-router-dom";
import axios from "axios";
import AuthContext from "../AuthProvider";


export const Search = () => {
    const [searchInput, setSearch] = useState("");
    const [albums, setAlbums] = useState(false);
    const [albumsFound, setAlbumsFound] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [artistName, setArtistName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorShow, setErrorShow] = useState(false);
    const {setSpotifyToken, setExpiry, spotifyAccessToken, spotifyExpiry} = useContext(AuthContext);


    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

           let searchParams = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + spotifyAccessToken
            }
        }

    /*     the search function below was based off code from this tutorial:
        Title: Building a Spotify API Searcher in React
        Author: Cooper Codes
        https://www.youtube.com/watch?v=1PWDxgqLmDA&t=2032s

     */

    async function search() {
        console.log("Searching for " + searchInput);
        let artistData = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParams)
            .then(response => response.json())
            .then(data =>  {
                    setArtistName(data[data.artists.items[0].name]);
                    return [data.artists.items[0].id, data.artists.items[0].name];

            })
            .catch(Exception => {
                    setErrorShow(true);
                    setErrorMessage("Sorry we encountered a problem, please try again later");
            })
        async function createArtist(artistData) {
            await axios.post('http://127.0.0.1:8000/api/artist/create/', {
                spotify_artist_id: artistData[0],
                name: artistData[1]
            })
                .catch(Exception => {
                    console.log("Could not add artist to the database");
                });
        }

        await createArtist(artistData);

           /*  the albums code below was based off code from this tutorial:
        Title: Building a Spotify API Searcher in React
        Author: Cooper Codes
        https://www.youtube.com/watch?v=1PWDxgqLmDA&t=2032s

     */


        let albums = await fetch('https://api.spotify.com/v1/artists/' + artistData[0] + '/albums' + '?include_groups=album&market=GB&limit=50', searchParams)
        .then(response => response.json())
            .then(data =>  {
                console.log("data is " + data);
                setAlbums(data.items);
                setLoaded(true);
                if(Object.keys(data.items).length > 0) {
                    setAlbumsFound(true);
                    console.log("albums found:" + albumsFound);
                    createAlbums(data.items, artistData[1]);
                }
            })
            .catch((error) => {
                 setErrorShow(true);
                 setErrorMessage("Sorry we encountered a problem, please try again later");
            });
    }

       /*  the album code above was based off code from this tutorial:
        Title: Building a Spotify API Searcher in React
        Author: Cooper Codes
        https://www.youtube.com/watch?v=1PWDxgqLmDA&t=2032s

     */


    async function createAlbums(albums, artist) {
    try {
        await Promise.all(albums.map(async (album) => {
            await axios.post('http://127.0.0.1:8000/api/album/create/', {
                spotify_album_id: album.id,
                title: album.name,
                artist: artist,
                img_url: album.images[0].url,
                review_count: 0,
                favourited_by: 0,
                disliked_by: 0,
            }).then((res) => {

            })
        }));
    } catch (error) {
        if(error.status === 400) {
                console.log("could not add album to database or album already exists")
        }

    }
}


    function checkIfAlbumsFound() {
        if(isLoaded && !albumsFound) {
            return (<Alert variant="light"><h4 className="m-2">Sorry no albums were found for this artist. Try searching for a different artist</h4></Alert>);
        }
        else {
            return "";
        }

    }

    function handleKeyDown(event) {
        if(event.code == "Enter") {
            search();
        }

    }
    console.log(albums);

    return (
        <Container className="search-results">
            <Form onSubmit={(event) => event.preventDefault()}>
                <h1>Search for an artist</h1>
            <InputGroup className="mb-2" required>
                          <Form.Control required id="search-box" onKeyDown={handleKeyDown} onChange={event => setSearch(event.target.value)} placeholder="Artist name" aria-label="Search for an artist or album" aria-describedby="basic-addon2"/>
                         <Button  onClick={search} type="submit"  id="button-addon2"><BiSearch />
                         </Button>
                        </InputGroup>
                </Form>

            {/*4 columns max in 1 row*/}
            <Row className=" mx-2 row row-cols-3 p-2">
                {albums == 0 ? console.log("waiting to perform a search ") : albums.map( (album, i) => {
                    console.log(album.id);
                    return (
                          <Link to={`/album/${album.id}`}><Card className="search-card p-2 mb-sm-8">
                            <Card.Img src={album.images[0].url} variant="top"  />
                             <Card.Body>
                                  <Card.Title >{album.name} </Card.Title>
                            </Card.Body>
                          </Card></Link>
                    )
                })
                }

            </Row>
            <div className="searchMessage">
                <Alert show={errorShow} variant="light"><h4>{errorMessage}</h4></Alert>
            </div>
        </Container>

    )
}


