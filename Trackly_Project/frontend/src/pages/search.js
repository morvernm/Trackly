import {Row, Col, Button, Form, InputGroup, Container, Card, Dropdown} from "react-bootstrap";
import {BiSearch} from "react-icons/bi";
import React, {useState, useEffect} from "react";
import {SearchBar} from "../components/SearchBar";
import {CLIENT_ID, CLIENT_SECRET, accessToken, expiry} from "../utils/spotify"
import {Link} from "react-router-dom";

export const Search = () => {
    const [searchInput, setSearch] = useState("");
    const [albums, setAlbums] = useState(false);
    const [albumsFound, setAlbumsFound] = useState("");
    const[accessToken, setAccessToken] = useState("")
    const [expiry, setExpiry] = useState([])
    const [isLoaded, setLoaded] = useState('false');
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

        // .then(data => console.log(data))
        // .then(data => console.log(data.expires_in))
        // .then(data => setAccessToken(data.access_token))
        // .then(data => setExpiry(data.expires_in))


}, [])

    async function search() {
        console.log("Searching for " + searchInput);
        let searchParams = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
        let artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParams)
            .then(response => response.json())
            .then(data =>  {
                // console.log("artist ID is " + data.artists.items[0].id);
                return data.artists.items[0].id;
            })
            .catch(Exception => {
                throw new Error("Sorry, there is a problem with our connection to Spotify search");
            })
           console.log("the value of artistID is " + artistID);

        let albums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=GB&limit=50', searchParams)
        .then(response => response.json())
            .then(data =>  {
                console.log(data);
                setAlbums(data.items);
                setLoaded(true);
                if(data.length > 0) {
                    setAlbumsFound(true);
                }else if(data.length <= 0 && isLoaded == true){
                    return (
                        <div><p>No albums found!</p></div>
                    )
                }
            });
           //  .catch(Exception => {
           //      throw new Error("Sorry, there is a problem with our connection to Spotify search");
           //  })
           // console.log("the value of artistID is " + artistID);
        // if(data.length <= 0 ="") {
        //     return (<div>Sorry no albums found!</div>);
        // }
    }


    function handleKeyDown(event) {
        if(event.code == "Enter") {
            search();
        }

    }
    console.log(albums);

    function handleClick() {
        console.log("clicked on filter");
    }

    return (
        <Container className="search-results">
            <InputGroup className="mb-2">
                          <Form.Control id="search-box" onKeyDown={handleKeyDown} onChange={event => setSearch(event.target.value)} placeholder="Search for an Artist or Album" aria-label="Search for an artist or album" aria-describedby="basic-addon2"/>
                          <Link to="/search"><Button  onClick={search} type="submit"  id="button-addon2"><BiSearch /></Button></Link>
                        </InputGroup>
                  <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">Filter</Dropdown.Toggle>
                          <Dropdown.Menu>
                              <Dropdown.Item onClick={handleClick} href="#/action-1">Artists</Dropdown.Item>
                              <Dropdown.Item onClick={handleClick}>Albums</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
            <h3>Albums</h3>
            {/*4 columns max in 1 row*/}
            <Row className=" mx-2 row row-cols-3 p-2">
                {albums == 0 ? console.log("waiting to perform a search ") : albums.map( (album, i) => {
                    return (
                         <Card className="search-card p-2 mb-sm-8">
                            <Card.Img src={album.images[0].url} variant="top"  />
                             <Card.Body>
                                <Card.Title>{album.name}</Card.Title>
                            </Card.Body>
                         </Card>
                    )
                })
                }
            </Row>
        </Container>

    )
}

