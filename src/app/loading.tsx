import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};

export default Loading;
