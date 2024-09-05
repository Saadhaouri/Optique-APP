import {
  CalendarOutlined,
  DollarOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, message, Table } from "antd";
import { useEffect, useState } from "react";
import { TbEyeStar } from "react-icons/tb";
import { Link } from "react-router-dom";
import {
  getClientsDueForVisiteBeforeMonthEnd,
  getVisitesOfCurrentDay,
  getVisitesOfCurrentMonth,
  getVisitesOfCurrentWeek,
} from "../Services/visite";

import {
  getTotalDailyProfit,
  getTotalMonthlyProfit,
  getTotalWeeklyProfit,
} from "../Services/VenteServices";
import { Visite } from "../Types/Client";
import ChartComponent from "./ChartComponent";
import ResetPanel from "./ResetPanel";

const DashboardPage = () => {
  const [visiteclient, setVisiteclient] = useState<Visite[]>([]);
  const [dailyProfit, setDailyProfit] = useState<number>(0);
  const [weeklyProfit, setWeeklyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [dailyVisits, setDailyVisits] = useState(0);
  const [weeklyVisits, setWeeklyVisits] = useState(0);
  const [monthlyVisits, setMonthlyVisits] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          visitesResponse,
          dailyVisitsResponse,
          weeklyVisitsResponse,
          monthlyVisitsResponse,
        ] = await Promise.all([
          getClientsDueForVisiteBeforeMonthEnd(),
          getVisitesOfCurrentDay(),
          getVisitesOfCurrentWeek(),
          getVisitesOfCurrentMonth(),
        ]);

        setVisiteclient(visitesResponse.data);
        setDailyVisits(dailyVisitsResponse.data.length);
        setWeeklyVisits(weeklyVisitsResponse.data.length);
        setMonthlyVisits(monthlyVisitsResponse.data.length);
      } catch (error) {
        console.error("There was an error fetching data!", error);
      }
    };

    fetchData();
    fetchProfitData();
  }, []);

  const fetchProfitData = async () => {
    try {
      const [daily, weekly, monthly] = await Promise.all([
        getTotalDailyProfit(),
        getTotalWeeklyProfit(),
        getTotalMonthlyProfit(),
      ]);
      setDailyProfit(daily);
      setWeeklyProfit(weekly);
      setMonthlyProfit(monthly);
    } catch (error) {
      message.error("Erreur lors de la récupération des bénéfices");
    }
  };

  const columns = [
    {
      title: "Client ",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Date Visite",
      dataIndex: "dateVisite",
      key: "dateVisite",
      render: (dateVisite: string) => new Date(dateVisite).toLocaleDateString(),
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="bg-white shadow rounded-lg p-6 mb-4 flex justify-between items-center">
        <h1 className="font-bold text-3xl">Tableau de bord</h1>
        <Button type="primary" className="bg-blue-500">
          <Link to="/clients" className="flex items-center space-x-2">
            <TbEyeStar className="text-xl" />
            <span>Visite</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <DollarOutlined className="text-3xl text-white" />
              </div>
              <h2 className="text-xl font-bold">Bénéfices</h2>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p>
              <span className="text-gray-200">Journalier:</span>
              <span className="font-bold text-lg ml-2">{dailyProfit} DH</span>
            </p>
            <p>
              <span className="text-gray-200">Hebdomadaire:</span>
              <span className="font-bold text-lg ml-2">{weeklyProfit} DH</span>
            </p>
            <p>
              <span className="text-gray-200">Mensuel:</span>
              <span className="font-bold text-lg ml-2">{monthlyProfit} DH</span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-xl shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <CalendarOutlined className="text-3xl text-white" />
              </div>
              <h2 className="text-xl font-bold">Visites</h2>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p>
              <span className="text-gray-200">Journalier:</span>
              <span className="font-bold text-lg ml-2">{dailyVisits}</span>
            </p>
            <p>
              <span className="text-gray-200">Hebdomadaire:</span>
              <span className="font-bold text-lg ml-2">{weeklyVisits}</span>
            </p>
            <p>
              <span className="text-gray-200">Mensuel:</span>
              <span className="font-bold text-lg ml-2">{monthlyVisits}</span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <UserAddOutlined className="text-3xl text-white" />
              </div>
              <h2 className="text-xl font-bold">Nouveaux Clients</h2>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-lg">
              Total:{" "}
              <span className="font-bold text-2xl ml-2">{dailyVisits}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 ">
        {" "}
        <div className="bg-white shadow rounded-lg p-2 ">
          <h1 className="font-poppins text-center font-bold text-blueColor mb-4">
            Clients à Visiter Avant la Fin du Mois
          </h1>
          <Table
            dataSource={visiteclient}
            columns={columns}
            pagination={{ pageSize: 5 }}
            rowKey={(record) => record.id}
          />
        </div>
        <ResetPanel />
        <div className="bg-white  rounded-lg shadow-lg">
          <ChartComponent />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
