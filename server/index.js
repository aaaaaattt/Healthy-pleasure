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

    // console.log("테이블 준비 완료");

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
        // console.log("예제 사용자 등록 완료");
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

// calorie 테이블 생성 (존재하지 않는 경우)
const createCalorieTableQuery = `
CREATE TABLE IF NOT EXISTS calorie (
  food VARCHAR(255) NOT NULL PRIMARY KEY,
  calories INT NOT NULL
)
`;

db.query(createCalorieTableQuery, (err, result) => {
  if (err) {
    console.error("calorie 테이블 생성 오류:", err);
    return;
  }
  // console.log("calorie 테이블 준비 완료");

  // 예제 데이터 삽입 (이미 존재하는 경우 무시)
  const insertCalorieQuery =
    "INSERT IGNORE INTO calorie (food, calories) VALUES (?, ?)";
  db.query(insertCalorieQuery, ["apple", 52], (err, results) => {
    if (err) {
      console.error("음식 데이터 삽입 오류:", err);
      return;
    }
    // console.log("음식 데이터 삽입 완료");
  });
});

// /api/calorie 요청 처리
app.get("/api/calorie", (req, res) => {
  const { q } = req.query;
  console.log(`Received query: ${q}`); // 쿼리 로그 추가

  const sql = `SELECT food, calories FROM calorie WHERE food LIKE ?`;
  db.query(sql, [`%${q}%`], (error, results, fields) => {
    if (error) {
      console.error("MySQL 쿼리 오류:", error);
      res.status(500).json({ error: "서버 오류" });
      return;
    }

    console.log("Query results:", results); // 결과 로그 추가

    if (results.length > 0) {
      const foodData = results[0];
      res.json({
        food: foodData.food,
        calories: foodData.calories,
      });
    } else {
      res.status(404).json({ error: "검색 결과가 없습니다." });
    }
  });
});

// hprecipe 테이블 생성 (존재하지 않는 경우)
const createRecipeTableQuery = `
 CREATE TABLE IF NOT EXISTS hprecipe (
   foodname VARCHAR(100) NOT NULL PRIMARY KEY,
   ingredient VARCHAR(100) NOT NULL,
   recipe VARCHAR(1000) NOT NULL
 )
`;

db.query(createRecipeTableQuery, (err, result) => {
  if (err) {
    console.error("recipe 테이블 생성 오류:", err);
    return;
  }
  // console.log("recipe 테이블 준비 완료");

  // 예제 데이터 삽입 (이미 존재하는 경우 무시)
  const insertRecipeQuery =
    "INSERT IGNORE INTO hprecipe (foodname, ingredient, recipe) VALUES (?, ?, ?)";
  const recipesToInsert = [
    ["사과잼", "사과", "사과를 사용한 잼 레시피"],
    ["사과탕", "사과, 참외", "사과와 참외를 사용한 탕 레시피"],
    ["마라탕", "푸주", "마라를 넣은 레시피"],
  ];

  recipesToInsert.forEach((recipe) => {
    db.query(insertRecipeQuery, recipe, (err, results) => {
      if (err) {
        console.error("레시피 데이터 삽입 오류:", err);
        return;
      }
      // console.log("레시피 데이터 삽입 완료");
    });
  });
});

// /api/hprecipe 요청 처리
app.get("/api/hprecipe", (req, res) => {
  const { q } = req.query;
  console.log(`Received query: ${q}`); // 쿼리 로그 추가

  const sql = `SELECT foodname, ingredient, recipe FROM hprecipe WHERE ingredient LIKE ?`;
  db.query(sql, [`%${q}%`], (error, results, fields) => {
    if (error) {
      console.error("MySQL 쿼리 오류:", error);
      res.status(500).json({ error: "서버 오류" });
      return;
    }

    console.log("Query results:", results); // 결과 로그 추가

    if (results.length > 0) {
      // 검색 결과를 배열로 변환하여 클라이언트에 반환
      const searchResults = results.map((result) => ({
        foodname: result.foodname,
        ingredient: result.ingredient,
        recipe: result.recipe,
      }));
      res.json(searchResults);
    } else {
      res.status(404).json({ error: "검색 결과가 없습니다." });
    }
  });
});

// 몸무게 테이블 생성 (존재하지 않는 경우)
const createWeightTableQuery = `
  CREATE TABLE IF NOT EXISTS weight (
    date DATE NOT NULL PRIMARY KEY,
    weight FLOAT NOT NULL
  )
`;

db.query(createWeightTableQuery, (err) => {
  if (err) {
    console.error("weight 테이블 생성 오류:", err);
    return;
  }
  // console.log("weight 테이블 준비 완료");

  // 예제 데이터 삽입
  const insertWeightQuery = `
    INSERT IGNORE INTO weight (date, weight) VALUES 
    ('2024-01-15', 81.0),
    ('2024-01-30', 76.0),
    ('2024-02-01', 77.0),
    ('2024-02-15', 75.0),
    ('2024-02-30', 77.0),
    ('2024-03-01', 79.0),
    ('2024-03-15', 80.0),
    ('2024-03-30', 81.0)
  `;
  db.query(insertWeightQuery, (err) => {
    if (err) {
      console.error("몸무게 데이터 삽입 오류:", err);
      return;
    }
    // console.log("몸무게 데이터 삽입 완료");
  });
});

// 몸무게 데이터 조회 API
app.get("/api/weight", (req, res) => {
  const query = "SELECT date, weight FROM weight ORDER BY date ASC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("몸무게 데이터 조회 오류:", err);
      res.status(500).json({ error: "서버 오류" });
      return;
    }
    res.json(results);
  });
});

// 오늘의 몸무게 입력 API
app.post("/api/weight", (req, res) => {
  const { weight } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  const insertWeightQuery = "INSERT INTO weight (date, weight) VALUES (?, ?)";
  db.query(insertWeightQuery, [today, weight], (err, result) => {
    if (err) {
      console.error("오늘의 몸무게 입력 오류:", err);
      res.status(500).json({ error: "서버 오류" });
      return;
    }
    // console.log("오늘의 몸무게 입력 완료");
    res
      .status(201)
      .send({ message: "오늘의 몸무게가 성공적으로 입력되었습니다." });
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다`);
});
