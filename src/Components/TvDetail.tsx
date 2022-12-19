import styled from "styled-components";
import { useScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";
import { getTv, ITvDetail } from "../api";
import { useQuery } from "react-query";
import { useState } from "react";
import {
  Overlay,
  BigInfo,
  BigInfoCover,
  BigInfoWrapper,
  BigInfoTitle,
  BigInfoGenres,
  BigInfoTime,
  BigInfoVote,
  BigInfoOverview,
} from "./MovieDetail";

const BigInfoSeasons = styled.ul`
  font-size: 1.2vw;
  position: relative;
`;

const BigInfoSeason = styled.li`
  border-radius: 3px;
  padding: 1px;
  color: ${(props) => props.theme.white.lighter};
  background-color: ${(props) => props.theme.black.darker};
  float: left;
  margin-top: 3px;
  margin-right: 4px;
  margin-bottom: 3px;
  &:hover {
    filter: brightness(1.5);
  }
`;

const BigInfoSeasonOverview = styled.p`
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter};
  width: 100%;
  opacity: 0.9;
  padding: 10px;
  top: 100px;
  position: absolute;
  font-size: 1.5em;
  @media screen and (max-width: 500px) {
    font-size: 1em;
    top: 50px;
  }
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

  const [showSeasonOverview, setShowSeasonOverview] = useState<number | null>(
    null
  );
  const { data, isLoading } = useQuery<ITvDetail>(["tvDetail", tvId], () =>
    getTv(tvId)
  );

  const onOverlayClick = () => {
    from === "tv" && history.push("/tv");
    from === "search" && history.push(`/search?keyword=${keyword}`);
    from === "home" && history.push("/");
    !from && history.push("/");
  };

  const clickedTv =
    from === "search"
      ? data
      : bigTvMatch?.params.tvId && data?.id === +bigTvMatch.params.tvId && data;

  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <BigInfo
        style={{ top: scrollY.get() + 50 }}
        layoutId={tvId + "_" + rowIndex}
      >
        {isLoading ? null : (
          <>
            {clickedTv && (
              <>
                <BigInfoCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                      clickedTv.backdrop_path,
                      "w500"
                    )})`,
                  }}
                />
                <BigInfoWrapper>
                  <BigInfoTitle>{clickedTv.name}</BigInfoTitle>
                  <BigInfoSeasons>
                    {clickedTv?.seasons.map((i) => (
                      <div key={i.id}>
                        <BigInfoSeason
                          onMouseEnter={() => setShowSeasonOverview(i.id)}
                          onMouseLeave={() => setShowSeasonOverview(null)}
                        >
                          {i.name}
                        </BigInfoSeason>
                        {showSeasonOverview !== i.id ? null : i.overview ===
                          "" ? null : (
                          <BigInfoSeasonOverview>
                            {i.overview}
                          </BigInfoSeasonOverview>
                        )}
                      </div>
                    ))}
                  </BigInfoSeasons>

                  <BigInfoGenres>
                    <span>Genres</span>
                    <ul>
                      {clickedTv?.genres.map((i) => (
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

                  <BigInfoOverview>{clickedTv.overview}</BigInfoOverview>
                </BigInfoWrapper>
              </>
            )}
          </>
        )}
      </BigInfo>
    </>
  );
}

export default TvDetail;
