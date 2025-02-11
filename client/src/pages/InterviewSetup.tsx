import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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

const InterviewSetup: React.FC = () => {
  const selectedRole = useSignal<string>("");
  const selectedLevel = useSignal<string>("");
  const selectedExperience = useSignal<string>("");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );
  const targetCompany = useSignal<string>("");
  const resumeText = useSignal<string>("");

  const loading = useSignal<boolean>(false);
  const error = useSignal<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedRole.value ||
      !selectedLevel.value ||
      !selectedExperience.value ||
      selectedTechnologies.length === 0
    ) {
      return (error.value = "Please fill all fields.");
    }

    loading.value = true;
    error.value = "";

    try {
      const response = await axios.post("http://localhost:3000/api/gemini", {
        role: selectedRole.value,
        level: selectedLevel.value,
        experience: selectedExperience.value,
        technologies: selectedTechnologies,
        targetCompany: targetCompany.value,
        resumeText: resumeText.value,
      });

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Interview Setup
            </CardTitle>
            <CardDescription className="text-gray-600">
              Fill in the details to generate tailored interview questions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Role:
                </label>
                <Select
                  onValueChange={(value) => (selectedRole.value = value)}
                  value={selectedRole.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
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

              {/* Level Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Experience Level:
                </label>
                <Select
                  onValueChange={(value) => (selectedLevel.value = value)}
                  value={selectedLevel.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a level" />
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

              {/* Experience Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience:
                </label>
                <Select
                  onValueChange={(value) => (selectedExperience.value = value)}
                  value={selectedExperience.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select experience" />
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

              {/* Technologies Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies You Know:
                </label>
                <Select
                  onValueChange={(value) => setSelectedTechnologies([value])}
                  value={selectedTechnologies[0] || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a technology" />
                  </SelectTrigger>
                  <SelectContent>
                    {technologiesList.map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Target Company Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Company (Optional):
                </label>
                <Input
                  type="text"
                  placeholder="Enter company name"
                  value={targetCompany.value}
                  onChange={(e: any) => (targetCompany.value = e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Resume Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Your Resume Text (Optional):
                </label>
                <Textarea
                  placeholder="Paste your resume text here..."
                  value={resumeText.value}
                  onChange={(e) => (resumeText.value = e.target.value)}
                  className="w-full"
                  rows={4}
                />
              </div>

              {/* Error Message */}
              {error.value && (
                <p className="text-sm text-red-600">{error.value}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading.value}
              >
                {loading.value ? "Generating..." : "Start Interview"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewSetup;
