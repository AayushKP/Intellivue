import React, { useRef, useState } from "react";
import { useSignal } from "@preact/signals-react";
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

// Example data
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
const technologiesList = [
  "React.js",
  "Node.js",
  "TypeScript",
  "Python",
  "Java",
  "MongoDB",
  "PostgreSQL",
  "Docker",
];
// Example list of companies for the “Select Company” dropdown
const companies = ["Google", "Amazon", "Microsoft", "Apple", "Netflix"];

const InterviewSetup: React.FC = () => {
  // Using signals for simple fields
  const selectedRole = useSignal<string>("");
  const selectedLevel = useSignal<string>("");
  const selectedExperience = useSignal<string>("");
  const targetCompany = useSignal<string>("");

  // Using state for multi-select and file uploads
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );

  const loading = useSignal<boolean>(false);
  const error = useSignal<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (
      !selectedRole.value ||
      !selectedLevel.value ||
      !selectedExperience.value ||
      selectedTechnologies.length === 0
    ) {
      error.value = "Please fill all fields.";
      return;
    }

    error.value = "";
    loading.value = true;

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("role", selectedRole.value);
      formData.append("level", selectedLevel.value);
      formData.append("experience", selectedExperience.value);
      selectedTechnologies.forEach((tech) =>
        formData.append("technologies[]", tech)
      );
      formData.append("targetCompany", targetCompany.value);

      const response = await axios.post(
        "http://localhost:3000/api/gemini",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Save questions to localStorage (as before)
      localStorage.setItem("questions", response.data.questions);

      navigate("/interview");
    } catch (err) {
      console.error(err);
      error.value = "Failed to load interview questions.";
    } finally {
      loading.value = false;
    }
  };

  return (
    // Dark background to replicate the modal-like style
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-neutral-900 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Interview Setup</CardTitle>
          <CardDescription>Customize your practice interview</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              {/* Role */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Role</label>
                <Select
                  onValueChange={(value) => (selectedRole.value = value)}
                  value={selectedRole.value}
                >
                  <SelectTrigger className="w-full bg-neutral-800">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Level</label>
                <Select
                  onValueChange={(value) => (selectedLevel.value = value)}
                  value={selectedLevel.value}
                >
                  <SelectTrigger className="w-full bg-neutral-800">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Experience (years)
              </label>
              <Select
                onValueChange={(value) => (selectedExperience.value = value)}
                value={selectedExperience.value}
              >
                <SelectTrigger className="w-full bg-neutral-800">
                  <SelectValue placeholder="Select years of experience" />
                </SelectTrigger>
                <SelectContent>
                  {experiences.map((exp) => (
                    <SelectItem key={exp} value={exp}>
                      {exp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Technologies
              </label>
              <Select
                onValueChange={(value) => {
                  setSelectedTechnologies((prev) =>
                    prev.includes(value)
                      ? prev.filter((tech) => tech !== value)
                      : [...prev, value]
                  );
                }}
              >
                <SelectTrigger className="w-full bg-neutral-800">
                  <SelectValue placeholder="Select technologies" />
                </SelectTrigger>
                <SelectContent>
                  {technologiesList.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech} {selectedTechnologies.includes(tech) ? "✔️" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Display selected technologies */}
              {selectedTechnologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTechnologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-neutral-700 rounded px-2 py-1 text-sm flex items-center"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTechnologies((prev) =>
                            prev.filter((t) => t !== tech)
                          )
                        }
                        className="ml-2 text-red-400"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Target Company */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Target Company
              </label>
              <Select
                onValueChange={(value) => (targetCompany.value = value)}
                value={targetCompany.value}
              >
                <SelectTrigger className="w-full bg-neutral-800">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Error message */}
            {error.value && (
              <p className="text-sm text-red-400">{error.value}</p>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading.value}
            >
              {loading.value ? "Generating..." : "Generate Interview Questions"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewSetup;
