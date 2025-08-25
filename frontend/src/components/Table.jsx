// Importing libraries and components
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import EditUserModal from "./modals/EditUserModal";
import CreateUserModal from "./modals/CreateUserModal";
import DeleteUserModal from "./modals/DeleteUserModal";

// Parent functional component
function Table() {
  // State variables and ref
  const [users, setUsers] = useState([]); // Holds user data
  const hasFetchedUsers = useRef(false); // Tracks if data fetch is attempted

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}`);
        const data = response.data;

        // Ensure the response is an array
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("API response is not an array:", data);
          setUsers([]);
        }

        // Toast notification for success
        if (!hasFetchedUsers.current) {
          toast.success("Data Fetched");
          hasFetchedUsers.current = true;
        }
      } catch (error) {
        console.error("Error fetching users:", error);

        // Handle fetch failure
        if (!hasFetchedUsers.current) {
          toast.error("Error Fetching Data");
          hasFetchedUsers.current = true;
        }
        setUsers([]); // Ensure users is an empty array on error
      }
    };

    // Call fetch function
    fetchUsers();
  }, []);

  // Function to add a new user to the list
  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  // Render component
  return (
    <>
      <Toaster richColors closeButton />
      <div className="container mt-5">
        <h1 className="mb-4" id="h1">
          User Table
        </h1>
        <CreateUserModal addUser={addUser} />
        <EditUserModal />
        <DeleteUserModal />

        {users.length === 0 ? (
          <h3 id="h3">No Users in Database</h3>
        ) : (
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// Exporting the component
export default Table;
