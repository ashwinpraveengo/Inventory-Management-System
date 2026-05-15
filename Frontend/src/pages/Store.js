import { fetchWithAuth } from "../utils/fetchWithAuth";
import React, { useState, useEffect, useContext } from "react";
import AddStore from "../components/AddStore";
import UpdateStore from "../components/UpdateStore";
import AuthContext from "../AuthContext";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateStoreData, setUpdateStoreData] = useState(null);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);
  const userId = authContext.user?.id ?? authContext.user;

  // Fetching all stores data
  const fetchData = React.useCallback(() => {
    if (!userId) return;
    fetchWithAuth(`http://localhost:4000/api/store/get`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [userId, fetchData, updatePage]);

  const modalSetting = () => {
    setShowModal(!showModal);
  };

  const updateModalSetting = (element) => {
    setUpdateStoreData(element || null);
    setShowUpdateModal(!showUpdateModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const deleteStore = async (id) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
    try {
      const response = await fetchWithAuth(`http://localhost:4000/api/store/delete/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete store.");
      }
      alert("Store deleted.");
      handlePageUpdate();
    } catch (err) {
      console.error(err);
      alert(err.message || "Server Error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {showModal && <AddStore addStoreModalSetting={modalSetting} handlePageUpdate={handlePageUpdate} />}
      {showUpdateModal && updateStoreData && (
        <UpdateStore
          updateModalSetting={updateModalSetting}
          handlePageUpdate={handlePageUpdate}
          updateStoreData={updateStoreData}
        />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Stores</h2>
        <button
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          onClick={modalSetting}
        >
          Add Store
        </button>
      </div>

      {/* Stores Grid */}
      {stores.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm">No stores found. Click 'Add Store' to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((element) => (
            <div
              className="bg-white rounded-xl shadow-sm ring-1 ring-black ring-opacity-5 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
              key={element.id}
            >
              <div className="relative h-48 w-full bg-gray-100 flex-shrink-0">
                {element.image ? (
                  <img
                    alt={element.name}
                    className="h-full w-full object-cover"
                    src={element.image}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{element.name}</h3>
                <div className="flex items-start text-gray-500 text-sm mb-4">
                  <svg className="h-5 w-5 mr-1.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{element.address}{element.city ? `, ${element.city}` : ''}</span>
                </div>
                <div className="mt-auto flex items-center space-x-3 pt-3 border-t border-gray-100">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium transition-colors focus:outline-none"
                    onClick={() => updateModalSetting(element)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 text-sm font-medium transition-colors focus:outline-none"
                    onClick={() => deleteStore(element.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Store;
