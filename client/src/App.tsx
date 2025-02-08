import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch a new question from the backend
  const fetchQuestion = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/api/gemini");
      setQuestion(response.data.question);
    } catch (err) {
      console.error(err);
      setError("Failed to load question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Test</h2>
      <button onClick={fetchQuestion} disabled={loading}>
        {loading ? "Loading..." : "Start Test / Next Question"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {question && (
        <div style={{ marginTop: "20px" }}>
          <h3>Question:</h3>
          <p>{question}</p>
        </div>
      )}
    </div>
  );
};

export default App;
