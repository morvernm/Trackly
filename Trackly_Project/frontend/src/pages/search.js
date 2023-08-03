import {Row, Col, Button, Form, InputGroup, Container, Card, Dropdown, Alert, Offcanvas} from "react-bootstrap";
import {BiSearch} from "react-icons/bi";
import React, {useState, useEffect} from "react";
import {SearchBar} from "../components/SearchBar";
import {CLIENT_ID, CLIENT_SECRET, accessToken, expiry} from "../utils/spotify"
import {createSearchParams, Link, useNavigate} from "react-router-dom";
import axios from "axios";


export const Search = () => {
    const [searchInput, setSearch] = useState("");
    const [albums, setAlbums] = useState(false);
    const [albumsFound, setAlbumsFound] = useState(false);
    const[accessToken, setAccessToken] = useState("")
    const [expiry, setExpiry] = useState([])
    const [isLoaded, setLoaded] = useState(false);
    const [artistName, setArtistName] = useState("");
    const [tracks, setTracks] = useState();

      const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();
  const [albumName, setAlbumName] = useState("");


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
        // let searchParams = {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + accessToken
        //     }
        // }
        let artistData = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParams)
            .then(response => response.json())
            .then(data =>  {
                setArtistName(data[data.artists.items[0].name]);
                // console.log("artist ID is " + data.artists.items[0].id);
                return [data.artists.items[0].id, data.artists.items[0].name];
            })
            .catch(Exception => {
                throw new Error("Sorry, there is a problem with our connection to Spotify search");
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
            // let artists;
            // if(album.artists.length > 0) {
            //     artists = album.artists[0], album.artists[1];
            // }else {
            //     artists = album.artists[0];
            // }
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
            });

        }));
    } catch (error) {
        console.log("could not add album to database or album already exists")
        console.log(albums);
    }
}


// async function fetchTracks(album) {
//         try {
//                let tracks = await fetch('https://api.spotify.com/v1/albums/' + album.id + '??market=GB' + searchParams)
//                 .then(response => response.json())
//                 .then(data =>  {
//                     console.log("songs are" + data);
//                 setTracks(data.items);
//                 // if(Object.keys(data.items).length > 0) {
//                 //     console.log("albums found:" + albumsFound);
//                 //     createAlbums(data.items, artistData[1]);
//                 // }
//             });
//         }catch (error) {
//          console.log("could not add songs to database");
//         }
// }

// fetchTracks(albums);
// async function createSongs(tracks) {
//         await axios.post('http://127.0.0.1:8000/api/song/create', {
//             spotify_song_id: tracks.
//             is_playable: album.is_playable
//             title
//             url
//             favourited_by
//             album: album.id
//         })
//
// }
// createSongs(albums);

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

    // function navigateToAlbum(artistName, albumName) {
    //     console.log("going to album page");
    //     navigate("/album");
    //     console.log(artistName + " " + albumName);
    // }

    return (
        <Container className="search-results">
            <InputGroup className="mb-2">
                          <Form.Control required id="search-box" onKeyDown={handleKeyDown} onChange={event => setSearch(event.target.value)} placeholder="Search for an Artist or Album" aria-label="Search for an artist or album" aria-describedby="basic-addon2"/>
                          <Link to="/search"><Button  onClick={search} type="submit"  id="button-addon2"><BiSearch /></Button></Link>
                        </InputGroup>
            {/*4 columns max in 1 row*/}
            <Row className=" mx-2 row row-cols-3 p-2">
                {/*<p>artist info here?</p>*/}
                {albums == 0 ? console.log("waiting to perform a search ") : albums.map( (album, i) => {
                    return (
                         <Card className="search-card p-2 mb-sm-8">
                            <Card.Img src={album.images[0].url} variant="top"  />
                             <Card.Body>
                                <Link to={`/album/${album.name.toLowerCase().replace(/\s+/g, "-")}`}><Card.Title >{album.name} </Card.Title></Link>
                            </Card.Body>
                         </Card>
                    )

                })
                }

            </Row>
            <div className="searchMessage">
                <Alert variant="light"><h4 className="m-2">{checkIfAlbumsFound()}</h4></Alert>
            </div>
        </Container>

    )
}


