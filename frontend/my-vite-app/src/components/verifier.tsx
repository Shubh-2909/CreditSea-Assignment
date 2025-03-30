"use client";

import { ColumnDef, Row } from "@tanstack/react-table";

import { TableHeader } from "./table-header";
import { LoanApplication, TableActions } from "./table-action";
import { formatToLocalDate, getTimeFromTimestamp } from "../lib/utils";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

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

interface Status {
  value: string;
  label: string;
}

interface ColumnHeaderProps<TData, TValue> {
  column: ColumnDef<TData, TValue>;
  title?: string;
}

interface LocalLoanApplication {
  fullName: string;
  reason: string;
  createdAt: string;
  status: string;
}

export const columnsVerifier: ColumnDef<LocalLoanApplication>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }: ColumnHeaderProps<LoanApplication, string>) => (
      <TableHeader column={column} title="Name" />
    ),
    cell: ({ row }: { row: Row<LoanApplication> }) => {
      return (
        <div className="flex items-center  space-x-2 min-w-[150px]">
          <Avatar>
            <AvatarFallback>
              {row.getValue("fullName") === ""
                ? "U"
                : (row.getValue("fullName") as string)
                    .split(" ")
                    .map((item) => item[0])}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("fullName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: ({ column }: ColumnHeaderProps<LoanApplication, string>) => (
      <TableHeader column={column} title="Reason" />
    ),
    cell: ({ row }: { row: Row<LoanApplication> }) => {
      return (
        <div className="flex space-x-2">
          <span className="min-w-[300px] truncate font-medium">
            {row.getValue("reason")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }: ColumnHeaderProps<LoanApplication, string>) => (
      <TableHeader column={column} title="Date" />
    ),
    cell: ({ row }: { row: Row<LoanApplication> }) => {
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
    header: ({ column }: ColumnHeaderProps<LoanApplication, string>) => (
      <TableHeader column={column} title="Action" />
    ),
    cell: ({ row }: { row: Row<LoanApplication> }) => {
      const status = statuses.find(
        (status: Status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div
          className={`flex w-[100px] items-center justify-center py-2 rounded-full text-lg ${
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
    filterFn: (row: Row<LoanApplication>, id: string, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }: { row: Row<LoanApplication> }) => (
      <TableActions role="verify" row={row} />
    ),
  },
];
