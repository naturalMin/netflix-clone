import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { makeImagePath } from "../imgSrc";
import { BASE_PATH, API_KEY, IGetMoviesResult, IGetTVShowsResult } from "../api";

const Container = styled.div`  
  padding: 0 20px;  
  margin: 10vh auto;  
`;
const Header = styled.div`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Title = styled.h1`
  color: ${props => props.theme.white.lighter};
  font-size: 50px;
`;
const SearchGroup = styled.ul`
  display : grid;
  grid-template-columns  : repeat(6, 1fr);
  width: 100%;
  gap: 10px;
`;
const SearchList = styled.li<{bgPhoto: string}>`
  margin: 2vh auto;
  width: 100%;
  height: 281px;  
  background-image: url(${props => props.bgPhoto});
  background-color: whitesmoke;
  background-position  : center center;
  background-size: cover;
  position: relative;
  z-index: -1;    
  div {    
    font-size: 20px;
    text-align: center;
    width: 100%;
    height: 5vh;    
    position: absolute;
    bottom:0;
    background-color: rgba(0, 0, 0, 0.5);        
  }
`;


function Search() {
  const location = useLocation(); //location.search parse
  const keyword = new URLSearchParams(location.search).get("keyword");
  const getMovieSearch = () => {
    return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`)
    .then(response => response.json())
    };   
  const {data: MovieData , isLoading: MovieLoading } = useQuery<IGetMoviesResult>(['movie', 'search'], getMovieSearch);
  const getTvSearch = () => {
    return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`)
    .then(response => response.json())
    };
  const {data: TvData , isLoading: TvLoading } = useQuery<IGetTVShowsResult>(['tv', 'search'], getTvSearch);     
  return (
    <Container>
      <Header>
          <Title>Movie search Result</Title>
      </Header>
      {MovieLoading ? 'Movie Result Searching...' : (    
        <SearchGroup>
          {MovieData?.results.map(movie => (
          <SearchList 
            key = {movie.id}
            bgPhoto = {makeImagePath(movie.backdrop_path, "w500")}
          >
            <div>{movie.title}</div>
          </SearchList>))}
        </SearchGroup>
      )}
      <hr />
      <Header>
          <Title>Tv search Result</Title>
      </Header>
      {TvLoading ? 'TV Result Searching...' : (    
        <SearchGroup>
          {TvData?.results.map(tv => (
          <SearchList 
            bgPhoto = {makeImagePath(tv.backdrop_path, "w500")}
            key = {tv.id}
          >
            <div>{tv.name}</div>
          </SearchList>))}
        </SearchGroup>
      )}
    </Container>    
  ); 
}

export default Search;