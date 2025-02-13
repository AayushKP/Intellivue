import { BrowserRouter, Routes, Route } from "react-router-dom";
import InterviewSetup from "./pages/InterviewSetup";
import Interview from "./pages/Interview";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InterviewSetup />} />
        <Route path="/interview" element={<Interview />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
