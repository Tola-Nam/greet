import React, { useEffect, useState } from "react";
import "./FetchData.css";

function FetchData() {
  const [userData, setData] = useState([]);

  const apiUrl = "https://jsonplaceholder.typicode.com/users";

  const fetchUsers = async () => {
    const response = await fetch(apiUrl);
    const data = await response.json();
    setData(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Users List</h1>

      <button className="refresh-btn" onClick={fetchUsers}>
        Refresh Data
      </button>

      <div className="card-container">
        {userData.map((user) => {
          const isEven = user.id % 2 === 0;

          return (
            <div
              key={user.id}
              className="card"
              style={{
                color: isEven ? "blue" : "red",
              }}
            >
              <h2>{user.name}</h2>

              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Website:</strong> {user.website}
              </p>

              <div className="section">
                <h4>Address</h4>
                <p>
                  {user.address.street}, {user.address.suite}
                </p>
                <p>
                  {user.address.city}, {user.address.zipcode}
                </p>
              </div>

              <div className="section">
                <h4>Company</h4>
                <p>{user.company.name}</p>
                <small>{user.company.catchPhrase}</small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FetchData;
