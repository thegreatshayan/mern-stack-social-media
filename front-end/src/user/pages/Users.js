import { useEffect, useState } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import UsersList from "../components/UsersList";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState();

  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest("users");

        setLoadedUsers(responseData.users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [sendRequest]);

  return <>{loadedUsers && <UsersList items={loadedUsers} />}</>;
};

export default Users;
