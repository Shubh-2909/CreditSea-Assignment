import { Search } from "lucide-react";
import { Input } from "../components/ui/input";

const SearchInput = ({ placeholder }: { placeholder?: string }) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground " />
      <Input
        type="search"
        placeholder={"placeholder"}
        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
      />
    </div>
  );
};

export default SearchInput;
