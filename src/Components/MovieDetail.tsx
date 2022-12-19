import styled from "styled-components";
import { motion, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getMovie, IMovieDetail } from "../api";
import { useQuery } from "react-query";

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

export const BigInfo = styled(motion.div)`
  position: absolute;
  z-index: 100;
  width: 80%;
  max-width: 750px;
  height: 85vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  overflow-y: auto;
  background-color: ${(props) => props.theme.black.lighter};
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const BigInfoCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

export const BigInfoWrapper = styled.div`
  overflow: hidden;
  margin: 0px 20px;
  display: flex;
  flex-direction: column;
`;

export const BigInfoTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: min(46px, 5vw);
  font-weight: 500;
  max-width: 90%;
`;
export const BigInfoTagline = styled.h5`
  font-size: min(3vw, 2em);
  margin-bottom: 3px;
`;
export const BigInfoGenres = styled.div`
  font-size: 1em;
  ul {
    li {
      border-radius: 3px;
      padding: 1px;
      color: ${(props) => props.theme.white.lighter};
      background-color: ${(props) => props.theme.black.darker};
      float: left;
      margin-right: 4px;
      margin-bottom: 3px;
    }
  }
  @media screen and (max-width: 500px) {
    font-size: 0.5em;
  }
`;
export const BigInfoTime = styled.div`
  font-size: 0.8em;
  span {
    color: ${(props) => props.theme.white.lighter};
  }
  @media screen and (max-width: 500px) {
    font-size: 0.4em;
  }
`;
export const BigInfoVote = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  span:nth-of-type(1) {
    font-size: 2.3vw;
    color: #ffd400;
    font-weight: 400;
  }
  span:last-of-type {
    font-size: 1.3vw;
    font-weight: 400;
  }
  @media screen and (max-width: 500px) {
    margin: -10px 0 -5px 0;
  }
`;

export const BigInfoOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  margin-bottom: 20px;
  font-size: 1em;
  @media screen and (max-width: 500px) {
    font-size: 0.5em;
  }
`;

interface IMovieDetailProps {
  movieId: number;
  rowIndex?: number | string | null;
  from?: string;
  keyword?: string;
}

function MovieDetail({ movieId, rowIndex, from, keyword }: IMovieDetailProps) {
  const history = useHistory();
  const { scrollY } = useScroll();

  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movie/:movieId");

  const { data, isLoading } = useQuery<IMovieDetail>(
    ["movieDetail", movieId],
    () => getMovie(movieId)
  );

  const onOverlayClick = () => {
    from === "tv" && history.push("/tv");
    from === "search" && history.push(`/search?keyword=${keyword}`);
    from === "home" && history.push("/");
    !from && history.push("/");
  };

  const clickedMovie =
    from === "search"
      ? data
      : bigMovieMatch?.params.movieId &&
        data?.id === +bigMovieMatch.params.movieId &&
        data;

  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <BigInfo
        style={{ top: scrollY.get() + 50 }}
        layoutId={movieId + "_" + rowIndex}
      >
        {isLoading ? null : (
          <>
            {clickedMovie && (
              <>
                <BigInfoCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                      clickedMovie.backdrop_path,
                      "w500"
                    )})`,
                  }}
                />
                <BigInfoWrapper>
                  <BigInfoTitle>{clickedMovie.title}</BigInfoTitle>
                  <BigInfoTagline>{clickedMovie?.tagline}</BigInfoTagline>
                  <BigInfoGenres>
                    <span>Genres</span>
                    <ul>
                      {clickedMovie?.genres.map((i) => (
                        <li key={i.id}>{i.name}</li>
                      ))}
                    </ul>
                  </BigInfoGenres>
                  <BigInfoTime>
                    Release Date : <span>{data?.release_date}</span>
                    <br />
                    Runtime : <span>{data?.runtime} Minutes</span>
                  </BigInfoTime>
                  <BigInfoVote>
                    <span style={{ marginTop: "3px", marginRight: "10px" }}>
                      ★ {data?.vote_average?.toFixed(1)}
                    </span>
                    <span style={{ marginTop: "3px" }}>
                      ({data?.vote_count?.toLocaleString("ko-KR")} Voted)
                    </span>
                  </BigInfoVote>

                  <BigInfoOverview>{clickedMovie.overview}</BigInfoOverview>
                </BigInfoWrapper>
              </>
            )}
          </>
        )}
      </BigInfo>
    </>
  );
}

export default MovieDetail;
