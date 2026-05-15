import { fetchWithAuth } from "../utils/fetchWithAuth";
import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProductData, setUpdateProductData] = useState(null);
  const [updatePage, setUpdatePage] = useState(true);

  const localStorageData = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = localStorageData.role === "admin";

  const getProducts = useCallback(async () => {
    try {
      const response = await fetchWithAuth(
        "http://localhost:4000/api/product/get"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts, updatePage]);

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? All related sales and purchases will also be removed.")) return;
    try {
      const response = await fetchWithAuth(
        `http://localhost:4000/api/product/delete/${id}`,
        { method: "DELETE" }
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

  const addProductModalSetting = () => {
    setShowAddProductModal(!showAddProductModal);
  };

  const updateModalSetting = (product) => {
    setUpdateProductData(product || null);
    setShowUpdateModal(!showUpdateModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="flex flex-col gap-6">
      {showAddProductModal && (
        <AddProduct
          addProductModalSetting={addProductModalSetting}
          handlePageUpdate={handlePageUpdate}
        />
      )}
      {showUpdateModal && updateProductData && (
        <UpdateProduct
          updateProductData={updateProductData}
          updateModalSetting={updateModalSetting}
          handlePageUpdate={handlePageUpdate}
        />
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory</h2>
        {isAdmin && (
          <button
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            onClick={addProductModalSetting}
          >
            Add Product
          </button>
        )}
      </div>

      <div className="bg-white shadow-sm ring-1 ring-black ring-opacity-5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Manufacturer
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                {isAdmin && (
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? "5" : "4"} className="px-6 py-8 text-center text-sm text-gray-500">
                    No products found in inventory.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.manufacturer}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.stock} units
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-3">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors focus:outline-none"
                          onClick={() => updateModalSetting(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 font-medium transition-colors focus:outline-none"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;