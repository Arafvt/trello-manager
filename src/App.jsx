import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { BoardPage } from "./pages/BoardPage";
import { Header } from "./components/Header";

const App = () => {
  return (
      <div>
        <Router>
        <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/board/:id" element={<BoardPage />} />
          </Routes>
        </Router>
      </div>
  );
};

export default App;
