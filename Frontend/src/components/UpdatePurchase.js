import { fetchWithAuth } from "../utils/fetchWithAuth";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function UpdatePurchase({
  updateModalSetting,
  handlePageUpdate,
  updatePurchaseData,
}) {
  const [purchase, setPurchase] = useState({
    quantityPurchased: updatePurchaseData.QuantityPurchased,
    purchaseDate: updatePurchaseData.PurchaseDate,
    totalPurchaseAmount: updatePurchaseData.TotalPurchaseAmount,
  });
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setPurchase({ ...purchase, [key]: value });
  };

  const handleUpdate = () => {
    fetchWithAuth(`http://localhost:4000/api/purchase/update/${updatePurchaseData.id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(purchase),
    })
      .then(async (result) => {
        if (!result.ok) {
          const err = await result.json().catch(() => ({}));
          throw new Error(err.message || "Failed to update purchase.");
        }
        alert("Purchase updated successfully!");
        handlePageUpdate();
        updateModalSetting();
      })
      .catch((err) => {
        console.error(err);
        alert(err.message || "Server Error");
      });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PencilSquareIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <Dialog.Title as="h3" className="text-lg py-4 font-semibold leading-6 text-gray-900">
                        Edit Purchase
                      </Dialog.Title>
                      <p className="text-sm text-gray-500 mb-4">
                        Product: <span className="font-medium text-gray-700">{updatePurchaseData.product?.name || "N/A"}</span>
                      </p>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="quantityPurchased" className="block mb-2 text-sm font-medium text-gray-900">Quantity Purchased</label>
                            <input type="number" name="quantityPurchased" id="quantityPurchased" value={purchase.quantityPurchased} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" />
                          </div>
                          <div>
                            <label htmlFor="totalPurchaseAmount" className="block mb-2 text-sm font-medium text-gray-900">Total Purchase Amount</label>
                            <input type="number" name="totalPurchaseAmount" id="totalPurchaseAmount" value={purchase.totalPurchaseAmount} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" />
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor="purchaseDate" className="block mb-2 text-sm font-medium text-gray-900">Purchase Date</label>
                            <input type="date" name="purchaseDate" id="purchaseDate" value={purchase.purchaseDate} onChange={(e) => handleInputChange(e.target.name, e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button type="button" className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto" onClick={handleUpdate}>Update</button>
                  <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => updateModalSetting()} ref={cancelButtonRef}>Cancel</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
