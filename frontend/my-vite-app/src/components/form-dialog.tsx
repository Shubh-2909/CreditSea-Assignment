import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useToast } from "../components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { LoanApplication } from "./table-action";

type Data = {
  name: string;
  amount: string;
  time: string;
  job: string;
  reason: string;
  addr: string;
  terms: boolean;
  terms2: boolean; // Add this line
};

const FormDialog = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<Data>({
    name: "",
    amount: "",
    time: "",
    job: "",
    reason: "",
    addr: "",
    terms: false,
    terms2: false,
  });

  const [loans, setLoans] = useState<LoanApplication[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await axios.post("/api/forms", formData);

    const data = await res.data;

    console.log(data);

    toast({ title: "Loan application submitted successfully" });
    setFormData({
      name: "",
      amount: "",
      time: "",
      job: "",
      reason: "",
      addr: "",
      terms: false,
      terms2: false,
    });
    fecthUser();
  };

  const fecthUser = async () => {
    const res = await axios.get(`/api/user/myLoans`);
    const data = await res.data;
    setLoans(data["loans"]);
  };

  useEffect(() => {
    fecthUser();
  }, []);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = event.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#507687] shadow-lg hover:bg-[#507687]">
          Get a Loan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <form onSubmit={handleSubmit} className="grid gap-8 py-4">
          <DialogHeader>
            <DialogTitle>Apply for a loan</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2  gap-6">
            <div>
              <Label htmlFor="name" className="text-right">
                Full name as it appears on bank account
              </Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                id="name"
                placeholder="Full name as it appears on bank account"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-right">
                How much do you need?
              </Label>
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="How much do you need?"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="time" className="text-right">
                Loan tenure (in months)
              </Label>
              <Input
                type="number"
                name="time"
                value={formData.time}
                onChange={handleChange}
                id="time"
                placeholder="Loan tenure (in months)"
              />
            </div>
            <div>
              <Label htmlFor="job" className="text-right">
                Employment status
              </Label>
              <Input
                type="text"
                name="job"
                value={formData.job}
                onChange={handleChange}
                id="job"
                placeholder="Employment status"
              />
            </div>
          </div>
          <div className="grid grid-cols-2  gap-6">
            <div>
              <Label htmlFor="reason" className="text-right">
                Reason for loan
              </Label>
              <Input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                id="reason"
                placeholder="Reason for loan"
              />
            </div>
            <div>
              <Label htmlFor="addr" className="text-right">
                Employment address
              </Label>
              <Input
                id="addr"
                type="text"
                name="addr"
                value={formData.addr}
                onChange={handleChange}
                placeholder="Employment address"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mr-2"
                id="terms"
              />
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read the important information and accept that by
                completing the application I will be bound by the terms
              </Label>
            </div>
            <div>
              <input
                type="checkbox"
                name="terms2"
                checked={formData.terms2}
                onChange={handleChange}
                id="terms2"
                className="mr-2"
              />
              <Label
                htmlFor="terms2"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Any personal and credit information obtained may be disclosed
                from time to time to other lenders, credit bureaus or other
                credit reporting agencies.
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-[#507687] hover:[#507687]" type="submit">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
