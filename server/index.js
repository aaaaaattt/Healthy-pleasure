const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const port = 3001;

app.use(
  session({
    secret: "5587", // 비밀키는 임의로 설정
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS를 사용할 경우 true로 설정
  })
);
app.use(cors());
app.use(bodyParser.json());

// MySQL 연결 설정
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // MySQL 사용자 이름
  password: "5587", // MySQL 사용자 비밀번호
  database: "temp_database", // 데이터베이스 이름
});

db.connect((err) => {
  if (err) {
    console.error("DB 연결 오류:", err);
    return;
  }
  console.log("DB 연결 성공");

  // users 테이블 생성 (존재하지 않는 경우)
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255) NOT NULL
    )
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("테이블 생성 오류:", err);
      return;
    }

    console.log("테이블 준비 완료");

    // 예제 사용자 추가 (이미 추가된 경우 건너뜀)
    const password = "testpassword"; // 예제 비밀번호
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.error(err);
        return;
      }

      const insertUserQuery =
        "INSERT IGNORE INTO users (id, password) VALUES (?, ?)";
      db.query(insertUserQuery, ["testuser", hash], (err, results) => {
        if (err) {
          console.error("사용자 삽입 오류:", err);
          return;
        }
        console.log("예제 사용자 등록 완료");
        console.log(hash);
      });
    });
  });
});

// 로그인 요청 처리
app.post("/login", async (req, res) => {
  const { id, pw } = req.body;
  const query = "SELECT * FROM users WHERE id = ?";

  console.log("로그인 요청: ", id); // 로그 추가

  db.query(query, [id], async (err, results) => {
    if (err) {
      console.error("DB 조회 오류:", err);
      return res.status(500).send({ error: "DB 조회 오류" });
    }

    console.log("DB 조회 결과: ", results); // 로그 추가
    if (results.length > 0) {
      const user = results[0];
      console.log("사용자 발견: ", user); // 로그 추가

      const match = await bcrypt.compare(pw, user.password); // 비밀번호 비교
      console.log("비밀번호 비교 결과: ", match); // 로그 추가

      if (match) {
        req.session.userId = user.id; // 세션에 사용자 ID 저장
        console.log("로그인 성공, 세션 저장: ", req.session.userId); // 로그 추가
        res.send({
          success: true,
          message: "로그인 성공",
          redirectUrl: "/dashboard",
        });
      } else {
        console.log("비밀번호 불일치"); // 로그 추가
        res.send({ success: false, message: "ID 또는 비밀번호가 틀렸습니다" });
      }
    } else {
      console.log("사용자 없음"); // 로그 추가
      res.send({ success: false, message: "ID 또는 비밀번호가 틀렸습니다" });
    }
  });
});

// 로그인 여부 확인 미들웨어
const isLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    console.log("사용자 인증됨: ", req.session.userId);
    next();
  } else {
    console.log("사용자 인증 실패");
    res.status(401).send({ message: "로그인이 필요합니다" });
  }
};

// 대시보드 라우트
app.get("/dashboard", isLoggedIn, (req, res) => {
  const userId = req.session.userId;
  console.log("대시보드 접근: ", userId);
  res.send({ message: `환영합니다, ${userId}님!` });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다`);
});
