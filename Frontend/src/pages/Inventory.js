import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

const Inventory = () => {

  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);

  const getProducts = useCallback(async () => {

    try {

      const response = await fetch(
        "http://localhost:4000/api/product/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(data);

    } catch (err) {

      console.log(err);
    }

  }, [token]);


  useEffect(() => {

    getProducts();

  }, [getProducts]);


  const deleteProduct = async (id) => {

    try {

      const response = await fetch(
        `http://localhost:4000/api/product/delete/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      const data = await response.json();

      console.log(data);

      getProducts();

    } catch (err) {

      console.log(err);
    }
  };


  return (
    <div className="container mt-5">

      <h2 className="mb-4">
        Inventory
      </h2>

      <table className="table table-bordered">

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Manufacturer</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {products.map((product) => (
            <tr key={product.id}>

              <td>{product.id}</td>

              <td>{product.name}</td>

              <td>{product.manufacturer}</td>

              <td>{product.stock}</td>

              <td>

                <button
                  className="btn btn-danger"
                  onClick={() =>
                    deleteProduct(product.id)
                  }
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default Inventory;