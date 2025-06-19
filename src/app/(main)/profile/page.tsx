import useUser from "../hooks/use-user";

const Page = () => {
  const { userQuery } = useUser();
  const user = userQuery.data;

  return <div>Balance: {user?.balance}</div>;
};

export default Page;
