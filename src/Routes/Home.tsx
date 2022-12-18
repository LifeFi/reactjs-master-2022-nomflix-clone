import { useQuery } from "react-query";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import {
  getMoviesLatest,
  getMoviesTopRated,
  getMoviesUpcoming,
  IGetVideosResult,
  IVideo,
} from "../api";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";
import MovieDetail from "../Components/MovieDetail";

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
    useQuery<IGetVideosResult>(["movies", "Latest"], getMoviesLatest);

  const { data: dataTopRated, isLoading: isLoadingTopRated } =
    useQuery<IGetVideosResult>(["movies", "TopRated"], getMoviesTopRated);

  const { data: dataUpcoming, isLoading: isLoadingUpcoming } =
    useQuery<IGetVideosResult>(["movies", "Upcoming"], getMoviesUpcoming);

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
          <Banner video={dataLatest?.results[0] as IVideo}></Banner>
          <Slider
            title="Latest Movies"
            from="home"
            data={dataLatest as IGetVideosResult}
            rowIndex={0}
            onBoxClicked={onBoxClicked}
          ></Slider>
          <Slider
            title="Top Rated Movies"
            from="home"
            data={dataTopRated as IGetVideosResult}
            rowIndex={1}
            onBoxClicked={onBoxClicked}
          ></Slider>
          <Slider
            title="Upcoming Movies"
            from="home"
            data={dataUpcoming as IGetVideosResult}
            rowIndex={2}
            onBoxClicked={onBoxClicked}
          ></Slider>

          <AnimatePresence>
            <>{console.log(bigMovieMatch)}</>
            {bigMovieMatch ? (
              <MovieDetail
                movieId={Number(bigMovieMatch?.params.movieId)}
                rowIndex={rowIndex}
                from="home"
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
