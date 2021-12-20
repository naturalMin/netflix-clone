import styled from "styled-components";
import { useQuery } from "react-query";
import { makeImagePath } from "../imgSrc";
import { getTVShows, IGetTVShowsResult } from "../api";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

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
const Des = styled(motion.div)`
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
const PopupTv = styled(motion.div)`
  position: absolute; 
  width: 40vw; 
  height: 80vh;             
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color : ${props => props.theme.black.veryDark};
  border-radius: 15px;
  overflow: hidden;
`;
const PopupImg = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
`;
const PoptupName = styled.h3`
  color: ${props => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;`;
const PopupOverview = styled.p`
  padding: 20px;
  top: -80px;
  color: ${props => props.theme.white.lighter};
`;

//variants
const rowVars = {
  hidden: {
    x: window.outerWidth + 15,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 15,
  },
}

const boxVars = {
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

const desVars = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: 'tween',
    }
  }
}

const offset = 6;

function TvShow() {
  const {data, isLoading} = useQuery<IGetTVShowsResult>(["tvShow", "airingToday"], getTVShows);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const history = useHistory();
  const {scrollY} = useViewportScroll();
  const popupTvMatch = useRouteMatch<{tvId: string}>("/tv/:tvId");
  const toggleLeaving = () => setLeaving(prev => !prev);
  const addIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTV = data.results.length - 1;
      const MaxIndex = Math.floor(totalTV / offset) - 1;
      setIndex(prev => (prev === MaxIndex ? 0 : prev + 1));
    };
  };
  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => history.push("/tv");
  const ClickedTv = popupTvMatch?.params.tvId && data?.results
  .find(movie => movie.id+"" === popupTvMatch.params.tvId);  
  return (
    <Wrapper>
      {isLoading ? (<Loader>TV Loading...</Loader>) : (
        <>
          <Banner
            onClick = {addIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial= {false} onExitComplete={toggleLeaving}>
              <Row 
                variants={rowVars}
                initial= "hidden"
                animate= "visible"
                exit="exit"
                transition={{type: "tween", duration: 1}}
                key={index}
              >
                {data?.results.slice(1).slice(offset * index, offset * index + offset)
                .map((tv) =>
                (<Box
                  layoutId = {tv.id + ""}
                  onClick = {() => onBoxClicked(tv.id)}
                  variants={boxVars}
                  initial = "default"
                  whileHover= "hover"
                  transition={{type: 'tween'}}                                                                        
                  bgPhoto = {makeImagePath(tv.backdrop_path, "w500")}
                >
                  <Des variants={desVars}>
                    <h4>{tv.name}</h4>
                  </Des>
                </Box>))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {popupTvMatch ? (
              <>
                <Overlay onClick={onOverlayClick} animate = {{ opacity: 1}} exit = {{opacity: 0}}/>
                <PopupTv
                  layoutId = {popupTvMatch.params.tvId}
                  style = {{top: scrollY.get() + 100 }}
                >
                  {ClickedTv && (
                    <>
                      <PopupImg style = {{backgroundImage: `linear-gradient(to top, black, transparent),
                        url(${makeImagePath(
                        ClickedTv.backdrop_path, "w500")})`,
                    }}/>
                      <PoptupName>{ClickedTv.name}</PoptupName>
                      <PopupOverview>{ClickedTv.overview}</PopupOverview>
                    </>
                  )}
                </PopupTv>
              </>
            ): null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default TvShow;