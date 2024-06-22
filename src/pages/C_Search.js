import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function C_Search() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/C_results`);
  };

  return (
    <Box sx={{ mt: 5, mx: "auto", width: "20%", textAlign: "left" }}>
      <Typography variant="h6" gutterBottom align="center">
        식품 칼로리 검색
      </Typography>
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <TextField
          id="searchQuery"
          label="음식"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2, width: "100%" }}
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary" // 기본 제공 색상 중 하나를 선택
          // sx prop을 사용하여 커스텀 색상 적용
          sx={{
            backgroundColor: "#4caf50", // 커스텀 배경 색상
            "&:hover": {
              backgroundColor: "#45a049", // 커스텀 hover 색상
            },
          }}
        >
          검색
        </Button>
      </Box>
    </Box>
  );
}
