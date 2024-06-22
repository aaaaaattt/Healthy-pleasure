import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

export default function Profile() {
  const [userId, setUserId] = React.useState(null);

  React.useEffect(() => {
    // localStorage에서 세션 데이터 가져오기
    const storedSession = localStorage.getItem("session");
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        if (sessionData && sessionData.id) {
          setUserId(sessionData.id); // 사용자 ID 설정
        } else {
          console.error("세션 데이터에 유효한 사용자 ID가 없습니다.");
        }
      } catch (error) {
        console.error("세션 데이터 파싱 오류:", error);
      }
    } else {
      console.warn("localStorage에 저장된 세션 데이터가 없습니다.");
    }
  }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행

  return (
    <React.Fragment>
      <Title>회원 정보</Title>
      <Typography component="p" variant="h4">
        {userId ? userId : "사용자 ID가 없습니다"}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          프로필 보기
        </Link>
      </div>
    </React.Fragment>
  );
}
