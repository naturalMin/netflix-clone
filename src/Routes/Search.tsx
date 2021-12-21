import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { BASE_PATH, API_KEY, IGetMoviesResult, IGetTVShowsResult } from "../api";

const Container = styled.div`  
  padding: 0 20px;  
  margin: 10vh auto;
  max-width: 800px;
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
const Movies = styled.ul`  
`;
const Movie = styled.li`
  margin: 2vh auto;
`;
const TvShows = styled.ul``;
const TvShow = styled.li`
  margin: 2vh auto;  
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
  console.log(MovieData, TvData);   
  return (
    <Container>
      <Header>
          <Title>Movie search Result</Title>
      </Header>
      {MovieLoading ? 'Movie Result Searching...' : (    
        <Movies>
          {MovieData?.results.map(movie => (<Movie key = {movie.id}>{movie.title}</Movie>))}
        </Movies>
      )}
      <hr />
      <Header>
          <Title>Tv search Result</Title>
      </Header>
      {TvLoading ? 'TV Result Searching...' : (    
        <TvShows>
          {TvData?.results.map(tv => (<TvShow key = {tv.id}>{tv.name}</TvShow>))}
        </TvShows>
      )}
    </Container>    
  ); 
}

export default Search;