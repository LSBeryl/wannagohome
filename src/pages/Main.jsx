import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import dates from "../data/dates.json";
import exams from "../data/exams.json";
import logo from "../assets/image/logo.png";
import school from "../assets/image/school.png";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function Main() {
  const [homeTimeText, setHomeTimeText] = useState("");
  const [homeTimeDate, setHomeTimeDate] = useState("");
  const [homeTimeIdx, setHomeTimeIdx] = useState(0);
  const [filteredDates, setFilteredDates] = useState([]);
  const [examsState, setExamsState] = useState([...exams]);
  const [menu, setMenu] = useState(0); // 0 : 남은 시험, 1 : opgg식 메뉴
  const [grade, setGrade] = useState(1);

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

  function getFormatTime(date) {
    const curDate = new Date();
    const purDate = new Date(date);
    const remMs = purDate - curDate - 9 * 1000 * 60 * 60;
    const remDay = Math.floor(remMs / (1000 * 60 * 60 * 24));
    const remHrs = Math.floor((remMs / (1000 * 60 * 60)) % 24);
    const remMin = Math.floor((remMs / (1000 * 60)) % 60);
    const remSec = Math.floor((remMs / 1000) % 60);
    return `${formatNumber(remDay)} : ${formatNumber(remHrs)} : ${formatNumber(
      remMin
    )} : ${formatNumber(remSec)}`;
  }

  function getIfList(type) {
    const curDate = new Date();
    const purDate = new Date(`${curDate.getFullYear() - grade + 1}-03-02`);
    const remMs = curDate - purDate - 9 * 1000 * 60 * 60;
    switch (type) {
      case "curry":
        return Math.floor(Math.floor(remMs / (1000 * 60)) / 3).toLocaleString(
          "ko-KR"
        );
      case "money":
        return (Math.floor(remMs / (1000 * 60 * 60)) * 9860).toLocaleString(
          "ko-KR"
        );
      case "sleep":
        return Math.floor(
          Math.floor(remMs / (1000 * 60 * 60 * 24))
        ).toLocaleString("ko-KR");
    }
  }

  useEffect(() => {
    setFilteredDates(
      dates.filter((date) => {
        const parsedDate = new Date(date.date);
        const curDate = new Date();
        return parsedDate - 9 * 1000 * 60 * 60 > curDate;
      })
    );
  }, []);

  useEffect(() => {
    const countInterval = setInterval(() => {
      const curTime = new Date();
      const homeTimeString = filteredDates[homeTimeIdx].date;
      const homeTime = new Date(homeTimeString);
      const remMs = homeTime - curTime - 9 * 1000 * 60 * 60;
      const remDay = Math.floor(remMs / (1000 * 60 * 60 * 24));
      const remHrs = Math.floor((remMs / (1000 * 60 * 60)) % 24);
      const remMin = Math.floor((remMs / (1000 * 60)) % 60);
      const remSec = Math.floor((remMs / 1000) % 60);
      setHomeTimeText(
        `${formatNumber(remDay)} : ${formatNumber(remHrs)} : ${formatNumber(
          remMin
        )} : ${formatNumber(remSec)}`
      );
      setExamsState((prev) => [...prev]);
      setHomeTimeDate(homeTimeString);
    }, 10);
    return () => {
      clearInterval(countInterval);
    };
  }, [homeTimeIdx, filteredDates]);

  return (
    <Wrapper>
      <Title>
        <div>
          <img src={logo} alt="" />
          집에 가고 싶어요
        </div>
        <div>
          집에 가고 싶은 디미고인들을 위한 귀가 타이머. 그래도 집은 못 감 ㅋ
        </div>
      </Title>
      <MainBox>
        <div>
          <div>
            <span>
              {getDay(homeTimeDate)}요
              {filteredDates[homeTimeIdx]?.isAll ? " 전체" : " 선택"}
              귀가
            </span>
            까지 남은 시간
          </div>
          <div>
            귀가일 : {homeTimeDate} ({getDay(homeTimeDate)})
          </div>
        </div>
        <div>
          <ChevronsLeft
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
              <div>일</div>
              <div>시간</div>
              <div>분</div>
              <div>초</div>
            </div>
            <div>{homeTimeText}</div>
          </div>
          <ChevronsRight
            size="1.3rem"
            onClick={() => {
              setHomeTimeIdx((prev) => {
                if (prev < filteredDates.length - 1) return prev + 1;
                else return prev;
              });
            }}
          />
        </div>
      </MainBox>
      <MenuTitle>
        <ChevronsLeft
          size="1.3rem"
          onClick={() => {
            setMenu((prev) => {
              if (prev > 0) return prev - 1;
              else return prev;
            });
          }}
        />
        <div>
          {menu == 0 && "남은 시험"}
          {menu == 1 && "디미고에 안 다녔다면..."}
        </div>
        <ChevronsRight
          size="1.3rem"
          onClick={() => {
            setMenu((prev) => {
              if (prev < 1) return prev + 1;
              else return prev;
            });
          }}
        />
      </MenuTitle>
      {menu == 1 && (
        <Grade>
          <select
            onChange={(e) => {
              setGrade(Number(e.target.value));
            }}
          >
            <option value={1}>1학년</option>
            <option value={2}>2학년</option>
            <option value={3}>3학년</option>
          </select>
        </Grade>
      )}
      {menu == 0 && (
        <BoxContainer>
          {examsState.map((exam) => (
            <Box>
              <div>
                <span>{exam.name}</span>까지
              </div>
              <div>{getFormatTime(exam.date)}</div>
            </Box>
          ))}
        </BoxContainer>
      )}
      {menu == 1 && (
        <BoxContainer>
          <Box small="1">
            <div>
              <span>3분 카레</span>
            </div>
            <div>{getIfList("curry")}개 제조</div>
          </Box>
          <Box small="1">
            <div>
              <span>2024년 최저임금으로</span>
            </div>
            <div>{getIfList("money")}원 벌기</div>
          </Box>
          <Box small="1">
            <div>
              <span>수면</span>
            </div>
            <div>{getIfList("sleep")}일 꿀잠</div>
          </Box>
          <Box small="1">
            <div>
              <span>이성 교제</span>
            </div>
            <div>0회</div>
          </Box>
        </BoxContainer>
      )}
    </Wrapper>
  );
}
const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 5rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  /* height: 100vh; */
  overflow-x: hidden;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        rgba(255, 255, 255, 0.9),
        rgba(255, 255, 255, 0.9)
      ),
      url(${school}) no-repeat center center;
    background-size: cover;
    filter: blur(5px);
    z-index: -1;
  }
`;

const Title = styled.div`
  @font-face {
    font-family: "YoonChildfundkoreaManSeh";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/2408@1.0/YoonChildfundkoreaManSeh.woff2")
      format("woff2");
    font-weight: normal;
    font-style: normal;
  }
  width: 100vw;
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

const MainBox = styled.div`
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
  transition: box-shadow 0.2s ease;
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
            font-size: 0.6rem;
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
        display: flex;
        flex-direction: column;
        align-items: center;
        & > div:nth-child(1) {
          display: flex;
          justify-content: space-around;
          width: 110%;
          & > div {
            text-align: center;
          }
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
`;

const MenuTitle = styled.div`
  width: 15vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  & > *:not(div) {
    cursor: pointer;
  }
  @media (max-width: 1024px) {
    width: 25vw;
  }
  @media (max-width: 768px) {
    width: 80vw;
  }
`;

const Grade = styled.div`
  margin-block: -0.5rem;
  & > select {
    border: 0;
    outline: none;
    padding: 0.2rem 0.5rem;
    border-radius: 0.2rem;
    box-shadow: 0px 2px 5px rgb(0, 0, 0, 0.25);
  }
`;

const BoxContainer = styled.div`
  width: 40vw;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  @media (max-width: 1024px) {
    width: 60vw;
  }
  @media (max-width: 768px) {
    width: 80vw;
  }
`;

const Box = styled.div`
  @font-face {
    font-family: "EliceDigitalBaeum_Bold";
    src: url("https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_220508@1.0/EliceDigitalBaeum_Bold.woff2")
      format("woff2");
    font-weight: 700;
    font-style: normal;
  }
  width: calc(50% - 0.5rem);
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0px 2px 5px rgb(0, 0, 0, 0.25);
  box-sizing: border-box;
  padding: 1rem;
  & > div {
    &:nth-child(1) {
      font-weight: 300;
      & > span {
        font-weight: 600;
      }
      @media (max-width: 435px) {
        font-size: 0.8rem;
      }
    }
    &:nth-child(2) {
      display: flex;
      justify-content: center;
      margin-block: 0.5rem;
      font-family: "EliceDigitalBaeum_Bold";
      color: rgba(244, 67, 54, 1);
      ${(props) =>
        props.small
          ? css`
              font-size: 1.5rem;
              @media (max-width: 400px) {
                font-size: 1.2rem;
              }
            `
          : css`
              font-size: 2rem;
              @media (max-width: 400px) {
                font-size: 1.5rem;
              }
            `}
    }
  }
  @media (max-width: 1300px) {
    width: 100%;
  }
`;
