import { fetchWithAuth } from "../utils/fetchWithAuth";
import React, { useState, useEffect, useContext } from "react";
import AddPurchaseDetails from "../components/AddPurchaseDetails";
import UpdatePurchase from "../components/UpdatePurchase";
import AuthContext from "../AuthContext";

function PurchaseDetails() {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatePurchaseData, setUpdatePurchaseData] = useState(null);
  const [purchase, setAllPurchaseData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);
  const userId = authContext.user?.id ?? authContext.user;

  const fetchPurchaseData = React.useCallback(() => {
    if (!userId) return;
    fetchWithAuth(`http://localhost:4000/api/purchase/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllPurchaseData(data);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  const fetchProductsData = React.useCallback(() => {
    if (!userId) return;
    fetchWithAuth(`http://localhost:4000/api/product/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  useEffect(() => {
    fetchPurchaseData();
    fetchProductsData();
  }, [updatePage, userId, fetchPurchaseData, fetchProductsData]);

  const addSaleModalSetting = () => {
    setPurchaseModal(!showPurchaseModal);
  };

  const updateModalSetting = (element) => {
    setUpdatePurchaseData(element || null);
    setShowUpdateModal(!showUpdateModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const deletePurchase = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase? Stock will be adjusted.")) return;
    try {
      const response = await fetchWithAuth(`http://localhost:4000/api/purchase/delete/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete purchase.");
      }
      alert("Purchase deleted and stock adjusted.");
      handlePageUpdate();
    } catch (err) {
      console.error(err);
      alert(err.message || "Server Error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {showPurchaseModal && (
        <AddPurchaseDetails
          addSaleModalSetting={addSaleModalSetting}
          products={products}
          handlePageUpdate={handlePageUpdate}
          authContext={authContext}
        />
      )}
      {showUpdateModal && updatePurchaseData && (
        <UpdatePurchase
          updateModalSetting={updateModalSetting}
          handlePageUpdate={handlePageUpdate}
          updatePurchaseData={updatePurchaseData}
        />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Purchase Details</h2>
        <button
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          onClick={addSaleModalSetting}
        >
          Add Purchase
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
                  Quantity Purchased
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Purchase Amount
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {purchase.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                    No purchase records found.
                  </td>
                </tr>
              ) : (
                purchase.map((element) => (
                  <tr key={element.id} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {element.product?.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {element.QuantityPurchased} units
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(element.PurchaseDate).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "Today"
                        : element.PurchaseDate}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                      ${element.TotalPurchaseAmount}
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
                        onClick={() => deletePurchase(element.id)}
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

export default PurchaseDetails;
