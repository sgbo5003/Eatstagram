> 프로젝트 기획

- 구성원
  - 박상준 (Frontend), 진예도 (Backend), 배규리 (Publisher)
- 제작 취지
  - 인스타그램과 비슷하게 만드는 맛집 공유 SNS
- 필요기술
  - Frontend & Publisher : HTML + CSS + React
  - Backend : Spring boot + mysql
- 주요 기능
  - 콘텐츠 업로드
  - 콘텐츠 부가 기능 (댓글, 저장, 좋아요, 공유)
  - 채팅 기능
  - 검색 기능
  - 프로필 & 설정
  - 알림 & 스토리

> 페이지 별로 구현한 기능 정리

> 전체적인 세팅

- webpack 을 이용하여 프로젝트 시작
- 협업 → github에 fork를 이용해 fetch & merge하여 소스코드 공유
- github에 작업한 결과물 커밋

> 시작 페이지 (로그인 페이지)

<img src="https://user-images.githubusercontent.com/61876422/134969596-ebe9dcfe-c6c6-4ae8-9699-2351e3e9071f.PNG" />

### 카카오 로그인

- react-kakao-login을 사용하여 사용자의 id, nickname, email, username을 axios를 통해 서버에 전달

### 로그인 공백 체크

- useRef와 trim()을 사용해 공백 체크 및 focus

> 회원가입 페이지 (양식 입력 화면)

<img src="https://user-images.githubusercontent.com/61876422/134969766-e21550b3-0675-42e8-9edb-33fd902bfa95.png" />

### 유효성 검사

- 정규식 사용
  - 이메일 유효성 검사
    - `/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i`
  - 이름 유효성 검사
    - `/^[가-힣]{2,6}$/`
  - 아이디 유효성 검사
    - `/^[A-za-z0-9]{6,18}$/`
  - 비밀번호 유효성 검사
    - `/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,20}$/`
- db에서 실시간 조회 (이미 존재하는 값인지 체크, 중복 방지)
  - 아이디
  - 닉네임

### 세션

- 회원가입 양식 입력 완료 후 다음 버튼 클릭 시 sessionStorage에 joinToken 저장
  - 회원가입 중복 방지
  - 이메일 인증 화면에서 필요하기 때문

> 회원가입 페이지 (이메일 인증 화면)

<img src="https://user-images.githubusercontent.com/61876422/134969818-cc90dae3-3509-4242-8b5c-7d279176df43.png" />

### 이메일 인증

- 화면 진입 시
  - sessionStorage에 joinToken 값이 있는지 체크
  - 없으면 로그인 화면으로 이동, 있으면 정상적으로 이메일 인증 진행
  - 검사 후 sessionStorage joinToken 없애주기
    - 새로고침과 강제 진입 방지

> 메인 페이지

<img src="https://user-images.githubusercontent.com/61876422/134969875-ba97f797-7880-45f7-ba47-3499084fbf5a.png" />

### 무한 스크롤

- 기본적으로 데이터를 3개씩만 보여주고 스크롤 값을 이용하여 밑으로 스크롤 시 데이터를 계속 가져오는 방식으로 구현

### 슬라이더

- react-slick 라이브러리를 사용하여 구현

### 좋아요

- 처음 화면 진입 시 → db의 값을 가져와 렌더링
- 클릭 시 → 좋아요 눌렀는지 여부 & 갯수 체크 → 업데이트

### 댓글 달기

- 메인 화면에서도 댓글 입력 가능
  - 댓글 입력 후 게시 클릭 시
    - 웹소켓 오픈 → 댓글 전송 → 웹소켓 닫기

> 메인페이지 - 댓글 모달창

<img src="https://user-images.githubusercontent.com/61876422/134969937-bcec76d8-2155-472b-9dab-91552da2cb1f.PNG" />

### 모달

- Modal.js를 통해 모달창 띄우기
- 모달창 외부 클릭 시 모달 off

### 댓글 기능

- 화면 진입 시 Websocket 오픈 & 닫을 시 websocket 끄기
- 실시간 댓글 기능

### 데이터 렌더링

- 기본적으로 6개의 댓글 보여주기
- 초과 시 플러스 버튼을 넣어 클릭 시 데이터 추가 렌더링

> 헤더 - 글쓰기 모달창

<img src="https://user-images.githubusercontent.com/61876422/134969984-9e4f2d7f-4573-4d43-804d-3ac3372d6160.PNG" />

### 이미지 & 비디오 업로드

- 플러스 버튼을 통해 업로드 가능
- 업로드 시
  - 하단에 미리보기 추가
  - 상단에 미리보기 추가

### 위치

- kakao-map api 사용
  - kakao-map에 검색 기능을 사용하여 키워드 검색 시 검색결과 15개 렌더링

> 채팅 페이지

<img src="https://user-images.githubusercontent.com/61876422/134970030-d6b76d1f-b339-4845-bccd-0c8933d14f19.png" />

<img src="https://user-images.githubusercontent.com/61876422/134970044-b5aaf36a-4f9f-41c6-ab3e-71350cbde43c.PNG" />

<img src="https://user-images.githubusercontent.com/61876422/134970053-d6003bb6-a83b-4239-8891-bcf1e351c160.png" />

### websocket

- 페이지 진입 시
  - localStorage에 담긴 username으로 websocket 연결 → 채팅 목록 가져오기

### 친구 채팅 초대(모달)

- 아이콘 or 메세지 보내기 클릭 시
  - 친구 초대를 할 수 있는 모달 화면 오픈
  - db에서 입력값을 조회해 일치하는 user 렌더링
- 초대 시
  - 채팅 목록 업데이트
  - 상대방에게도 연결

### 채팅 화면

- 채팅 목록에서 유저 클릭 시
  - 해당 유저와 채팅 연동
    - url에서 값을 가져와 websockt과 연동하는 방식으로 구현
  - 메세지를 보낸 값 비교
    - 메세지를 보낸 유저를 비교해 렌더링 구분
- 보낼 수 있는 값
  - 텍스트
  - 이미지 & 비디오 전송 가능

### 무한 스크롤

- 채팅이 많아져서 스크롤이 생길 시
  - 위로 스크롤 시 데이터 추가로 불러오기
