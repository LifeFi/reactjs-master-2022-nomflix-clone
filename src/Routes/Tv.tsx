import { useQuery } from "react-query";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import { getTvs, IGetVideosResult, IVideo } from "../api";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Banner from "../Components/Banner";
import Slider from "../Components/Slider";
import TvDetail from "../Components/TvDetail";

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

function Tv() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/tv/:movieId");

  const { data: dataLatestShows, isLoading: isLoadingLatestShows } =
    useQuery<IGetVideosResult>(["tvs", "LatestShows"], getTvs);

  const { data: dataArirangToday, isLoading: isLoadingArirangToday } =
    useQuery<IGetVideosResult>(["tvs", "LatestShows"], getTvs);

  const { data: dataPopular, isLoading: isLoadingPopular } =
    useQuery<IGetVideosResult>(["tvs", "Popular"], getTvs);

  const { data: dataTopRated, isLoading: isLoadingTopRated } =
    useQuery<IGetVideosResult>(["tvs", "TopRated"], getTvs);

  const [rowIndex, setRowIndex] = useState<number | null>(null);

  const onBoxClicked = (movieId: number, rowIndex: number) => {
    setRowIndex(rowIndex);
    history.push(`/tv/${movieId}`);
  };

  return (
    <Wrapper>
      {isLoadingLatestShows ||
      isLoadingArirangToday ||
      isLoadingPopular ||
      isLoadingTopRated ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner video={dataLatestShows?.results[0] as IVideo}></Banner>
          <Slider
            title="Latest Shows"
            from="tv"
            data={dataLatestShows as IGetVideosResult}
            rowIndex={0}
            onBoxClicked={onBoxClicked}
          ></Slider>
          <Slider
            title="Arirang Today"
            from="tv"
            data={dataArirangToday as IGetVideosResult}
            rowIndex={1}
            onBoxClicked={onBoxClicked}
          ></Slider>

          <Slider
            title="Popular"
            from="tv"
            data={dataPopular as IGetVideosResult}
            rowIndex={2}
            onBoxClicked={onBoxClicked}
          ></Slider>
          <Slider
            title="Top Rated"
            from="tv"
            data={dataTopRated as IGetVideosResult}
            rowIndex={3}
            onBoxClicked={onBoxClicked}
          ></Slider>

          <AnimatePresence>
            <>{console.log(bigMovieMatch)}</>
            {bigMovieMatch ? (
              <TvDetail
                tvId={Number(bigMovieMatch?.params.movieId)}
                rowIndex={rowIndex}
                from="tv"
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
