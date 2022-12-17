import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { makeImagePath, useWindowDimensions } from "../utils";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { IGetMoviesResult } from "../api";

const SliderWrapper = styled.div`
  position: relative;
  top: -100px;
`;

const SliderTitle = styled(motion.div)`
  margin-bottom: 10px;
  font-size: 1.5vw;
  font-weight: 400;
  padding: 0px 3vw;
  &:hover {
    filter: brightness(1.2);
  }
  @media screen and (max-width: 500px) {
    margin-bottom: 7px;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const NextBtn = styled(motion.button)`
  background-color: rgba(0, 0, 0, 0.3);
  height: 10vw;
  width: 3vw;
  position: absolute;
  right: 0;
  border-radius: 5px 0px 0px 5px;
  opacity: 0;
  cursor: pointer;
  :hover {
    filter: brightness(1.5);
  }
`;

const PrevBtn = styled(NextBtn)`
  border-radius: 0px 5px 5px 0px;
  left: 0;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

interface ISliderProps {
  data: IGetMoviesResult;
  title: string;
  rowIndex: number;
  onBoxClicked: (moiveId: number, rowIndex: number) => void;
}

function Slider({ data, title, rowIndex, onBoxClicked }: ISliderProps) {
  const history = useHistory();

  const { scrollY } = useScroll();

  const width = useWindowDimensions();

  const [index, setIndex] = useState<number[]>([0, 0, 0, 0]);
  const [leaving, setLeaving] = useState(false);
  const [next, setNext] = useState<Boolean>(true);
  const custom = { next, width };

  const changeIndex = (next: boolean, rowIndex: number) => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      setNext(next);
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      next
        ? setIndex((prev) => {
            const result = [...prev];
            result[rowIndex] === maxIndex
              ? (result[rowIndex] = 0)
              : (result[rowIndex] += 1);
            return result;
          })
        : setIndex((prev) => {
            const result = [...prev];
            result[rowIndex] === 0
              ? (result[rowIndex] = maxIndex)
              : (result[rowIndex] -= 1);
            return result;
          });
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  return (
    <SliderWrapper>
      <SliderTitle>{title}</SliderTitle>
      <AnimatePresence
        initial={false}
        onExitComplete={toggleLeaving}
        custom={custom}
      >
        <Row
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index[rowIndex]}
          custom={custom}
        >
          {data?.results
            .slice(1) // rowIndex 1인지에 따라서 분기한다. or 미리 바깥에서 잘라서 보낸다.
            .slice(offset * index[rowIndex], offset * index[rowIndex] + offset)
            .map((movie) => (
              <Box
                layoutId={movie.id + ""}
                key={movie.id}
                whileHover="hover"
                initial="normal"
                variants={boxVariants}
                onClick={() => onBoxClicked(movie.id, rowIndex)}
                transition={{ type: "tween" }}
                bgPhoto={
                  movie.backdrop_path
                    ? makeImagePath(movie.backdrop_path, "w500")
                    : movie.poster_path
                    ? makeImagePath(movie.poster_path, "w500")
                    : "/../assets/no-image-icon-6.png"
                }
              >
                <Info variants={infoVariants}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
        <PrevBtn key="perv" onClick={() => changeIndex(false, rowIndex)}>
          <svg
            style={{ fill: "white", width: "1.5vw" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
        </PrevBtn>
        <NextBtn key="next" onClick={() => changeIndex(true, rowIndex)}>
          <svg
            style={{ fill: "white", width: "1.5vw" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
          </svg>
        </NextBtn>
      </AnimatePresence>
    </SliderWrapper>
  );
}

export default Slider;
