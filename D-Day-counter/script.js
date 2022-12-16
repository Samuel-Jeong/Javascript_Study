const messageContainer = document.querySelector("#d-day-message");
const container = document.querySelector("#d-day-container");

const yearInput = document.querySelector("#target-year-input");
const monthInput = document.querySelector("#target-month-input");
const dateInput = document.querySelector("#target-date-input");

let intervalId = 0;
// const intervalIdArr = [];

///////////////////////////////////////////////////////////////////////////

const initiator = (messageContainer, container) => {
  messageContainer.style.color = "black";
  // messageContainer.textContent = "D-Day를 입력해 주세요";
  messageContainer.innerHTML = "<h3>D-Day를 입력해 주세요.</h3>";

  container.style.display = "none"; // 화면에 보이지 않도록 함
};
initiator(messageContainer, container);

const resetDateInputs = (yearInput, monthInput, dateInput) => {
  yearInput.textContent = "none";
  monthInput.textContent = "none";
  dateInput.textContent = "none";
};
resetDateInputs(yearInput, monthInput, dateInput);

///////////////////////////////////////////////////////////////////////////

const dateFormMaker = function () {
  //console.log(document.querySelector('.target-input')) // Class 참조

  const inputYear = document.querySelector("#target-year-input").value; // ID 참조
  const inputMonth = document.querySelector("#target-month-input").value;
  const inputDate = document.querySelector("#target-date-input").value;

  // const dateFormat = inputYear + '-' + inputMonth + '-' + inputDate;
  // console.log(dateFormat)

  const dateFormat = `${inputYear}-${inputMonth}-${inputDate}`;
  return dateFormat;
};

const counterMaker = function (dateFormat) {
  const nowDate = new Date();
  const targetDate = new Date(dateFormat).setHours(0, 0, 0, 0); // 자정을 기준으로 날짜 형식 정의

  const remaining = Math.floor((targetDate - nowDate) / 1000); // seconds
  if (remaining <= 0) {
    // console.log("타이머가 종료되었습니다.");
    messageContainer.style.color = "green";
    messageContainer.innerHTML = "<h3>타이머가 종료되었습니다.</h3>";
    container.style.display = "none"; // 화면에 보이지 않도록 함
    setClearInterval();
    return;
  }
  // else if (remaining === NaN) { // 통하지 않음
  //   console.log("유효한 시간대가 아닙니다.");
  // }
  else if (isNaN(remaining)) {
    // console.log("유효한 시간대가 아닙니다.");
    messageContainer.style.color = "red";
    messageContainer.innerHTML = "<h3>유효한 시간대가 아닙니다.</h3>";
    container.style.display = "none"; // 화면에 보이지 않도록 함
    setClearInterval();
    return;
  } else {
    messageContainer.style.color = "blue";
    messageContainer.innerHTML = "<h3>D-Day 까지 달리는 중~</h3>";
    container.style.display = "flex";
  }

  //   const remainingSec = Math.floor(remaining % 60); // seconds
  //   const remainingMin = Math.floor((remaining / 60) % 60); // minutes
  //   const remainingHours = Math.floor((remaining / 3600) % 24); // hours
  //   const remainingDate = Math.floor(remaining / 3600 / 24); // days

  const remainingObj = {
    remainingDate: Math.floor(remaining / 3600 / 24), // days
    remainingHours: Math.floor((remaining / 3600) % 24), // hours
    remainingMin: Math.floor((remaining / 60) % 60), // minutes
    remainingSec: Math.floor(remaining % 60), // seconds
  };

  const documentObj = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    min: document.getElementById("min"),
    sec: document.getElementById("sec"),
  };

  // 함수 내부에 함수 정의하여 사용 가능
  const format = (time) => {
    if (time < 10) {
      // 한자리수이면 앞에 0 을 붙인다.
      return "0" + time;
    }
    return time;
  };

  const timeKeys = Object.keys(remainingObj);
  //   const docKeys = Object.keys(documentObj);

  // 인덱스로 접근
  // remainingObj 와 documentObj 의 키와 필드 속성 순서가 일치해야 한다.
  //   for (let i = 0; i < timeKeys.length; i++) {
  //     documentObj[docKeys[i]].textContent = remainingObj[timeKeys[i]];
  //   }

  // 변수로 접근
  let i = 0;
  for (let docKey in documentObj) {
    documentObj[docKey].textContent = format(remainingObj[timeKeys[i]]);
    i++;
  }

  //   documentObj["days"].textContent = remainingObj.remainingDate; // ID 로 가져올 수 있다.
  //   documentObj["hours"].textContent = remainingObj.remainingHours;
  //   documentObj.min.textContent = remainingObj["remainingMin"];
  //   documentObj.sec.textContent = remainingObj["remainingSec"];
  //   document.querySelector("#days").textContent = remainingDate; // span 태그를 사용
  //   document.querySelector("#hours").textContent = remainingHours;
  //   document.querySelector("#min").textContent = remainingMin;
  //   document.querySelector("#sec").textContent = remainingSec;
};

///////////////////////////////////////////////////////////////////////////

const starter = () => {
  const dateFormat = dateFormMaker();
  counterMaker(dateFormat);

  if (intervalId !== 0) {
    clearInterval(intervalId);
  }
  //   intervalId = setInterval(counterMaker, 1000, dateFormat);
  intervalId = setInterval(() => {
    counterMaker(dateFormat);
  }, 1000);

  //   const thisIntervalId = setInterval(counterMaker, 1000, dateFormat);
  //   intervalIdArr.push(thisIntervalId);

  //   for (let i = 0; i < 100; i++) {
  //     setTimeout(() => {
  //       counterMaker(dateFormat);
  //     }, 1000 * i);
  //   }
};

const setClearInterval = () => {
  if (intervalId === 0) {
    return;
  }
  clearInterval(intervalId);

  //   for (let i = 0; i < intervalIdArr.length; i++) {
  //     clearInterval(intervalIdArr[i]);
  //   }
};

const resetTimer = () => {
  initiator(messageContainer, container);
  resetDateInputs(yearInput, monthInput, dateInput);
  setClearInterval();
};
