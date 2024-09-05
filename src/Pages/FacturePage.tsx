import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Input as AntInput,
  Select,
  Pagination,
  message,
} from "antd";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePrinter,
} from "react-icons/ai";
import { PDFDownloadLink } from "@react-pdf/renderer";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createFacture,
  updateFacture,
  deleteFacture,
} from "../Services/Factureservice";
import { getVisites } from "../Services/visite";
import { Facture } from "../Types/Facture";
import { Visite } from "../Types/VisiteType";
import axios from "axios";
import FacturePDF from "../PDF/FacturePDF";
import { format } from "date-fns";
import { BsFillFilePlusFill } from "react-icons/bs";

const factureSchema = yup.object().shape({
  id: yup.string(),
  nFacture: yup.string().required("Le numéro de la facture est requis"),
  dateFacture: yup.string().required("La date de la facture est requise"),
  visiteId: yup.string().required("La visite est requise"),
});

const FacturePage: React.FC = () => {
  const [factureList, setFactureList] = useState<Facture[]>([]);
  const [visiteList, setVisiteList] = useState<Visite[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formRef = useRef<HTMLFormElement>(null);
  const {
    control,
    handleSubmit,

    reset,
  } = useForm<Facture>({
    defaultValues: {
      id: "",
      nFacture: "",
      dateFacture: "",
      visiteId: "",
    },
    resolver: yupResolver(factureSchema) as any,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [factureResponse, visiteResponse] = await Promise.all([
          axios.get("http://localhost:5062/Facture"),
          getVisites(),
        ]);
        setFactureList(factureResponse.data || []);
        setVisiteList(visiteResponse.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };

    fetchData();
  }, []);

  const generateFactureNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const formatDateForInput = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleCreateFacture: SubmitHandler<Facture> = async (data) => {
    try {
      await createFacture(data);
      setIsModalVisible(false);
      message.success("Facture ajoutée avec succès");
      reset();
      const response = await axios.get("http://localhost:5062/Facture");
      setFactureList(response.data || []);
    } catch (error) {
      message.error("Erreur lors de l'ajout de la facture");
      console.error("Failed to create facture:", error);
    }
  };

  const handleUpdateFacture: SubmitHandler<Facture> = async (data) => {
    try {
      if (selectedFacture) {
        await updateFacture(selectedFacture.id, data);
        setIsModalVisible(false);
        message.success("Facture mise à jour avec succès");
        const response = await axios.get("http://localhost:5062/Facture");
        setFactureList(response.data || []);
      }
    } catch (error) {
      message.error("Erreur lors de la mise à jour de la facture");
      console.error("Failed to update facture:", error);
    }
  };

  const handleDeleteFacture = async (factureId: string) => {
    try {
      await deleteFacture(factureId);
      message.success("Facture supprimée avec succès");
      const response = await axios.get("http://localhost:5062/Facture");
      setFactureList(response.data || []);
    } catch (error) {
      message.error("Erreur lors de la suppression de la facture");
      console.error("Failed to delete facture:", error);
    }
  };

  const confirmDelete = (factureId: string) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cette facture?",
      content: "Cette action ne peut pas être annulée.",
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      onOk: () => handleDeleteFacture(factureId),
    });
  };

  const handlePrint = (facture: Facture) => {
    const visite = visiteList.find((v) => v.id === facture.visiteId);

    return (
      <PDFDownloadLink
        document={<FacturePDF facture={facture} visite={visite} />}
        fileName={`Facture_${facture.nFacture}.pdf`}
      >
        {({ loading }) =>
          loading ? (
            "Loading document..."
          ) : (
            <AiOutlinePrinter className="text-gray-500 cursor-pointer" />
          )
        }
      </PDFDownloadLink>
    );
  };

  const showModal = () => {
    setIsEdit(false);
    reset({
      nFacture: generateFactureNumber(),
      dateFacture: "",
      visiteId: "",
    });
    setIsModalVisible(true);
  };

  const showEditModal = (facture: Facture) => {
    setIsEdit(true);
    reset({
      ...facture,
      dateFacture: formatDateForInput(facture.dateFacture),
    });
    setSelectedFacture(facture);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Filter factures based on search term (including client name)
  const filteredFactures = factureList.filter((facture) => {
    const visite = visiteList.find((v) => v.id === facture.visiteId);
    const clientName = visite?.fullname || "";
    return (
      facture.nFacture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFactures = filteredFactures.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const columns = [
    { title: "Numéro", dataIndex: "nFacture", key: "nFacture" },
    {
      title: "Date",
      dataIndex: "dateFacture",
      key: "dateFacture",
      render: (text: string) => {
        const formattedDate = format(new Date(text), "dd/MM/yyyy");
        return formattedDate;
      },
    },
    {
      title: "Visite",
      dataIndex: "visiteId",
      key: "visiteId",
      render: (text: string) => {
        const visite = visiteList.find((v) => v.id === text);
        return visite?.fullname;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Facture) => (
        <div className="flex items-center justify-evenly">
          <AiOutlineEdit
            className="text-blue-500 cursor-pointer"
            onClick={() => showEditModal(record)}
          />
          <AiOutlineDelete
            className="text-red-500 cursor-pointer"
            onClick={() => confirmDelete(record.id)}
          />
          {handlePrint(record)}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Gestion des Factures
      </h1>

      <div className="  flex justify-between  items-center">
        <AntInput.Search
          placeholder="Rechercher par numéro ou nom du client"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ margin: "20px 0", width: "300px" }}
        />{" "}
        <Button
          type="primary"
          icon={<BsFillFilePlusFill />}
          onClick={showModal}
        >
          Ajouter une facture
        </Button>
      </div>
      <Table
        dataSource={currentFactures}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={filteredFactures.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 20 }}
      />
      <Modal
        title={isEdit ? "Modifier Facture" : "Ajouter Facture"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Annuler
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {isEdit ? "Mettre à jour" : "Ajouter"}
          </Button>,
        ]}
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit(
            isEdit ? handleUpdateFacture : handleCreateFacture
          )}
        >
          <Controller
            name="nFacture"
            control={control}
            render={({ field }) => (
              <AntInput
                {...field}
                disabled={isEdit}
                placeholder="Numéro de facture"
                style={{ marginBottom: 16 }}
              />
            )}
          />
          <Controller
            name="dateFacture"
            control={control}
            render={({ field }) => (
              <AntInput
                type="date"
                {...field}
                placeholder="Date de facture"
                style={{ marginBottom: 16 }}
              />
            )}
          />
          <Controller
            name="visiteId"
            control={control}
            render={({ field }) => (
              <Select
                showSearch
                placeholder="Sélectionner une visite"
                optionFilterProp="label"
                style={{ width: "100%", marginBottom: 16 }}
                {...field}
                options={visiteList.map((visite) => ({
                  value: visite.id,
                  label: visite.fullname,
                }))}
                className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
              />
            )}
          />
        </form>
      </Modal>
    </div>
  );
};

export default FacturePage;
