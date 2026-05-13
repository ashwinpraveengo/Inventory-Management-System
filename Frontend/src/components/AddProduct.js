import React, { useState } from "react";


const AddProduct = () => {

  const token = localStorage.getItem("token");

  const [product, setProduct] = useState({
    name: "",
    manufacturer: "",
    description: "",
  });


  const handleChange = (e) => {

    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:4000/api/product/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(product),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.message || "Failed");

        return;
      }

      alert("Product Added Successfully");

      setProduct({
        name: "",
        manufacturer: "",
        description: "",
      });

    } catch (err) {

      console.log(err);

      alert("Server Error");
    }
  };


  return (
    <div className="container mt-5">

      <div className="card p-4 shadow">

        <h2 className="mb-4">
          Add Product
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">

            <label>Product Name</label>

            <input
              type="text"
              name="name"
              className="form-control"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">

            <label>Manufacturer</label>

            <input
              type="text"
              name="manufacturer"
              className="form-control"
              value={product.manufacturer}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">

            <label>Description</label>

            <textarea
              name="description"
              className="form-control"
              value={product.description}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
          >
            Add Product
          </button>

        </form>

      </div>

    </div>
  );
};

export default AddProduct;