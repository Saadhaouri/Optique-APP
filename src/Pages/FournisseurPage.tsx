import { yupResolver } from "@hookform/resolvers/yup";
import {
  Modal,
  message,
  Input as AntInput,
  Button,
  Table,
  Pagination,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { FaPlus } from "react-icons/fa";
import {
  createFournisseur,
  updateFournisseur,
  deleteFournisseur,
  getFournisseurs,
} from "../Services/FournisseurServices";
import { Fournisseur } from "../Types/Fournisseur";
import axios from "axios";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

// Validation schema for the fournisseur form
const fournisseurSchema = yup.object().shape({
  id: yup.string(),
  nom: yup.string().required("Le nom est requis"),
  adresse: yup.string().required("L'adresse est requise"),
  telephone: yup.string().required("Le téléphone est requis"),
});

const FournisseurPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [fournisseurList, setFournisseurList] = useState<Fournisseur[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Fournisseur>({
    defaultValues: {
      id: "",
      nom: "",
      adresse: "",
      telephone: "",
    },
    resolver: yupResolver(fournisseurSchema) as any,
  });

  useEffect(() => {
    const fetchFournisseurs = async () => {
      axios
        .get("http://localhost:5062/Fournisseur")
        .then((response) => {
          setFournisseurList(response.data);
        })
        .catch((error) => {
          console.error(
            "Une erreur s'est produite lors de la récupération des catégories !",
            error
          );
        });
    };

    fetchFournisseurs();
  }, [fournisseurList]);

  const handleCreateFournisseur: SubmitHandler<Fournisseur> = async (data) => {
    try {
      await createFournisseur(data);
      setIsModalVisible(false);
      message.success("Fournisseur ajouté avec succès");
      reset();
      const response = await getFournisseurs();
      setFournisseurList(response.data || []);
    } catch (error) {
      message.error("Erreur lors de l'ajout du fournisseur");
      console.error("Failed to create fournisseur:", error);
    }
  };

  const handleUpdateFournisseur: SubmitHandler<Fournisseur> = async (data) => {
    try {
      await updateFournisseur(data.id, data);
      setIsModalVisible(false);
      message.success("Fournisseur mis à jour avec succès");
      const response = await getFournisseurs();
      setFournisseurList(response.data || []);
    } catch (error) {
      message.error("Erreur lors de la mise à jour du fournisseur");
      console.error("Failed to update fournisseur:", error);
    }
  };

  const handleDeleteFournisseur = async (fournisseurId: string) => {
    try {
      await deleteFournisseur(fournisseurId);
      message.success("Fournisseur supprimé avec succès");
      const response = await getFournisseurs();
      setFournisseurList(response.data || []);
    } catch (error) {
      message.error("Erreur lors de la suppression du fournisseur");
      console.error("Failed to delete fournisseur:", error);
    }
  };

  const confirmDelete = (fournisseurId: string) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer ce fournisseur?",
      content: "Cette action ne peut pas être annulée.",
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      onOk: () => handleDeleteFournisseur(fournisseurId),
    });
  };

  const showModal = () => {
    setIsEdit(false);
    reset({
      nom: "",
      adresse: "",
      telephone: "",
    });
    setIsModalVisible(true);
  };

  const showEditModal = (fournisseur: Fournisseur) => {
    setIsEdit(true);
    reset(fournisseur);
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

  const filteredFournisseurs = fournisseurList.filter((fournisseur) =>
    fournisseur.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFournisseurs = filteredFournisseurs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const columns = [
    { title: "Nom", dataIndex: "nom", key: "nom" },
    { title: "Adresse", dataIndex: "adresse", key: "adresse" },
    { title: "Téléphone", dataIndex: "telephone", key: "telephone" },

    {
      title: "Actions",
      key: "actions",
      render: (record: Fournisseur) => (
        <div className=" flex items-center justify-evenly">
          <AiOutlineEdit
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={() => showEditModal(record)}
          />
          <AiOutlineDelete
            className="cursor-pointer text-red-500 hover:text-red-700 ml-2"
            onClick={() => confirmDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Gestion des Fournisseurs
      </h2>
      <div className="mb-4 flex justify-between">
        <AntInput
          placeholder="Recherche par nom"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" icon={<FaPlus />} onClick={showModal}>
          Ajouter un fournisseur
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={currentFournisseurs}
        rowKey="id"
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={filteredFournisseurs.length}
        onChange={(page) => setCurrentPage(page)}
        className="mt-4"
      />
      <Modal
        title={isEdit ? "Modifier Fournisseur" : "Ajouter Fournisseur"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEdit ? "Mettre à jour" : "Créer"}
        cancelText="Annuler"
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit(
            isEdit ? handleUpdateFournisseur : handleCreateFournisseur
          )}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <Controller
                control={control}
                name="nom"
                render={({ field }) => <AntInput {...field} />}
              />
              <p className="text-red-600">{errors.nom?.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <Controller
                control={control}
                name="adresse"
                render={({ field }) => <AntInput {...field} />}
              />
              <p className="text-red-600">{errors.adresse?.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <Controller
                control={control}
                name="telephone"
                render={({ field }) => <AntInput {...field} />}
              />
              <p className="text-red-600">{errors.telephone?.message}</p>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FournisseurPage;
