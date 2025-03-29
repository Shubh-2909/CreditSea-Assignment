import { Search } from "lucide-react";
import { Tables } from "./tables";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { loanColumns } from "./loan";
import { LoanApplication } from "./table-action";

const DashboardTabs = ({ loans }: { loans: LoanApplication[] }) => {
  return (
    <Tabs defaultValue="borrow_cash" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="borrow_cash">Borrow Cash</TabsTrigger>
        <TabsTrigger value="transact">Transact</TabsTrigger>
        <TabsTrigger value="deposit_cash">Deposit Cash</TabsTrigger>
      </TabsList>
      <div className="flex items-center justify-center my-10">
        <div className="relative w-3/5">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={"Seach for your loans"}
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-full"
          />
        </div>
      </div>
      <TabsContent value="borrow_cash" className="flex justify-center">
        <Tables role="User" columns={loanColumns} data={loans} />
      </TabsContent>
      <TabsContent value="transact" className="flex  justify-center">
        <div>Transaction Tab</div>
      </TabsContent>
      <TabsContent value="deposit_cash" className="flex  justify-center">
        <div>Cash Deposit Tab</div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
