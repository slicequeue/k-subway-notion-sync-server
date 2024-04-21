## Description

nodejs express 이용한 보일러 플레이트

## Installation

```bash
$ npm install
```

## Running the app

환경 설정 파일을 build 한 경로 내부에 설정해야함
`/config` 경로에 아래 파일을 생성한다.
.<NODE_ENV환경변수값>.env 
설정 내용은 다음과 같다.

```dotnetcli
HOST=<호스트주소>
PORT=<서버포트>
```

- 위 설정을 사용은 config 이용하여 처리함
    
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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - 김진황
