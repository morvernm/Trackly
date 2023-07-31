// import {createContext, useContext, useState} from 'react'
//
// const SearchContext = createContext("");
//
// export const SearchProvider = () => {
//     const [searchTerm, setSearch] = useState("");
//
//     const search = (input) => {
//         setSearch(input);
//     }
//
//     const contextData =  {
//         search,
//     }
//
//     return(
//            <SearchContext.Provider value={contextData}>
//             { children }
//         </SearchContext.Provider>
//     )
// }
// export default SearchProvider;