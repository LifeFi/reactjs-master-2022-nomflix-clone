import styled from "styled-components";
import { motion, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getMovie, IMovie } from "../api";
import { useQuery } from "react-query";

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
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

export interface IDetailProps {
  movieId: number;
  rowIndex?: number | string | null;
  search?: string;
}

function Detail({ movieId, rowIndex, search }: IDetailProps) {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useScroll();

  const { data, isLoading } = useQuery<IMovie>(["movieDetail", movieId], () =>
    getMovie(movieId)
  );

  const onOverlayClick = () => {
    history.push("/");
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.id === +bigMovieMatch.params.movieId &&
    data;

  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <BigMovie
        style={{ top: scrollY.get() + 100 }}
        layoutId={bigMovieMatch?.params.movieId}
      >
        {isLoading ? null : (
          <>
            {clickedMovie && (
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                      clickedMovie.backdrop_path,
                      "w500"
                    )})`,
                  }}
                />
                <BigTitle>{clickedMovie.title}</BigTitle>
                <BigOverview>{clickedMovie.overview}</BigOverview>
              </>
            )}
          </>
        )}
      </BigMovie>
    </>
  );
}

export default Detail;
