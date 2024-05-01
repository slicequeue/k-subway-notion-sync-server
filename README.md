# k-subway-notion-sync-server

한국 지하철 노선 도착 정보 `국토교통부_(TAGO)_지하철정보` API 를 활용하여 NOTION 데이터베이스에 동기화 처리를 하는 서버입니다.

## 개발스택
- Node.js v18.12.1 
- Express ~4.18.2
- @notionhq/client ^2.2.15
- axios ^1.6.8
그외 자세한 사항은 package.json 참고

## 디렉토리 구조
```
├─bin: 실행 www 파일
├─logs: 로그 로테이션 파일 저장 경로
├─public
│  └─stylesheets
├─src: 소스 코드
│  ├─common: 공통
│  │  ├─middlewares: 공통 미들웨어
│  │  │  └─ip-grabber: 미사용
│  │  ├─types: 공통 상수, 코드 타입 모음
│  │  └─utils: 공통 유틸 객체 함수 모음
│  │      └─logger
│  │          └─winston-logger
│  ├─config: 설정 관련
│  ├─routes: API 라우트 관련
│  │  ├─stations: 지하철 정거장 관련 API
│  │  └─syncs
│  ├─sync: 연동 작업 처리 
│  │  └─service: 연동 서비스
│  │      └─mapper: 지하철 <-> 노션 맵핑
│  ├─vendors
│  │  ├─gov: 공공데이터 연동 관련
│  │  │  └─metro: 지하철 연동
│  │  │      ├─dtos: 요청 응답 DTO 모음
│  │  │      └─types: 상수, 코드 타입 모음
│  │  └─notion: 노션 연동 관련
│  │      └─dtos: 요청 응답 DTO 모음
│  └─views: 미사용
```


## 연동 API 항목, 문서
  - 국토교통부_(TAGO)_지하철정보: https://www.data.go.kr/data/15098554/openapi.do
  - NOTION API: https://developers.notion.com

## 실행 결과
![image](https://github.com/slicequeue/k-subway-notion-sync-server/assets/75685750/f1da4a14-e5ce-45cd-ba43-8a93fcea13aa)
![k-subway-notion-sync-server-ex1-편집본](https://github.com/slicequeue/k-subway-notion-sync-server/assets/75685750/09eba6f9-a322-4bbb-bf26-9c1a76089c22)
- 한국 지하철 노선 도착 정보 `국토교통부_(TAGO)_지하철정보` API 를 활용하여 NOTION 데이터베이스에 동기화 처리를 통해 대상 데이터베이스에 도착 정보를 반영할 수 있음
- 대상 노션 데이터베이스에 지하철 도착 정보를 반영 후 원하는 조건으로 필터링 정렬 등을 적용하거나 이를 통한 뷰를 만들어 원하는 페이지에서 활용하면됨

## Installation

```bash
$ npm install
```

## Running the app

환경 설정 파일을 build 한 경로 내부에 설정해야함
`./src/config` 경로에 아래 파일을 생성한다.
.<NODE_ENV환경변수값>.env 
설정 내용은 다음과 같다.

```dotnetcli
GOV_API_KEY=<공공데이터정부API연동키> # 공동 데이터 정부 계정에 `국토교통부_(TAGO)_지하철정보` 활용신청을 통해 허가된 계정의 API 연동 키값
NOTION_API_KEY=<노션API연동키> # 노션 개발자 콘솔에서 해당 계정의 데이터베이스 읽기 쓰기 권한이 부여된 API 연동 키
```

- 위 설정을 사용은 config 객체를 통해 필요한 코드에서 불러와 활용
    
## 실행법

```bash
$ npm start
```

## docker - 작업중
```bash
# docker build
$ docker build -t <docker-image-name:tag> .

# docker run
$ docker run <docker-image-name:tag>
```

## Test - 작업중

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch
- Author - slicequeue@gmail.com
