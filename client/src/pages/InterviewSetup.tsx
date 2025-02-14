import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const roles = [
  "Software Engineer",
  "Backend Engineer",
  "Frontend Engineer",
  "Full Stack Developer",
  "AI ML Engineer",
  "DevOps Engineer",
];
const levels = ["Intern", "Junior", "Mid", "Senior", "Lead"];
const experiences = ["0", "1", "2", "3+", "5+"];
const companies = ["Google", "Amazon", "Microsoft", "Apple", "Netflix"];

type SelectFieldProps = {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

// A reusable Select field, memoized so it only re-renders when its props change.
const SelectField: React.FC<SelectFieldProps> = React.memo(
  ({ label, placeholder, options, value, onChange }) => {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <Select onValueChange={onChange} value={value}>
          <SelectTrigger className="w-full bg-neutral-800">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

const InterviewSetup: React.FC = () => {
  // Use React state
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [targetCompany, setTargetCompany] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Memoize handleSubmit to prevent unnecessary re-creation
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!selectedRole || !selectedLevel || !selectedExperience) {
        setError("Please fill all fields.");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("role", selectedRole);
        formData.append("level", selectedLevel);
        formData.append("experience", selectedExperience);
        formData.append("targetCompany", targetCompany);

        const response = await axios.post(
          "http://localhost:3000/api/gemini",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        localStorage.setItem("questions", response.data.questions);
        navigate("/interview");
      } catch (err) {
        console.error(err);
        setError("Failed to load interview questions.");
      } finally {
        setLoading(false);
      }
    },
    [selectedRole, selectedLevel, selectedExperience, targetCompany, navigate]
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-neutral-900 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Interview Setup</CardTitle>
          <CardDescription>Customize your practice interview</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              {/* Role Field */}
              <div className="flex-1">
                <SelectField
                  label="Role"
                  placeholder="Select Role"
                  options={roles}
                  value={selectedRole}
                  onChange={setSelectedRole}
                />
              </div>
              {/* Level Field */}
              <div className="flex-1">
                <SelectField
                  label="Level"
                  placeholder="Select Level"
                  options={levels}
                  value={selectedLevel}
                  onChange={setSelectedLevel}
                />
              </div>
            </div>

            {/* Experience Field */}
            <SelectField
              label="Experience (years)"
              placeholder="Select years of experience"
              options={experiences}
              value={selectedExperience}
              onChange={setSelectedExperience}
            />

            {/* Target Company Field */}
            <SelectField
              label="Target Company"
              placeholder="Select Company"
              options={companies}
              value={targetCompany}
              onChange={setTargetCompany}
            />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Interview Questions"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewSetup;
