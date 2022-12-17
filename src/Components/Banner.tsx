import styled from "styled-components";
import { IMovie } from "../api";
import { makeImagePath } from "../utils";
// import { motion } from "framer-motion";
// import { useHistory } from "react-router-dom";

const BannerItems = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

function Banner({ movie }: { movie: IMovie }) {
  return (
    <BannerItems bgPhoto={makeImagePath(movie?.backdrop_path || "")}>
      <Title>{movie.title}</Title>
      <Overview>{movie.overview}</Overview>
    </BannerItems>
  );
}

export default Banner;
