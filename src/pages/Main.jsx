import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import dates from "../data/dates.json";
import logo from "../assets/image/logo.png";
import school from "../assets/image/school.png";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Main() {
  const [homeTimeText, setHomeTimeText] = useState("");
  const [homeTimeDate, setHomeTimeDate] = useState("");
  const [homeTimeIdx, setHomeTimeIdx] = useState(0);

  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);

  function wait(s) {
    return new Promise((res) => setTimeout(res, s * 1000));
  }

  function formatNumber(num) {
    return String(num).padStart(2, "0");
  }

  function getDay(date) {
    const parsedDate = new Date(date);
    const dayNum = parsedDate.getDay();
    if (dayNum == 0) return "일";
    else if (dayNum == 1) return "월";
    else if (dayNum == 2) return "화";
    else if (dayNum == 3) return "수";
    else if (dayNum == 4) return "목";
    else if (dayNum == 5) return "금";
    else if (dayNum == 6) return "토";
  }

  async function changeAnimation() {
    setFadeIn(1);
    await wait(0.5);
    setFadeIn(0);
    setFadeOut(1);
  }

  useEffect(() => {
    const countInterval = setInterval(() => {
      const curTime = new Date();
      const homeTimeString = dates.filter((date) => {
        const parsedDate = new Date(date);
        return parsedDate > curTime;
      })[homeTimeIdx];
      const homeTime = new Date(homeTimeString);
      const remMs = homeTime - curTime;
      const remDay = Math.floor(remMs / (1000 * 60 * 60 * 24));
      const remHrs = Math.floor((remMs / (1000 * 60 * 60)) % 24);
      const remMin = Math.floor((remMs / (1000 * 60)) % 60);
      const remSec = Math.floor((remMs / 1000) % 60);
      setHomeTimeText(
        `${formatNumber(remDay)} : ${formatNumber(remHrs)} : ${formatNumber(
          remMin
        )} : ${formatNumber(remSec)}`
      );
      setHomeTimeDate(homeTimeString);
    }, 100);
    return () => {
      clearInterval(countInterval);
    };
  }, [homeTimeIdx]);

  return (
    <Wrapper>
      <Title>
        <div>
          <img src={logo} alt="" />
          집에 가고 싶어요
        </div>
        <div>
          집에 가고 싶은 디미고인들을 위한 귀가 타이머. 그래도 집은 못 감.
        </div>
      </Title>
      <Box in={fadeIn} out={fadeOut}>
        <div>
          <div>
            <span>
              {getDay(homeTimeDate)}요{getDay(homeTimeDate) != "토" && " 전체"}
              귀가
            </span>
            까지 남은 시간
          </div>
          <div>
            {homeTimeDate} ({getDay(homeTimeDate)})
          </div>
        </div>
        <div>
          <ArrowLeft
            size="1.3rem"
            onClick={() => {
              setHomeTimeIdx((prev) => {
                if (prev > 0) return prev - 1;
                else return prev;
              });
            }}
          />
          <div>
            <div>
              <div>Day</div>
              <div>Hrs</div>
              <div>Min</div>
              <div>Sec</div>
            </div>
            <div>{homeTimeText}</div>
          </div>
          <ArrowRight
            size="1.3rem"
            onClick={() => {
              console.log("hi");
              setHomeTimeIdx((prev) => {
                if (prev < dates.length - 1) return prev + 1;
                else return prev;
              });
            }}
          />
        </div>
      </Box>
    </Wrapper>
  );
}

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  background: linear-gradient(
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0.9)
    ),
    url(${school});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.div`
  @font-face {
    font-family: "YoonChildfundkoreaManSeh";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2408@1.0/YoonChildfundkoreaManSeh.woff2")
      format("woff2");
    font-weight: normal;
    font-style: normal;
  }
  position: fixed;
  top: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  & > div {
    &:nth-child(1) {
      font-family: "YoonChildfundkoreaManSeh";
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 4rem;
      font-weight: 700;
      @media (max-width: 768px) {
        font-size: 3rem;
      }
      @media (max-width: 435px) {
        font-size: 2rem;
      }
    }
    &:nth-child(2) {
      font-size: 0.8rem;
      font-weight: 300;
      color: #888;
      @media (max-width: 768px) {
        font-size: 0.7rem;
      }
    }
  }
  & img {
    height: 5rem;
    @media (max-width: 768px) {
      height: 3rem;
    }
  }
`;

const Box = styled.div`
  &,
  & * {
    user-select: none;
  }
  @font-face {
    font-family: "EliceDigitalBaeum_Bold";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_220508@1.0/EliceDigitalBaeum_Bold.woff2")
      format("woff2");
    font-weight: 700;
    font-style: normal;
  }
  box-sizing: border-box;
  padding: 1rem;
  width: 40vw;
  border-radius: 0.5rem;
  box-shadow: 0px 2px 5px rgb(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  background: #fff;
  transition: all 0.2s ease;
  &:hover {
    box-shadow: 0px 2px 10px rgb(0, 0, 0, 0.25);
  }
  & > div {
    &:nth-child(1) {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      & > div {
        &:nth-child(1) {
          font-size: 1.1rem;
          font-weight: 300;
          & > span {
            font-weight: 600;
          }
          @media (max-width: 768px) {
            font-size: 1rem;
          }
          @media (max-width: 435px) {
            font-size: 0.8rem;
          }
        }
        &:nth-child(2) {
          font-size: 0.9rem;
          color: #aaa;
          font-weight: 200;
          @media (max-width: 768px) {
            font-size: 0.8rem;
          }
          @media (max-width: 435px) {
            font-size: 0.7rem;
          }
        }
      }
    }
    &:nth-child(2) {
      background: linear-gradient(
        90deg,
        rgba(244, 67, 54, 1) 0%,
        rgba(194, 24, 91, 1) 80%,
        rgba(156, 39, 176, 1) 100%
      );
      -webkit-text-fill-color: transparent;
      background-clip: text;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      & > *:not(div) {
        cursor: pointer;
      }
      & > div {
        & > div:nth-child(1) {
          display: flex;
          justify-content: space-around;
          margin-bottom: -0.8rem;
          font-size: 0.8rem;
          @media (max-width: 1100px) {
            margin-bottom: -0.3rem;
          }
          @media (max-width: 575px) {
            margin-bottom: 0;
          }
        }
        & > div:nth-child(2) {
          font-size: 3rem;
          font-family: "EliceDigitalBaeum_Bold";
          @media (max-width: 1100px) {
            font-size: 2rem;
          }
          @media (max-width: 575px) {
            font-size: 1.5rem;
          }
        }
      }
    }
  }
  @media (max-width: 1024px) {
    width: 60vw;
  }
  @media (max-width: 768px) {
    width: 80vw;
  }

  ${(props) =>
    props.out &&
    css`
      animation: ${fadeOut} 0.5s forwards;
    `}
  ${(props) =>
    props.in &&
    css`
      animation: ${fadeIn} 0.5s forwards;
    `}
`;
