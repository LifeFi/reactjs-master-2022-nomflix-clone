import styled from "styled-components";
import { motion, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getTv, ITv } from "../api";
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
  z-index: 100;
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

interface ITvDetailProps {
  tvId: number;
  rowIndex?: number | string | null;
  from?: string;
  keyword?: string;
}

function TvDetail({ tvId, rowIndex, from, keyword }: ITvDetailProps) {
  const history = useHistory();
  const { scrollY } = useScroll();

  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");

  const { data, isLoading } = useQuery<ITv>(["tvDetail", tvId], () =>
    getTv(tvId)
  );

  const onOverlayClick = () => {
    from === "tv" && history.push("/tv");
    from === "search" && history.push(`/search?keyword=${keyword}`);
    from === "home" && history.push("/");
    !from && history.push("/");
  };

  const clickedTv =
    bigTvMatch?.params.tvId && data?.id === +bigTvMatch.params.tvId && data;

  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <BigMovie
        style={{ top: scrollY.get() + 50 }}
        layoutId={bigTvMatch?.params.tvId + "_" + rowIndex}
      >
        {isLoading ? null : (
          <>
            {clickedTv && (
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                      clickedTv.backdrop_path,
                      "w500"
                    )})`,
                  }}
                />
                <BigTitle>{clickedTv.name}</BigTitle>
                <BigOverview>{clickedTv.overview}</BigOverview>
              </>
            )}
          </>
        )}
      </BigMovie>
    </>
  );
}

export default TvDetail;
