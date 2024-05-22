import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="border border-warning border-3 rounded-3 p-5">
        <p className="text-center"> Healthy Pleasure </p>
        <Form>
          <Form.Group className="mb-2" controlId="formbasicEmail">
            <Form.Label> ID </Form.Label>
            <Form.Control type="text" name="id" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label> Password </Form.Label>
            <Form.Control type="password" name="pw" />
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
