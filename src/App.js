import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import C_SearchResults from "./C_SearchResult";
import R_SearchResults from "./R_SearchResult";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/C_results" element={<C_SearchResults />} />
      <Route path="/R_results" element={<R_SearchResults />} />
    </Routes>
  );
};

export default App;
