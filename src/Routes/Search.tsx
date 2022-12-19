import { useQuery } from "react-query";
import { useLocation, useHistory } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import { ISearchResult, searchAll } from "../api";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import MovieDetail from "../Components/MovieDetail";
import TvDetail from "../Components/TvDetail";

const Wrapper = styled.div`
  background-color: black;
  margin: 100px 0px;
  width: 100%;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SearchTitle = styled.h1`
  padding: 0px 60px;
`;

const BoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  padding: 60px;
  gap: 10px;
`;
const Box = styled(motion.div)<{ bghpoto: string }>`
  height: 200px;
  background-image: url(${(props) => props.bghpoto});
  background-size: cover;
  background-position: center center;
  margin-bottom: 20px;
  border-radius: 5px;
  position: relative;
  box-shadow: 0px 2px 15px 0px rgba(255, 255, 255, 0.22);
  cursor: pointer;
  span {
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const MediaType = styled.div`
  background-color: teal;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -20px;
  left: -10px;
  span {
    color: white;
    font-size: 12px;
    font-weight: bold;
  }
`;
const Info = styled(motion.div)`
  padding: 20px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: center;
    font-size: 14px;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -35,
    zIndex: 99,
    transition: {
      delay: 0.2,
      duration: 0.3,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.3,
      type: "tween",
    },
  },
};

const Search = () => {
  const history = useHistory();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const id = new URLSearchParams(location.search).get("id");
  const [type, setType] = useState("");

  const { data, isLoading } = useQuery<ISearchResult>(["search", keyword], () =>
    searchAll(keyword)
  );

  const onClickBox = (type: string, searchId: number) => {
    setType(type);
    history.push(`/search?keyword=${keyword}&type=${type}&id=${searchId}`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <SearchTitle>{`Movie Search Results : ${keyword}`}</SearchTitle>
          <BoxContainer>
            {data?.results.map((search) => (
              <AnimatePresence>
                {search.media_type === "movie" && (
                  <Box
                    initial="normal"
                    whileHover="hover"
                    variants={boxVariants}
                    key={search.id}
                    layoutId={search.id + "_" + 0}
                    onClick={() => onClickBox(search.media_type, search.id)}
                    bghpoto={
                      search.backdrop_path
                        ? makeImagePath(search.backdrop_path, "w500")
                        : search.poster_path
                        ? makeImagePath(search.poster_path, "w500")
                        : require("../assets/no-image-icon-6.png")
                    }
                  >
                    <MediaType>
                      <span>{search.media_type}</span>
                    </MediaType>
                    <Info variants={infoVariants}>
                      <h4>{search.title ? search.title : search.name}</h4>
                    </Info>
                  </Box>
                )}
              </AnimatePresence>
            ))}
          </BoxContainer>

          <SearchTitle>{`Tv Show Search Results : ${keyword}`}</SearchTitle>
          <BoxContainer>
            {data?.results.map((search) => (
              <AnimatePresence>
                {search.media_type === "tv" && (
                  <Box
                    initial="normal"
                    whileHover="hover"
                    variants={boxVariants}
                    key={search.id}
                    layoutId={search.id + "_" + 1}
                    onClick={() => onClickBox(search.media_type, search.id)}
                    bghpoto={
                      search.backdrop_path
                        ? makeImagePath(search.backdrop_path, "w500")
                        : search.poster_path
                        ? makeImagePath(search.poster_path, "w500")
                        : require("../assets/no-image-icon-6.png")
                    }
                  >
                    <MediaType>
                      <span>{search.media_type}</span>
                    </MediaType>
                    <Info variants={infoVariants}>
                      <h4>{search.title ? search.title : search.name}</h4>
                    </Info>
                  </Box>
                )}
              </AnimatePresence>
            ))}
          </BoxContainer>
          <AnimatePresence>
            {!id ? null : type === "movie" ? (
              <MovieDetail
                movieId={Number(id)}
                key={Number(id)}
                rowIndex={0}
                from="search"
                keyword={keyword + ""}
              />
            ) : type === "tv" ? (
              <TvDetail
                tvId={Number(id)}
                key={Number(id)}
                rowIndex={1}
                from="search"
                keyword={keyword + ""}
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Search;
