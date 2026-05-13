import React, { useState } from "react";

import { useNavigate } from "react-router-dom";


const Register = () => {

  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    imageUrl: "",
  });


  const handleChange = (e) => {

    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:4000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(registerData),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Registration failed");

        return;
      }

      alert("Registration Successful");

      navigate("/login");

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
              Register
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label>First Name</label>

                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">

                <label>Last Name</label>

                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

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

              <div className="mb-3">

                <label>Phone Number</label>

                <input
                  type="text"
                  name="phoneNumber"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">

                <label>Image URL</label>

                <input
                  type="text"
                  name="imageUrl"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
              >
                Register
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;