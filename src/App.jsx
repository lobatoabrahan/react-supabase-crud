import React, { useState, useEffect } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://bjliddnkailxjhdgtqov.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbGlkZG5rYWlseGpoZGd0cW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg0OTY3MDEsImV4cCI6MjAwNDA3MjcwMX0.MukXWQEvANcRyGUIO8hDz2Xs-qwWhrC_o_NPFRaKIP4"
);

const App = () => {
  const [users, setUsers] = useState([]);

  const [user, setUser] = useState({
    name: "",
    age: "",
  });

  const [user2, setUser2] = useState({
    id: "",
    name: "",
    age: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    let { data, error } = await supabase
    .from("users")
    .select("*")
    .order("id", { ascending: true })

    setUsers(data);
  }

  function handleChange(event) {
    setUser((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  function handleChange2(event) {
    setUser2((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function createUser() {
    await supabase
      .from("users")
      .insert([{ name: user.name, age: user.age }])
      .select();

    fetchUsers();
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

  function displayUser(userId) {
    users.map((user) => {
      if (user.id == userId) {
        setUser2({ id: user.id, name: user.name, age: user.age });
      }
    });
  }

  async function updateUser(userId) {
    const { data, error } = await supabase
      .from("users")
      .update({ id: user2.id, name: user2.name, age: user2.age })
      .eq("id", userId)
      .select();

    fetchUsers();

    if (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {/* FORM 1 */}
      <form onSubmit={createUser}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Age"
          name="age"
          onChange={handleChange}
        />
        <button type="submit">Create</button>
      </form>

      {/* FORM 2 */}
      <form onSubmit={() => updateUser(user2.id)}>
        <input
          type="text"
          name="name"
          onChange={handleChange2}
          defaultValue={user2.name}
        />
        <input
          type="number"
          name="age"
          onChange={handleChange2}
          defaultValue={user2.age}
        />
        <button type="submit">Save Changes</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>
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
