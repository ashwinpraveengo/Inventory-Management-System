import { fetchWithAuth } from "../utils/fetchWithAuth";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);
export const data = {
  labels: ["Apple", "Knorr", "Shoop", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [0, 1, 5, 8, 9, 15],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);

  const [chart, setChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
    series: [
      {
        name: "series",
        data: [10, 20, 40, 50, 60, 20, 10, 35, 45, 70, 25, 70],
      },
    ],
  });

  // Update Chart Data
  const updateChartData = useCallback((salesData) => {
    const safeData = Array.isArray(salesData) ? salesData : [];
    setChart((prevChart) => ({
      ...prevChart,
      series: [
        {
          name: "Monthly Sales Amount",
          data: safeData,
        },
      ],
    }));
  }, []);

  const authContext = useContext(AuthContext);
  const userId = authContext.user?.id ?? authContext.user;

  const handleResponse = useCallback(async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }
    return response.json();
  }, []);

  const fetchTotalSaleAmount = useCallback(() => {
    if (!userId) return;
    fetchWithAuth(`http://localhost:4000/api/sales/get/totalsaleamount`)
      .then(handleResponse)
      .then((datas) => setSaleAmount(datas.totalSaleAmount || 0))
      .catch((err) => console.error("fetchTotalSaleAmount", err));
  }, [userId, handleResponse]);

  const fetchTotalPurchaseAmount = useCallback(() => {
    if (!userId) return;
    fetchWithAuth(`http://localhost:4000/api/purchase/get/totalpurchaseamount`)
      .then(handleResponse)
      .then((datas) => setPurchaseAmount(datas.totalPurchaseAmount || 0))
      .catch((err) => console.error("fetchTotalPurchaseAmount", err));
  }, [userId, handleResponse]);

  const fetchStoresData = useCallback(() => {
    if (!userId) return;
    fetchWithAuth(`http://localhost:4000/api/store/get`)
      .then(handleResponse)
      .then((datas) => setStores(Array.isArray(datas) ? datas : []))
      .catch((err) => console.error("fetchStoresData", err));
  }, [userId, handleResponse]);

  const fetchProductsData = useCallback(() => {
    if (!userId) return;
    fetchWithAuth(`http://localhost:4000/api/product/get`)
      .then(handleResponse)
      .then((datas) => setProducts(Array.isArray(datas) ? datas : []))
      .catch((err) => console.error("fetchProductsData", err));
  }, [userId, handleResponse]);

  const fetchMonthlySalesData = useCallback(() => {
    fetchWithAuth(`http://localhost:4000/api/sales/getmonthly`)
      .then(handleResponse)
      .then((datas) => updateChartData(Array.isArray(datas?.salesAmount) ? datas.salesAmount : []))
      .catch((err) => console.error("fetchMonthlySalesData", err));
  }, [handleResponse, updateChartData]);

  useEffect(() => {
    if (!userId) return;

    fetchTotalSaleAmount();
    fetchTotalPurchaseAmount();
    fetchStoresData();
    fetchProductsData();
    fetchMonthlySalesData();
  }, [userId, fetchTotalSaleAmount, fetchTotalPurchaseAmount, fetchStoresData, fetchProductsData, fetchMonthlySalesData]);

  const safeChartSeries = Array.isArray(chart.series)
    ? chart.series.map((serie) => ({
        ...serie,
        data: Array.isArray(serie.data) ? serie.data : [],
      }))
    : [
        {
          name: "Monthly Sales Amount",
          data: [],
        },
      ];

  const safeChartOptions = chart.options ?? {};

  const shouldRenderChart =
    Array.isArray(safeChartSeries) &&
    safeChartSeries.length > 0 &&
    safeChartSeries.every((serie) => Array.isArray(serie.data));

  const barChartData = {
    labels: safeChartOptions.xaxis?.categories ?? [],
    datasets: [
      {
        label: "Monthly Sales Amount",
        data: safeChartSeries[0]?.data ?? [],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Sales Amount",
        },
        beginAtZero: true,
      },
    },
  };

  console.log("Dashboard chart props", {
    series: safeChartSeries,
    options: safeChartOptions,
    shouldRenderChart,
    barChartData,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Sales Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-50 rounded-md p-3">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">${saleAmount}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">Increased by</span>
                      12%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-50 rounded-md p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Purchases</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">${purchaseAmount}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <svg className="self-center flex-shrink-0 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="sr-only">Decreased by</span>
                      2.4%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-50 rounded-md p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{products.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Stores Card */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-50 rounded-md p-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Stores</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stores.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h3>
          <div className="relative h-80 w-full">
            {shouldRenderChart ? (
              <Bar data={barChartData} options={{...barChartOptions, maintainAspectRatio: false}} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">
                Chart data unavailable or still loading.
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Distribution</h3>
          <div className="relative h-80 w-full flex items-center justify-center">
            <Doughnut data={data} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
