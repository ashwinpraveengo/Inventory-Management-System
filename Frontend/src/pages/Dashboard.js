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
    fetch(`http://localhost:4000/api/sales/get/${userId}/totalsaleamount`)
      .then(handleResponse)
      .then((datas) => setSaleAmount(datas.totalSaleAmount || 0))
      .catch((err) => console.error("fetchTotalSaleAmount", err));
  }, [userId, handleResponse]);

  const fetchTotalPurchaseAmount = useCallback(() => {
    if (!userId) return;
    fetch(`http://localhost:4000/api/purchase/get/${userId}/totalpurchaseamount`)
      .then(handleResponse)
      .then((datas) => setPurchaseAmount(datas.totalPurchaseAmount || 0))
      .catch((err) => console.error("fetchTotalPurchaseAmount", err));
  }, [userId, handleResponse]);

  const fetchStoresData = useCallback(() => {
    if (!userId) return;
    fetch(`http://localhost:4000/api/store/get/${userId}`)
      .then(handleResponse)
      .then((datas) => setStores(Array.isArray(datas) ? datas : []))
      .catch((err) => console.error("fetchStoresData", err));
  }, [userId, handleResponse]);

  const fetchProductsData = useCallback(() => {
    if (!userId) return;
    fetch(`http://localhost:4000/api/product/get/${userId}`)
      .then(handleResponse)
      .then((datas) => setProducts(Array.isArray(datas) ? datas : []))
      .catch((err) => console.error("fetchProductsData", err));
  }, [userId, handleResponse]);

  const fetchMonthlySalesData = useCallback(() => {
    fetch(`http://localhost:4000/api/sales/getmonthly`)
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
    <>
      <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 md:grid-cols-3 lg:grid-cols-4  p-4 ">
        <article className="flex flex-col gap-4 rounded-lg border  border-gray-100 bg-white p-6  ">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Sales
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                ${saleAmount}
              </span>

              <span className="text-xs text-gray-500"> from $240.94 </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col  gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Purchase
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                ${purchaseAmount}{" "}
              </span>

              <span className="text-xs text-gray-500"> from $404.32 </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col   gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Total Products
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                {products.length}{" "}
              </span>

              {/* <span className="text-xs text-gray-500"> from $404.32 </span> */}
            </p>
          </div>
        </article>
        <article className="flex flex-col   gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Total Stores
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {" "}
                {stores.length}{" "}
              </span>

              {/* <span className="text-xs text-gray-500"> from 0 </span> */}
            </p>
          </div>
        </article>
        <div className="flex justify-around bg-white rounded-lg py-8 col-span-full justify-center">
          <div className="w-full max-w-3xl">
            {shouldRenderChart ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <div className="text-sm text-gray-500 p-4">
                Chart data unavailable or still loading.
              </div>
            )}
          </div>
          <div>
            <Doughnut data={data} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
