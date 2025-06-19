import Loading from "@/app/loading";
import useUser from "../hooks/use-user";
import formatMoney from "../utils/format-money";

const Page = () => {
  const { userQuery } = useUser();
  const user = userQuery.data;

  if (userQuery.isPending) {
    return <Loading />;
  }

  return <div>Balance: {formatMoney(user?.balance || 0)}</div>;
};

export default Page;
