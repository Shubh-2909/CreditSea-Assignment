"use client";

import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { MoreHorizontal } from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

import { z } from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../components/ui/use-toast";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
const LoanApplicationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fullName: z.string(),
  amount: z.number(),
  tenure: z.string(),
  reason: z.string(),
  employmentStatus: z.boolean(),
  employmentAddress: z.string(),
  status: z.string(),
  approver: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  paid: z.boolean(),
});

export type LoanApplication = z.infer<typeof LoanApplicationSchema>;
interface TableActionsProps<TData> {
  row: Row<TData>;
  role: string;
}

const adminStatuses = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "REJECTED",
    label: "Reject",
  },
  {
    value: "APPROVED",
    label: "Approved",
  },
];

const verifierStatuses = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "VERIFIED",
    label: "Verify",
  },
  {
    value: "REJECTED",
    label: "Reject",
  },
];
export function TableActions<TData>({ row, role }: TableActionsProps<TData>) {
  const { toast } = useToast();
  const task = LoanApplicationSchema.parse(row.original);

  const [statuses, setStatuses] = useState([
    {
      value: "",
      label: "",
    },
  ]);

  useEffect(() => {
    if (role === "admin") {
      setStatuses(adminStatuses);
    } else {
      setStatuses(verifierStatuses);
    }
  }, [role]);

  const handleAdmin = async (label: string, id: string) => {
    let paramRole = "";
    if (label === "VERIFIED") {
      paramRole = "VERIFIER";
      await axios.get(`api/status/verify?role=${paramRole}&id=${id}`);
    } else if (label === "APPROVED") {
      paramRole = "ADMIN";
      await axios.get(`api/status/approve?role=${paramRole}&id=${id}`);
    } else if (label === "REJECTED") {
      paramRole = "VERIFIER";
      await axios.get(`api/status/reject?role=${paramRole}&id=${id}`);
    } else if (label === "PENDING") {
      paramRole = "VERIFIER";
      await axios.get(`api/status/pending?role=${paramRole}&id=${id}`);
    }

    toast({
      title: "status updated successfully",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {statuses
          .filter((status) => status.value !== task.status)
          .map((status) => (
            <DropdownMenuItem
              key={status.value}
              onClick={() => handleAdmin(status.value, task.id)}
            >
              {status.label}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
