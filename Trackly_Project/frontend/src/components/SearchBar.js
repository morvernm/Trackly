import React, {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, Container} from "react-bootstrap";
import {BiSearch} from "react-icons/bi";
export const SearchBar = () => {
        return (
            <Container className="search-results">
                    <Link to="/search"><Button type="submit" id="button-addon2"><BiSearch/></Button></Link>
            </Container>
        )
    }
