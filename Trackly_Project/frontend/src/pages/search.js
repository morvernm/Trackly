import {Row, Button, Form, InputGroup, Container, Card, Alert,} from "react-bootstrap";
import {BiSearch} from "react-icons/bi";
import React, {useState, useEffect} from "react";
import {CLIENT_ID, CLIENT_SECRET} from "../utils/spotify"
import {Link} from "react-router-dom";
import axios from "axios";


export const Search = () => {
    const [searchInput, setSearch] = useState("");
    const [albums, setAlbums] = useState(false);
    const [albumsFound, setAlbumsFound] = useState(false);
    const[accessToken, setAccessToken] = useState("")
    const [expiry, setExpiry] = useState([])
    const [isLoaded, setLoaded] = useState(false);
    const [artistName, setArtistName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorShow, setErrorShow] = useState(false);

    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



    // request spotify access token
    useEffect(() => {
    let parameters = {
        method: 'POST',
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
        },
       body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
    fetch('https://accounts.spotify.com/api/token', parameters)
        .then(response => response.json())
        .then(data => {
            setAccessToken(data.access_token);
            setExpiry(data.expires_in);
            console.log(accessToken);
            console.log(expiry);

        })
        .catch(error => {
                throw new Error("Sorry, we failed to generate Spotify access tokens!");
        })
}, [])
           let searchParams = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }

    async function search() {
        console.log("Searching for " + searchInput);
        let artistData = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParams)
            .then(response => response.json())
            .then(data =>  {
                setArtistName(data[data.artists.items[0].name]);
                // console.log("artist ID is " + data.artists.items[0].id);
                return [data.artists.items[0].id, data.artists.items[0].name];
            })
            .catch(Exception => {
                // if(searchInput === "") {
                //     console.log("waiting to perform a search")
                // }
                    setErrorShow(true);
                    setErrorMessage("Sorry we encountered a problem, please try again later");
                    // throw new Error("Sorry, there is a problem with our connection to Spotify search");
                // }

            })
        async function createArtist(artistData) {
            await axios.post('http://127.0.0.1:8000/api/artist/create/', {
                spotify_artist_id: artistData[0],
                name: artistData[1]
            })
                .catch(Exception => {
                    throw new Error("Could not add artist to database");
                });
        }

        await createArtist(artistData);


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
            });


        // if(albums.artists.length > 1) {
        //     createArtist(album.artists[0])
        //
        // }

            //  .catch(Exception => {
           //      throw new Error("Sorry, there is a problem with our connection to Spotify search");
           //  })
           // console.log("the value of artistID is " + artistID);
        // if(data.length <= 0 ="") {
        //     return (<div>Sorry no albums found!</div>);
        // }


    }

    async function createAlbums(albums, artist) {
    try {
        await Promise.all(albums.map(async (album) => {
            await axios.post('http://127.0.0.1:8000/api/album/create/', {
                spotify_album_id: album.id,
                title: album.name,
                // artist: album.artists[0].name,
                artist: artist,
                // artist: artists,
                img_url: album.images[0].url,
                review_count: 0,
                favourited_by: 0,
                disliked_by: 0,
            }).then((res) => {

            })
            // };

        }));
    } catch (error) {
        console.log("could not add album to database or album already exists")
        console.log(albums);
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
            <Form onSubmit={search}>
                <h1>Search for an artist</h1>
            <InputGroup className="mb-2" required>
                          <Form.Control required id="search-box" onKeyDown={handleKeyDown} onChange={event => setSearch(event.target.value)} placeholder="Artist name" aria-label="Search for an artist or album" aria-describedby="basic-addon2"/>
                          {/*<Link to="/search"><Button  onClick={search} type="submit"  id="button-addon2"><BiSearch /></Button></Link>*/}
                     <Link to="/search"><Button  type="submit"  id="button-addon2"><BiSearch /></Button></Link>
                        </InputGroup>
                </Form>
            {/*4 columns max in 1 row*/}
            <Row className=" mx-2 row row-cols-3 p-2">
                {/*<p>artist info here?</p>*/}
                {albums == 0 ? console.log("waiting to perform a search ") : albums.map( (album, i) => {
                    console.log(album.id);
                    return (
                         <Card className="search-card p-2 mb-sm-8">
                            <Card.Img src={album.images[0].url} variant="top"  />
                             <Card.Body>
                                  <Link to={`/album/${album.id}`}><Card.Title >{album.name} </Card.Title></Link>
                            </Card.Body>
                         </Card>
                    )

                })
                }

            </Row>
            <div className="searchMessage">
                {/*<Alert variant="light"><h4 className="m-2">{checkIfAlbumsFound()}</h4></Alert>*/}
                <Alert show={errorShow} variant="light"><h4>{errorMessage}</h4></Alert>
            </div>
        </Container>

    )
}


