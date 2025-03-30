"use client";

import { columns } from "../components/column";
import { columnsVerifier } from "../components/verifier";
import DataCard from "../components/data-card";
import { Tables } from "../components/tables";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoanApplication } from "../components/table-action";
import Link from "next/link";

interface ApiResponse {
  activeUsers: number;
  borrowers: number;
  cashDisbursed: { _sum: { amount: number } };
  paidLoansAmount: { _sum: { amount: number } };
  paidLoansCount: number;
  otherAccounts: number;
  loansCount: number;
}

const DashboardPage = () => {
  const [userRole, setUserRole] = useState("");

  const [data, setData] = useState<ApiResponse | undefined>();

  const [adminTableData, setAdminTableData] = useState<LoanApplication[]>([]);
  const [verifierTableData, setVerifierTableData] = useState<LoanApplication[]>(
    []
  );

  const fetchData = async () => {
    const res = await axios.get("/api/data");
    const data = await res.data;
    setData(data);
  };

  const fetchLoans = async () => {
    const res = await axios.get(`/api/admin`);
    const data = await res.data;
    setAdminTableData(data["loans"]);
  };

  const fetchVerifiedLoans = async () => {
    const res = await axios.get(`/api/verify`);
    const data = await res.data;
    setVerifierTableData(data["loans"]);
  };

  const fetchRole = async () => {
    const res = await axios.get("/api/user/role");
    const data = await res.data;
    setUserRole(data.role);
  };

  useEffect(() => {
    fetchRole();
    fetchData();

    if (userRole === "ADMIN") {
      fetchLoans();
    } else if (userRole === "VERIFIER") {
      fetchVerifiedLoans();
    }
  }, [userRole]);

  return (
    <div className="max-w-[1200px] mx-auto mt-10">
      {userRole === "USER" ? (
        <div className="flex flex-col items-center justify-center w-full h-[80vh]">
          <h1 className="text-2xl ">
            Apply for loans from{" "}
            <span className="p-2 bg-zinc-300 text-xl rounded-md">
              <Link href={"/loan"}>LOAN</Link>
            </span>{" "}
            tab
          </h1>
        </div>
      ) : userRole === "ADMIN" ? (
        <div>
          <div>
            <div className="container mx-auto py-10">
              <div className="mb-10 grid grid-cols-4 gap-4 w-full">
                <DataCard
                  image="./group.svg"
                  title="ACTIVE USERS"
                  data={data?.activeUsers || 0}
                />
                <DataCard
                  image="./user-minus.svg"
                  title="BORROWERS"
                  data={data?.borrowers || 0}
                />
                <DataCard
                  image="./cash-multiple.svg"
                  title="CASH DISBURSED"
                  data={data?.cashDisbursed._sum.amount || 0}
                />
                <DataCard
                  image="./currency.svg"
                  title="CASH RECEIVED"
                  data={data?.paidLoansAmount._sum.amount || 0}
                />
              </div>
              <div className="mb-10 grid grid-cols-4 gap-4">
                <DataCard
                  image="./piggy-bank.svg"
                  title="SAVINGS"
                  data={data?.cashDisbursed._sum.amount || 0}
                />
                <DataCard
                  image="./user-check.svg"
                  title="REPAID LOANS"
                  data={data?.paidLoansCount || 0}
                />
                <DataCard
                  image="./bank.svg"
                  title="OTHER ACCOUNTS"
                  data={data?.otherAccounts || 0}
                />
                <DataCard
                  image="./note.svg"
                  title="LOANS"
                  data={data?.loansCount || 0}
                />
              </div>
              <div>
                <div>
                  <h1 className="text-2xl font-semibold mb-10">Recent Loans</h1>
                </div>
                <Tables role="admin" columns={columns} data={adminTableData} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div>
            <div className="container mx-auto py-10">
              <div className="mb-10 grid grid-cols-3 gap-4 w-full">
                <DataCard
                  image="./note.svg"
                  title="LOANS"
                  data={data?.loansCount || 0}
                />
                <DataCard
                  image="./user-minus.svg"
                  title="BORROWERS"
                  data={data?.borrowers || 0}
                />
                <DataCard
                  image="./cash-multiple.svg"
                  title="CASH DISBURSED"
                  data={data?.cashDisbursed._sum.amount || 0}
                />
              </div>
              <div className="mb-10 grid grid-cols-3 gap-4">
                <DataCard
                  image="./piggy-bank.svg"
                  title="SAVINGS"
                  data={data?.cashDisbursed._sum.amount || 0}
                />
                <DataCard
                  image="./user-check.svg"
                  title="REPAID LOANS"
                  data={data?.paidLoansCount || 0}
                />

                <DataCard
                  image="./currency.svg"
                  title="CASH RECEIVED"
                  data={data?.paidLoansAmount._sum.amount || 0}
                />
              </div>
              <div>
                <div>
                  <h1 className="text-2xl font-semibold mb-10">
                    Applied Loans
                  </h1>
                </div>
                <Tables
                  role="verify"
                  columns={columnsVerifier}
                  data={verifierTableData}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
