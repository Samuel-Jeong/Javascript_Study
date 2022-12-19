import { apiKey } from "./weatherinfo.js";

const SAVED_ITEMS_KEY = "saved-items";
const SAVED_WEATHER_KEY = "saved-weather";

const savedWeatherData = JSON.parse(localStorage.getItem(SAVED_WEATHER_KEY));

/////////////////////////////////////////////////////////////////////////

// DOM : Document Object Model
// 브라우저가 HTML 문서를 파싱하는 과정에서 생겨나는 객체
// html, head, body, title, script, div, h1, input, ul, li, ... >>> 트리 구조로 구성된다.

// 변수 선언자 var 는 Global context 를 사용한다. > 절대 사용 금지
// 변수 선언자 const, let 은 Block context 를 사용한다.

// 변수 선언 단계 : 선언 > 초기화 > 할당
// 선언과 초기화 단계 사이에 TDZ(Temporal Dead Zone) 존재 > 변수 참조 위험 지역
// > 초기화 단계를 거치기 전의 변수를 참조하려고 하면 에러 발생 (Reference Error) (let, const 에만 해당)
// 변수 선언자 var 는 선언과 초기화 단계를 동시에 수행하기 때문에 TDZ 가 존재하지 않음
// > JavaScript 내부적으로 호이스팅을 수행하기 때문에 참조 에러는 발생하지 않지만 할당 에러가 발생한다.
// > 호이스팅 : 함수 또는 변수의 선언이 마치 위로 끌어올려진 것처럼 동작하는 것
// > 그래서 var 변수 선언자를 사용할 경우 Undefined Error 가 발생한다. > 에러를 잡기 힘들다.
// >>> let, const 도 호이스팅이 발생하지만 TDZ 가 존재하기 때문에 이 지점에서 참조 에러가 발생하게 되므로,
// >>> 마치 호이스팅이 발생하지 않는 것으로 보인다.

const todoInput = document.querySelector("#todo-input");
todoInput.addEventListener("keydown", (event) => keyCodeCheck(event));

const deleteBtn = document.querySelector("#delete-btn");
deleteBtn.addEventListener("click", () => deleteAll());

const keyCodeCheck = (event) => {
  // 빈문자열이지 않거나 엔터 누른 경우에만 로직 수행
  if (event.keyCode === 13 && todoInput.value !== "") {
    createTodo();
  }
};

const createTodo = (storageData) => {
  let todoContents = todoInput.value;
  if (storageData) {
    todoContents = storageData.contents;
  }

  const newLi = document.createElement("li");
  const newSpan = document.createElement("span");
  const newBtn = document.createElement("button");

  newLi.addEventListener("dblclick", () => {
    newLi.remove();
    saveItems();
  });

  newBtn.addEventListener("click", () => {
    // complete 라는 클래스를 추가 > 한 번 누르면 추가, 한 번 더 누르면 삭제 (그래서 토글이라고 부름)
    newLi.classList.toggle("complete");
    saveItems();
  });
  newLi.appendChild(newBtn);

  if (storageData?.complete) {
    // if (storageData && storageData.complete)
    // Optinal chaining
    newLi.classList.add("complete");
  }

  newSpan.textContent = todoContents; // 새로 생성된 span 에 입력값 설정
  newLi.appendChild(newSpan); // 새로 생성된 span 을 새로 생성된 li 에 자식 노드로 추가

  const todoList = document.querySelector("#todo-list");
  todoList.appendChild(newLi); // 새로 생성된 li 를 기존에 존재하던 ul 에 자식 노드로 추가
  todoInput.value = "";

  saveItems();
};

/////////////////////////////////////////////////////////////////////////

const deleteAll = function () {
  const liList = document.querySelectorAll("li");
  for (let i = 0; i < liList.length; i++) {
    liList[i].remove();
  }
  saveItems();
};

const saveItems = function () {
  const savedItems = [];

  const todoList = document.querySelector("#todo-list");
  const todoListChildren = todoList.children;
  for (let i = 0; i < todoListChildren.length; i++) {
    const todoObj = {
      contents: todoListChildren[i].querySelector("span").textContent,
      complete: todoList.children[i].classList.contains("complete"),
    };
    savedItems.push(todoObj);
  }

  uploadTodoListToStorage(savedItems);
};

/////////////////////////////////////////////////////////////////////////

const uploadTodoListToStorage = (savedItems) => {
  // 삼항 연산자
  savedItems.length === 0
    ? localStorage.removeItem(SAVED_ITEMS_KEY)
    : localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(savedItems));
};

const loadSavedTodoList = () => {
  const savedTodoList = JSON.parse(localStorage.getItem(SAVED_ITEMS_KEY));
  if (savedTodoList) {
    for (let i = 0; i < savedTodoList.length; i++) {
      createTodo(savedTodoList[i]);
    }
  }
};

loadSavedTodoList();

/////////////////////////////////////////////////////////////////////////

// 구조분해할당 적용
const accessToGeo = ({ coords }) => {
  const { latitude, longitude } = coords;
  const positionObj = {
    latitude, // shorthand property (키와 밸류 이름이 똑같으면 하나만 사용)
    // latitude: latitude,
    longitude,
    // longitude: longitude,
  };
  console.log(positionObj);

  weatherSearch(positionObj);
};

const errorCallBackGeo = (err) => {
  console.log(err);
};

// API : 어떠한 프로그램에서 제공하는 기능을 사용자가 활용할 수 있도록 만들어 둔 인터페이스
const askForLocation = () => {
  navigator.geolocation.getCurrentPosition(accessToGeo, errorCallBackGeo);
};

askForLocation();

/////////////////////////////////////////////////////////////////////////

const weatherSearch = ({ latitude, longitude }) => {
  // URL : [protocol]://[domain or ip]/[path]?[parameters]...
  // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&exclude={part}&appid={API key}
  // lat : latitude
  // lon : longitude

  // promise 객체 : 현재는 얻을 수 없지만, 추후 작업이 완료되면 받아올 수 있는 데이터에 대한 접근 수단의 역할을 하는 객체이다.
  // fulfilled > 요청이 성공한 상태
  // peneding > 요청에 대한 응답을 기다리는 상태
  // rejected > 요청이 실패한 상태
  console.log(apiKey);
  const openWeatherRes = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
  );
  openWeatherRes
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      // 여기서 가져온 날씨 정보를 통해서 배경화면
      const weatherData = {
        location: json.name,
        weather: json.weather[0].main,
      };
      weatherDataActive(weatherData);
    })
    .catch((err) => {
      console.error(err);
    });
};

const weatherDataActive = ({ location, weather }) => {
  const weatherMainList = [
    "Clear",
    "Clouds",
    "Drizzle",
    "Rain",
    "Snow",
    "Thunderstorm",
  ];
  weather = weatherMainList.includes(weather) ? weather : "Fog";
  const locationNameTag = document.querySelector("#location-name-tag");
  locationNameTag.textContent = location + " / " + weather;

  document.body.style.backgroundImage = `url('./images/${weather}.jpg')`;

  // 렌더링 딜레이 해결 (불필요한 데이터 저장 차단)
  if (
    !savedWeatherData ||
    savedWeatherData.location !== location ||
    savedWeatherData.weather !== weather
  ) {
    localStorage.setItem(
      "saved-weather",
      JSON.stringify({ location, weather }) // 깊은 복사 (새로운 문자열 객체 할당)
    );
  }
};

if (savedWeatherData) {
  weatherDataActive(savedWeatherData);
}

/////////////////////////////////////////////////////////////////////////

const promiseTest = () => {
  return new Promise((resolver, reject) => {
    setTimeout(() => {
      resolver(100);
      // reject("error");
    }, 2000);
  });
};

promiseTest()
  // then : pending 상태의 promise 객체가 fulfilled 될 때까지 기다린다. (2초 후에 100 전달받는다.)
  .then((res) => {
    // console.log(res);
  })
  // catch : 만약 통신을 수행하다가 통신에서 문제가 생기면 알려준다.
  .catch((err) => {
    console.error(err);
  });
