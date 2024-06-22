import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>홈</h1>
      <p>가장 먼저 보여지는 페이지입니다.</p>
      <Link to="/about">소개</Link>
      <br></br>
      <Link to="/login">로그인</Link>
      <br></br>
      <Link to="/Dashboard">Dash</Link>
    </div>
  );
};

export default Home;
