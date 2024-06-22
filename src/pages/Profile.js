import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

export default function Profile({ userId }) {
  return (
    <React.Fragment>
      <Title>회원 정보</Title>
      <Typography component="p" variant="h4">
        이름
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {userId ? userId : "사용자 ID가 없습니다"}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}></Link>
      </div>
    </React.Fragment>
  );
}
