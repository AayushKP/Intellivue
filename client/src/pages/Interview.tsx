import { useEffect, useState } from "react";

const Interview: React.FC = () => {
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    const storedQuestions = localStorage.getItem("questions");
    setQuestions(
      storedQuestions ? storedQuestions.split("|") : ["No questions available."]
    );
  }, []);

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-bold">Interview Questions</h2>
      <div className="mt-4">
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold">Question {index + 1}:</h3>
            <p>{q}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interview;
