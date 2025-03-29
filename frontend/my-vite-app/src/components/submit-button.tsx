import { useFormStatus } from "react-dom";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      className="bg-[#507687] hover:[#384B70]"
      type="submit"
    >
      {pending ? <Loader2 className="animate-spin" /> : "Submit"}
    </Button>
  );
};

export default SubmitButton;
