import "./login.css";
import axios from 'axios'
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL



  const refreshToken = async ( ) => {
    try{
      const res = await axios.post(`${BASE_URL}refresh`,{token:user.refreshToken})
        setUser({
          ...user,
          accessToken:res.data.accessToken,
          refreshToken:res.data.refreshToken
        })
        return res.data
    }catch(err){
      console.log(err)
    }
  }

 
  axios.interceptors.request.use(
    async (config) => {
      if (user && user.accessToken) { // Check if user and user.accessToken are not null
        let currentDate = new Date();
        const decodedToken = jwtDecode(user.accessToken);
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
          const data = await refreshToken();
          config.headers["access_token"] = "Bearer " + data.accessToken;
        } 
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


  const handleSubmit = async (e) => {
    e.preventDefault();
   try{ 
    const res = await axios.post(`${BASE_URL}login`,{username,password})
    setUser(res.data)
   }catch(err){
    console.log(err + '.')
   }
  };

  const handleDelete =async (id) => {
   setError(false)
   setSuccess(false)
   try{
   await axios.delete(`${BASE_URL}users/` + id,
   {
  headers:{access_token:"Bearer " + user.accessToken }
   })
    setSuccess(true)
   }catch(err){
    setError(true)
   }
  }

  return (
    <div className="container">
      {user ? (
        <div className="home">
          <span>
            Welcome to the <b>{user.isAdmin ? "admin" : "user"}</b> dashboard {" "} <b>{ user.username}</b>.
          </span>
          <span>Delete Users:</span>
          <button className="deleteButton" onClick={() => handleDelete(1)}>
            Delete aravinth
          </button>
          <button className="deleteButton" onClick={() => handleDelete(2)} >
            Delete guna
          </button>
          {error && (
            <span className="error">
              You are not allowed to delete this user!
            </span>
          )}
          {success && (
            <span className="success">
            {user.username} has been deleted successfully...
            </span>
          )}
        </div>
      ) : (
        <div className="login">
          <form onSubmit={handleSubmit}>
            <span className="formTitle">Lama Login</span>
            <input
              type="text"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="submitButton">
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;