import styled from "styled-components";
import { IVideo } from "../api";
import { makeImagePath } from "../utils";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";

const BannerItems = styled.div<{ bghpoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bghpoto});
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

const BtnRow = styled.div`
  display: flex;
  margin-top: 5px;
  gap: 1vw;
`;

const InfoBtn = styled(motion.button)`
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter};
  border-radius: 5px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1vw;
  width: 9vw;
  height: 3vw;
  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
  }
  span {
    font-size: 1.2vw;
  }
  @media screen and (max-width: 500px) {
    width: 10vw;
    height: 5vw;
  }
`;

function Banner({ video, from }: { video: IVideo; from: string }) {
  const history = useHistory();
  const onBoxClicked = (videoId: number) => {
    from === "home" && history.push(`/movie/${videoId}`);
    from === "tv" && history.push(`/tv/${videoId}`);
  };

  return (
    <>
      <BannerItems bghpoto={makeImagePath(video?.backdrop_path || "")}>
        <Title>{video.title && video.name}</Title>
        <Overview>{video.overview}</Overview>
        <BtnRow>
          <InfoBtn onClick={() => onBoxClicked(Number(video.id))}>
            <svg
              style={{ width: "20%" }}
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
            <span>Details</span>
          </InfoBtn>
        </BtnRow>
      </BannerItems>
    </>
  );
}

export default Banner;
