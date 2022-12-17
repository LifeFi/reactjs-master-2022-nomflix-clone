import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { getMovies, IGetMoviesResult, IMovie } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";
import Detail from "../Components/Detail";

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

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [rowIndex, setRowIndex] = useState<number | null>(null);

  const onBoxClicked = (movieId: number, rowIndex: number) => {
    setRowIndex(rowIndex);
    history.push(`/movies/${movieId}`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner movie={data?.results[0] as IMovie}></Banner>
          <Slider
            title="현재 상영중인 영화"
            data={data as IGetMoviesResult}
            rowIndex={0}
            onBoxClicked={onBoxClicked}
          ></Slider>

          <AnimatePresence>
            {bigMovieMatch ? (
              <Detail
                movieId={Number(bigMovieMatch?.params.movieId)}
                rowIndex={rowIndex}
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
