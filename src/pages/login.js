import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", {
        id,
        pw: password,
      });
      if (response.data.success) {
        alert(response.data.message);
        window.location.href = response.data.redirectUrl; // 리디렉션
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("로그인 요청 오류:", error);
      alert("로그인 요청 중 오류가 발생했습니다");
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="border border-warning border-3 rounded-3 p-5">
        <p className="text-center">Healthy Pleasure</p>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-2" controlId="formBasicEmail">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              name="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="pw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button type="submit" variant="primary">
              로그인
            </Button>
            <Button variant="dark">회원가입</Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Login;
