import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../imgSrc";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

//css
const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{bgPhoto: string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), 
  url(${props => props.bgPhoto});
  background-size: cover;
  color: white;
`;
const Title = styled.h2`
  font-size: 50px;
  width: 50%;
  margin-bottom: 20px;  
`;
const Overview = styled.p`
  font-size: 25px;
  width: 40%;
`;
const Slider = styled.div`
  position: relative;
  top: -100px;  
`;

const Slidertitle = styled.h3`
  font-size: 30px;
  margin: 20px 10px;
  padding-left: 10px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;  
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{bgPhoto: string}>`  
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left; //가장 왼쪽 사진 잘림 방지
  }
  &:last-child {
    transform-origin: center right; //가장 오른쪽 사진 잘림 방지
  }  
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  width: 100%;
  position: absolute;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
    color: ${props => props.theme.white.darker};
    font-weight: 500;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
  position: absolute; 
  width: 40vw; 
  height: 80vh;             
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color : ${props => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;    
`;
const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;  
`;
const BigTitle = styled.h3`
  color: ${props => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;
const BigOverview = styled.p`
  padding: 20px;
  top: -80px;
  color: ${props => props.theme.white.lighter};
`;

//variants
const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0
  },
  exit: {
    x: -window.outerWidth - 5,
  },
}

const BoxVariants = {
  default: {
    scale: 1,
  },
  hover: {    
    scale: 1.2,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    }
  }
}
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    }
  }
}

//offset
const offset = 6;


function Movies() {
  const history = useHistory(); //useHistory - 여러 route사이를 움직일 수 있음
  const bigMovieMatch = useRouteMatch<{movieId: string}>("/movies/:movieId"); //해당하는 url맞는지 판별
  const { scrollY } = useViewportScroll();
  const {data: nowData, isLoading: nowLoading} = useQuery<IGetMoviesResult>(
    ["nowMovies", "nowPlaying"], getMovies);  
  const [index, setIndex] = useState(0);  
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (nowData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowData.results.length - 1; // 현재 홈 스크린 페이지 1개 제외
      const maxIndex = Math.floor(totalMovies / offset ) - 1; // 시작이 0이므로 max는 -1
      setIndex(prev => (prev === maxIndex ? 0 : prev + 1));}
  };
  const toggleLeaving = () => setLeaving(prev => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/"); //goback도 가능 
  const ClickedMovie = bigMovieMatch?.params.movieId && nowData?.results
  .find(movie => movie.id+"" === bigMovieMatch.params.movieId); //클릭한 타켓 아이디 일치여부 판별 
  return (
    <Wrapper>{nowLoading ? (
      <Loader>Movie Loading..</Loader>) : (
        <>
          <Banner 
            onClick = {increaseIndex} 
            bgPhoto={makeImagePath(nowData?.results[0].backdrop_path || "")}>
            <Title>{nowData?.results[0].title}</Title>
            <Overview>{nowData?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <Slidertitle>Now Playing</Slidertitle>           
            <AnimatePresence initial = {false} onExitComplete = {toggleLeaving}>            
              <Row 
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{type: "tween", duration: 1}}
                key={index} 
              >
                {nowData?.results.slice(1).slice(offset * index, offset * index + offset)
                .map((movie) => (
                  <Box
                    layoutId={movie.id + ""} 
                    key = {movie.id}
                    variants = {BoxVariants}
                    whileHover = "hover"
                    initial = "default"
                    onClick = {() => onBoxClicked(movie.id)}
                    transition={{type: 'tween'}}                                      
                    bgPhoto = {makeImagePath(movie.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants} >
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>  
                ))}
              </Row>
            </AnimatePresence>            
          </Slider>          
          <AnimatePresence>
            {bigMovieMatch ? (
            <>
              <Overlay onClick={onOverlayClick} animate = {{ opacity: 1}} exit = {{opacity: 0}}/>
              <BigMovie
                layoutId={bigMovieMatch.params.movieId}
                style = {{top: scrollY.get() + 100 }}  // 어디에 위치하든 같은 위치에 있도록 함              
              >
                {ClickedMovie && (
                <>
                  <BigCover style = {{backgroundImage: `linear-gradient(to top, black, transparent),
                    url(${makeImagePath(
                    ClickedMovie.backdrop_path, "w500")})`,
                    }} 
                  />
                  <BigTitle>{ClickedMovie.title}</BigTitle>                  
                  <BigOverview>{ClickedMovie.overview}</BigOverview>
                </>
                )}
              </BigMovie>
            </>
            ): null}
          </AnimatePresence>                    
        </>
      )}
    </Wrapper>
  );
}

export default Movies;