import {createContext, useContext, useState} from 'react'
const SearchContext = createContext();

export const SearchProvider = ({children}) => {
    const [searchTerm, setSearch] = useState("");

    const search = (input) => {
        setSearch(input);
    }

    const contextData =  {
        search,
        searchTerm
    }

    return(
           <SearchContext.Provider value={contextData}>
                  {children}
        </SearchContext.Provider>
    )
}
export default SearchProvider;