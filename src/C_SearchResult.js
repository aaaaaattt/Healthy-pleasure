import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const C_SearchResult = ({ query }) => {
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/calorie?q=${query}`);

        if (!response.ok) {
          throw new Error("서버 응답 오류");
        }

        const data = await response.json();
        console.log("서버에서 받은 데이터:", data);

        if (data && data.food && data.calories) {
          setSearchResult(data);
        } else {
          setSearchResult(null);
        }

        setLoading(false);
      } catch (error) {
        console.error("검색 오류:", error.message);
        setError(error.message); // 에러 메시지 설정
        setLoading(false);
      }
    };

    fetchData();
  }, [query]); // query가 변경될 때마다 fetchData 실행

  return (
    <Box sx={{ mt: 5, mx: "auto", width: "60%", textAlign: "left" }}>
      <Typography variant="h6" gutterBottom align="center">
        식품 칼로리 검색 결과
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? ( // 에러가 있을 경우 에러 메시지 표시
        <Typography variant="body1" align="center">
          오류 발생: {error}
        </Typography>
      ) : searchResult ? (
        <Box>
          <Typography variant="body1">음식: {searchResult.food}</Typography>
          <Typography variant="body1">
            칼로리: {searchResult.calories}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body1" align="center">
          검색 결과가 없습니다.
        </Typography>
      )}
    </Box>
  );
};

export default C_SearchResult;
