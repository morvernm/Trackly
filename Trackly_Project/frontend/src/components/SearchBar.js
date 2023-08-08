import React, {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Alert, Button, Container, Form, InputGroup} from "react-bootstrap";
import {BiSearch} from "react-icons/bi";
import SearchContext from "../SearchProvider";
export const SearchBar = () => {
    const [searchInput, setSearch] = useState("");

    // const { search } = useContext(SearchContext);

    function handleSearch() {
        // search(searchInput);

    }

    function handleKeyDown(event) {
        if (event.code == "Enter") {
            // search(searchInput);
        }
    }
        //
        // }
        console.log(searchInput);
        return (
            <Container className="search-results">
                <InputGroup className="mb-2">
                    <Form.Control id="search-box" onKeyDown={handleKeyDown} onChange={event => setSearch(event.target.value)}
                                  placeholder="Search for an artist" aria-label="Search for an artist or album"
                                  aria-describedby="basic-addon2"/>
                    <Link to="/search"><Button onClick={handleSearch} type="submit"
                                               id="button-addon2"><BiSearch/></Button></Link>
                </InputGroup>
            </Container>
        )
    }
// }