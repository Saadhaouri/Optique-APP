import { Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Client } from "../Types/Client";
import { Visite } from "../Types/VisiteType";

// Define the type for each row of the table
interface VisiteData {
  key: string;
  clientName: string;
  rest: number;
}

const ResetPanel = () => {
  const [data, setData] = useState<VisiteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientList, setClientList] = useState<Client[]>([]);

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5062/Client");
        setClientList(response.data);
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la récupération des clients!",
          error
        );
      }
    };
    fetchClients();
  }, []);

  // const getClientName = (clientID: string) => {
  //   const client = clientList.find((c) => c.id === clientID);
  //   return client ? `${client.prenom} ${client.nom}` : "Inconnu";
  // };

  const columns = [
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Rest of Total Money",
      dataIndex: "rest",
      key: "rest",
      render: (text: number) => `${text} MAD`, // Add currency formatting
    },
  ];

  useEffect(() => {
    const fetchVisites = async () => {
      try {
        const response = await axios.get("http://localhost:5062/Visite");
        const visites = response.data;

        // Filter visits where reste != 0
        const filteredVisites = visites.filter(
          (visite: Visite) => visite.reste !== 0
        );

        // Map the response to the required data format
        const visitesData = filteredVisites.map((visite: Visite) => ({
          key: visite.id,
          clientName: visite.fullname, // Use clientId to lookup the client name
          rest: visite.reste,
        }));

        setData(visitesData);

        console.log(visitesData.value);
      } catch (error) {
        message.error("Failed to fetch visit data.");
      } finally {
        setLoading(false);
      }
    };

    fetchVisites();
  }, [clientList]);

  return (
    <div className="p-2 bg-white rounded-md shadow ">
      <h1 className="font-poppins text-center font-bold text-blueColor mb-4">
        Clients qui ont des dettes
      </h1>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ResetPanel;
