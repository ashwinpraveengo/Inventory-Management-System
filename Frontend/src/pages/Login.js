import React, { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";


const Login = () => {

  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {

    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:4000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Login failed");

        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login Successful");

      authContext.signin(data.user, () => {
        navigate("/");
      });

    } catch (err) {

      console.log(err);

      alert("Server Error");
    }
  };


  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow p-4">

            <h2 className="text-center mb-4">
              Login
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">

                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Login
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;