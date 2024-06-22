import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export default function R_Search() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/R_results`);
  };

  return (
    <Box sx={{ mt: 5, mx: "auto", width: "50%", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom align="center">
        레시피 검색
      </Typography>
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <TextField
          id="searchQuery"
          label="검색어"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          검색
        </Button>
      </Box>
    </Box>
  );
}
