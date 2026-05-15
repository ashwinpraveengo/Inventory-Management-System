import { fetchWithAuth } from "../utils/fetchWithAuth";
import React, { useCallback, useState, useEffect, useContext } from "react";
import AddSale from "../components/AddSale";
import UpdateSale from "../components/UpdateSale";
import AuthContext from "../AuthContext";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateSaleData, setUpdateSaleData] = useState(null);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);
  const userId = authContext.user?.id ?? authContext.user;

  const fetchSalesData = useCallback(() => {
    if (!userId) return;
    fetchWithAuth(`http://localhost:4000/api/sales/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllSalesData(data);
      })
      .catch((err) => console.error("fetchSalesData", err));
  }, [userId]);

  const fetchProductsData = useCallback(() => {
    if (!userId) return;
    fetchWithAuth(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.error("fetchProductsData", err));
  }, [userId]);

  const fetchStoresData = useCallback(() => {
    if (!userId) return;
    fetchWithAuth(`http://localhost:4000/api/store/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      })
      .catch((err) => console.error("fetchStoresData", err));
  }, [userId]);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage, userId, fetchSalesData, fetchProductsData, fetchStoresData]);

  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  const updateModalSetting = (element) => {
    setUpdateSaleData(element || null);
    setShowUpdateModal(!showUpdateModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const deleteSale = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale? Stock will be restored.")) return;
    try {
      const response = await fetchWithAuth(`http://localhost:4000/api/sales/delete/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete sale.");
      }
      alert("Sale deleted and stock restored.");
      handlePageUpdate();
    } catch (err) {
      console.error(err);
      alert(err.message || "Server Error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {showSaleModal && (
        <AddSale
          addSaleModalSetting={addSaleModalSetting}
          products={products}
          stores={stores}
          handlePageUpdate={handlePageUpdate}
          authContext={authContext}
        />
      )}
      {showUpdateModal && updateSaleData && (
        <UpdateSale
          updateModalSetting={updateModalSetting}
          handlePageUpdate={handlePageUpdate}
          updateSaleData={updateSaleData}
        />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sales</h2>
        <button
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          onClick={addSaleModalSetting}
        >
          Add Sale
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white shadow-sm ring-1 ring-black ring-opacity-5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Store Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock Sold
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sales Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Sale Amount
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                    No sales records found.
                  </td>
                </tr>
              ) : (
                sales.map((element) => (
                  <tr key={element.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {element.product?.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {element.store?.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {element.StockSold} units
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {element.SaleDate}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                      ${element.TotalSaleAmount}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-3">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors focus:outline-none"
                        onClick={() => updateModalSetting(element)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 font-medium transition-colors focus:outline-none"
                        onClick={() => deleteSale(element.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;
