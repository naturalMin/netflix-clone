import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { BASE_PATH, API_KEY, IGetMoviesResult } from "../api";

const Container = styled.div`
  background: transparent;
  height: 200vh ;
`;

function Search() {
  const location = useLocation(); //location.search parse
  const keyword = new URLSearchParams(location.search).get("keyword");
  const getMovieSearch = () => {
    return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`)
    .then(response => response.json())
    };  
  const {data, isLoading} = useQuery<IGetMoviesResult>(['movie', 'search'], getMovieSearch);
  console.log(data?.results);
  return (
    <Container>
      {isLoading ? 'Searching...' : (<></>)}
    </Container>    
  ); 
}

export default Search;