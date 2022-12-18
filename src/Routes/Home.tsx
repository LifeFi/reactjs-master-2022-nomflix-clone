import { useQuery } from "react-query";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import {
  getMoviesLatest,
  getMoviesTopRated,
  getMoviesUpcoming,
  IGetMoviesResult,
  IMovie,
} from "../api";
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

  const { data: dataLatest, isLoading: isLoadingLatest } =
    useQuery<IGetMoviesResult>(["movies", "Latest"], getMoviesLatest);

  const { data: dataTopRated, isLoading: isLoadingTopRated } =
    useQuery<IGetMoviesResult>(["movies", "TopRated"], getMoviesTopRated);

  const { data: dataUpcoming, isLoading: isLoadingUpcoming } =
    useQuery<IGetMoviesResult>(["movies", "Upcoming"], getMoviesUpcoming);

  const [rowIndex, setRowIndex] = useState<number | null>(null);

  const onBoxClicked = (movieId: number, rowIndex: number) => {
    setRowIndex(rowIndex);
    history.push(`/movies/${movieId}`);
  };

  return (
    <Wrapper>
      {isLoadingLatest || isLoadingTopRated || isLoadingUpcoming ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner movie={dataLatest?.results[0] as IMovie}></Banner>
          <Slider
            title="Latest Movies"
            data={dataLatest as IGetMoviesResult}
            rowIndex={0}
            onBoxClicked={onBoxClicked}
          ></Slider>
          <Slider
            title="Top Rated Movies"
            data={dataTopRated as IGetMoviesResult}
            rowIndex={1}
            onBoxClicked={onBoxClicked}
          ></Slider>
          <Slider
            title="Upcoming Movies"
            data={dataUpcoming as IGetMoviesResult}
            rowIndex={2}
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
