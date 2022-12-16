// DOM : Document Object Model
// 브라우저가 HTML 문서를 파싱하는 과정에서 생겨나는 객체
// html, head, body, title, script, div, h1, input, ul, li, ... >>> 트리 구조로 구성된다.

const todoInput = document.querySelector("#todo-input");
todoInput.addEventListener("keydown", (event) => keyCodeCheck(event));

/////////////////////////////////////////////////////////////////////////

const keyCodeCheck = (event) => {
  // 빈문자열이지 않거나 엔터 누른 경우에만 로직 수행
  if (event.keyCode === 13 && todoInput.value !== "") {
    createTodo();
  }
};

/////////////////////////////////////////////////////////////////////////

const createTodo = () => {
  const newLi = document.createElement("li");
  const newSpan = document.createElement("span");
  const newBtn = document.createElement("button");

  newBtn.addEventListener("click", () => {
    newLi.classList.toggle("complete"); // complete 라는 클래스를 추가 > 한 번 누르면 추가, 한 번 더 누르면 삭제
  });
  newLi.appendChild(newBtn);

  newSpan.textContent = todoInput.value; // 새로 생성된 span 에 입력값 설정
  newLi.appendChild(newSpan); // 새로 생성된 span 을 새로 생성된 li 에 자식 노드로 추가

  const todoList = document.querySelector("#todo-list");
  todoList.appendChild(newLi); // 새로 생성된 li 를 기존에 존재하던 ul 에 자식 노드로 추가
  todoInput.value = "";
};
