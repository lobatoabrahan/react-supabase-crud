import React, { useState, useEffect } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://bjliddnkailxjhdgtqov.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbGlkZG5rYWlseGpoZGd0cW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg0OTY3MDEsImV4cCI6MjAwNDA3MjcwMX0.MukXWQEvANcRyGUIO8hDz2Xs-qwWhrC_o_NPFRaKIP4"
);

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateAge, setUpdateAge] = useState("");
  const [updateUsers, setUpdateUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      if (data != null) {
        setUsers(data); // [id,name,age]
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async function createUser() {
    try {
      const [data, error] = await supabase
        .from("users")
        .insert([{ name: name, age: age }])
        .select();

      fetchUsers();

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  }

  async function deleteUser(userId) {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    fetchUsers();

    if (error) {
      console.log(error);
    }
  }

  async function displayUser(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId);

    setUpdateUsers(data);

    if (error) {
      console.log(error);
    }
  }

  async function updateUser(userId, updatedName, updatedAge) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          name: updatedName,
          age: updatedAge,
        })
        .eq("id", userId)
        .select();

      if (error) throw error;
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  }

  /* async function updateUser(userId) {
    const { data, error } = await supabase
      .from("users")
      .update({ id: user2.id, name: user2.name, age: user2.age })
      .eq("id", userId)
      .select();

    fetchUsers();

    if (error) {
      console.log(error);
    }
  } */

  return (
    <div>
      {/* FORM 1 */}
      <form onSubmit={createUser}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          name="age"
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>

      {/* FORM 2 */}
      {updateUsers.map((user) => (
        <form
          key={user.id}
          onSubmit={(e) => {
            e.preventDefault();
            const updatedName = updateName !== "" ? updateName : user.name;
            const updatedAge =
              updateAge !== "" ? parseInt(updateAge) : user.age;
            updateUser(user.id, updatedName, updatedAge);
          }}
        >
          <input
            type="text"
            name="name"
            onChange={(e) => setUpdateName(e.target.value)}
            defaultValue={user.name}
          />
          <input
            type="number"
            name="age"
            onChange={(e) => setUpdateAge(e.target.value)}
            defaultValue={user.age}
          />
          <button type="submit">Save Changes</button>
        </form>
      ))}

      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Id
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Age
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-white border-b">
              <td className="px-6 py-4">{user.id}</td>
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.age}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => {
                    deleteUser(user.id);
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    displayUser(user.id);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
