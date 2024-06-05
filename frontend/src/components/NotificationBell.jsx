import { Button } from "@/components/ui/button";
import { FaBell } from "react-icons/fa";

const NotificationBell = () => {
  return (
    <Button className="rounded-full" size="icon" variant="ghost">
      <FaBell className="w-6 h-6" />
    </Button>
  );
};

export default NotificationBell;
