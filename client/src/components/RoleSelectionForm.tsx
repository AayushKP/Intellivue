import React from "react";
import { useSignal } from "@preact/signals-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const roles = [
  "Software Engineer",
  "Backend Engineer",
  "Frontend Engineer",
  "Full Stack Developer",
  "AI ML Engineer",
  "DevOps Engineer",
];

const RoleSelectionForm: React.FC = () => {
  const selectedRole = useSignal<string>("");

  const handleRoleChange = (value: string) => {
    selectedRole.value = value;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Selected Role:", selectedRole.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label htmlFor="role" className="font-semibold text-lg">
        Select Your Role:
      </label>
      <Select onValueChange={handleRoleChange} value={selectedRole.value}>
        <SelectTrigger id="role" className="w-full">
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
      <Button type="submit" className="mt-4">
        Continue
      </Button>
    </form>
  );
};

export default RoleSelectionForm;
