import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserListVisible, setIsUserListVisible] = useState(false); // Add isUserListVisible state

  const getUsers = () => {
    setIsLoading(true);
    Axios.get("http://localhost:3001/users")
      .then((response) => {
        setUserList(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isUserListVisible) {
      getUsers();
    }
  }, [isUserListVisible]);

  const toggleUserList = () => {
    setIsUserListVisible(!isUserListVisible); // Toggle the user list visibility
  };

  const addUser = () => {
    Axios.post("http://localhost:3001/createUser", {
      user_name: username,
      user_birthday: birthday,
      user_phone: phone,
      user_email: email,
      user_password: password,
    }).then(() => {
      getUsers();
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const editUser = (userId) => {
    const updatedUserList = userList.map((user) => {
      if (user._id === userId) {
        return { ...user, isEditing: true };
      }
      return user;
    });
    setUserList(updatedUserList);
  };

  const saveUser = (userId) => {
    const userToUpdate = userList.find((user) => user._id === userId);
    if (userToUpdate) {
      Axios.put(`http://localhost:3001/updateUser/${userId}`, userToUpdate).then(() => {
        getUsers();
      });
    }
  };

  const cancelEdit = (userId) => {
    const updatedUserList = userList.map((user) => {
      if (user._id === userId) {
        return { ...user, isEditing: false };
      }
      return user;
    });
    setUserList(updatedUserList);
  };

  const deleteUser = (userId) => {
    Axios.delete(`http://localhost:3001/deleteUser/${userId}`).then(() => {
      getUsers();
    });
  };

  // Function to search users by name
const searchUsersByName = () => {
  Axios.get(`http://localhost:3001/searchUsersByName?name=${searchQuery}`)
    .then((response) => {
      setSearchResults(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};

  return (
    <div className="App">
      <div className="information">
        <h2>Add User</h2>
        <label>Username:</label>
        <input
          type="text"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <label>Birthday:</label>
        <input
          type="date"
          onChange={(event) => {
            setBirthday(event.target.value);
          }}
        />
        <label>Phone:</label>
        <input
          type="text"
          onChange={(event) => {
            setPhone(event.target.value);
          }}
        />
        <label>Email:</label>
        <input
          type="email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <label>Password:</label>
        <input
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button onClick={addUser}>Add User</button>
      </div>
      <div className="users">
        <h2>User List</h2>
        <button onClick={toggleUserList}>
          {isUserListVisible ? "Hide Users" : "Show Users"} {/* Toggle button text */}
        </button>

        {isLoading ? (
          <p>Loading...</p>
        ) : isUserListVisible ? ( // Check if the user list is visible
          userList.map((user) => (
            <div className="user" key={user._id}>
              <div>
                <h3>ID: {user._id}</h3>
                {user.isEditing ? (
                  // Edit Mode
                  <>
                    <input
                      type="text"
                      value={user.user_name}
                      onChange={(e) => {
                        const updatedUserList = userList.map((u) => {
                          if (u._id === user._id) {
                            return { ...u, user_name: e.target.value };
                          }
                          return u;
                        });
                        setUserList(updatedUserList);
                      }}
                    />
                    <input
                      type="date"
                      value={user.user_birthday}
                      onChange={(e) => {
                        const updatedUserList = userList.map((u) => {
                          if (u._id === user._id) {
                            return { ...u, user_birthday: e.target.value };
                          }
                          return u;
                        });
                        setUserList(updatedUserList);
                      }}
                    />
                    <input
                      type="text"
                      value={user.user_phone}
                      onChange={(e) => {
                        const updatedUserList = userList.map((u) => {
                          if (u._id === user._id) {
                            return { ...u, user_phone: e.target.value };
                          }
                          return u;
                        });
                        setUserList(updatedUserList);
                      }}
                    />
                    <input
                      type="email"
                      value={user.user_email}
                      onChange={(e) => {
                        const updatedUserList = userList.map((u) => {
                          if (u._id === user._id) {
                            return { ...u, user_email: e.target.value };
                          }
                          return u;
                        });
                        setUserList(updatedUserList);
                      }}
                    />
                    <input
                      type="password"
                      value={user.user_password}
                      onChange={(e) => {
                        const updatedUserList = userList.map((u) => {
                          if (u._id === user._id) {
                            return { ...u, user_password: e.target.value };
                          }
                          return u;
                        });
                        setUserList(updatedUserList);
                      }}
                    />
                    <button onClick={() => saveUser(user._id)}>Save</button>
                    <button onClick={() => cancelEdit(user._id)}>Cancel</button>
                  </>
                ) : (
                  // Display Mode
                  <>
                    <h3>Username: {user.user_name}</h3>
                    <h3>Birthday: {formatDate(user.user_birthday)}</h3>
                    <h3>Phone: {user.user_phone}</h3>
                    <h3>Email: {user.user_email}</h3>
                    <button onClick={() => editUser(user._id)}>Edit</button>
                    <button onClick={() => deleteUser(user._id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : null}
      </div>
      <div className="search">
        <h2>Search Users</h2>
        <label>Search Users:</label>
        <input
          type="text"
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
        />
        <button onClick={searchUsersByName}>Search</button>
      </div>

      <div className="search-results">
        <h2>Search Results</h2>
        {searchResults.map((result, index) => {
          return (
            <div className="search-result" key={index}>
              <p>Username: {result.user_name}</p>
              <p>Birthday: {formatDate(result.user_birthday)}</p>
              <p>Phone: {result.user_phone}</p>
              <p>Email: {result.user_email}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;