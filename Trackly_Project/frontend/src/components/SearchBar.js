import {useState} from "react";
import {Link} from "react-router-dom";
import {Button, Form, InputGroup} from "react-bootstrap";
import {BiSearch} from "react-icons/bi";

export const SearchBar = () => {
    const [searchInput, setSearch] = useState('');

      const handleSearch = (e) => {
          return(
              {}
          )
            console.log(searchInput);
        }
    return (
        <InputGroup className="mb-2">
                          <Form.Control id="search-box" onChange={event => setSearch(event.target.value)} placeholder="Search for an Artist or Album" aria-label="Search for an artist or album" aria-describedby="basic-addon2"/>
                          <Link to="/search"><Button  onClick={handleSearch} type="submit"  id="button-addon2"><BiSearch /></Button></Link>
                        </InputGroup>
    )
}