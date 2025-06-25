"use client";

import useUsers from "./hooks/use-users";
import Loading from "@/app/loading";
import UsersTable from "./components/data-table/users-table";
import columns from "./components/data-table/columns";
import { H3 } from "@/components/ui/typography";

const Page = () => {
  const { usersQuery } = useUsers();
  const users = usersQuery.data || [];

  if (usersQuery.isPending) {
    return <Loading />;
  }

  return (
    <div className="p-4 pt-0 space-y-4">
      <H3>Users</H3>
      <div>
        <UsersTable columns={columns} data={users} />
      </div>
    </div>
  );
};

export default Page;
