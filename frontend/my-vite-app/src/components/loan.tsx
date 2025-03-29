"use client";

import { ColumnDef } from "@tanstack/react-table";

import { TableHeader } from "./table-header";
import { MoreHorizontal } from "lucide-react";
import { LoanApplication } from "./table-action";
import { formatToLocalDate, getTimeFromTimestamp } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export const statuses = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "VERIFIED",
    label: "Verified",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
  {
    value: "APPROVED",
    label: "Approved",
  },
];

export const loanColumns: ColumnDef<LoanApplication>[] = [
  {
    accessorKey: "approver",
    header: ({ column }) => (
      <TableHeader column={column} title="Loan Officer" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center  space-x-2 min-w-[350px]">
          <Avatar>
            <AvatarFallback>
              {row.getValue("approver") === ""
                ? "U"
                : (row.getValue("approver") as string)
                    .split(" ")
                    .map((item) => item[0])}
            </AvatarFallback>
          </Avatar>
          <span className=" truncate font-medium">
            {row.getValue("approver") === "" ? "N/A" : row.getValue("approver")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <TableHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <span className="min-w-[150px] truncate font-medium">
            {row.getValue("amount")}
          </span>
          <span className="text-sm text-muted-foreground/50">
            {row.getValue("paid") === true
              ? "Loan fully repaid"
              : "Not yet paid"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <TableHeader column={column} title="Date Applied" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-start gap-1">
          <span className="min-w-[100px] truncate font-medium">
            {formatToLocalDate(row.getValue("createdAt"))}
          </span>
          <span className="text-muted-foreground/50">
            {getTimeFromTimestamp(row.getValue("createdAt"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <TableHeader column={column} title="Action" />,
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div
          className={`flex w-[100px] items-center rounded-full justify-center py-2 text-lg ${
            status.value === "PENDING"
              ? "bg-[#f2975a] text-white"
              : status.value === "VERIFIED"
              ? "bg-[#A594F9] text-white"
              : status.value === "APPROVED"
              ? "bg-[#287931] text-white"
              : "bg-[#CC2929] text-white"
          }`}
        >
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
