import { yupResolver } from "@hookform/resolvers/yup";
import {
  Modal,
  message,
  Select,
  Input as AntInput,
  Button,
  Table,
  Pagination,
} from "antd";
// import axios from "axios";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { FaEye, FaPlus } from "react-icons/fa";
import {
  createVisite,
  updateVisite,
  deleteVisite,
  getVisites,
} from "../Services/visite";
import VisitCard from "../Components/VisitCard";

const visiteSchema = yup.object({
  fullname: yup.string().required("Le nom complet du client est requis"), // Updated field
  telephone: yup.string().required("Le numéro de téléphone est requis"), // Updated field
  dateVisite: yup.date().required("La date de visite est requise"),

  oD_Sphere: yup.string().required("La sphère OD est requise"),
  oD_Cylinder: yup.string().required("Le cylindre OD est requis"),
  oD_Axis: yup.number().required("L'axe OD est requis"),

  oS_Sphere: yup.string().required("La sphère OS est requise"),
  oS_Cylinder: yup.string().required("Le cylindre OS est requis"),
  oS_Axis: yup.number().required("L'axe OS est requis"),

  add: yup.number().required("L'addition est requise"),
  pd: yup.string().required("Le PD est requis"),

  verreOD: yup.string().required("Le verre OD est requis"), // Verre for the right eye
  verreOS: yup.string().required("Le verre OS est requis"), // Verre for the left eye

  priceOD: yup.number().required("Le prix OD est requis"), // Price for the right eye
  priceOS: yup.number().required("Le prix OS est requis"), // Price for the left eye

  prixmonture: yup.number().required("Le prix de la monture est requis"), // Added field

  total: yup.number().required("Le total est requis"),
  avance: yup.number().required("L'avance est requise"),
  reste: yup.number().required("Le reste est requis"),
  remise: yup.number(), // Remise is no longer required, but can still be provided

  doctor: yup.string(), // Optional field for the doctor's name
});

type VisiteBase = {
  fullname: string; // Full name of the client
  telephone: string; // Telephone number of the client
  dateVisite: string; // Date of the visit

  oD_Sphere: string; // Right eye sphere
  oD_Cylinder: string; // Right eye cylinder
  oD_Axis: number; // Right eye axis

  oS_Sphere: string; // Left eye sphere
  oS_Cylinder: string; // Left eye cylinder
  oS_Axis: number; // Left eye axis

  add: number; // Addition
  pd: string; // Pupillary distance

  verreOD: string; // Verre for the right eye
  verreOS: string; // Verre for the left eye

  priceOD: number; // Price for the right eye
  priceOS: number; // Price for the left eye

  prixmonture: number; // Price for the frame

  total: number; // Total amount
  avance: number; // Advance payment
  reste: number; // Remaining balance

  remise: number; // Discount
  doctor: string; // Name of the doctor
};

type Visite = VisiteBase & {
  id: string;
};

type AddVisite = VisiteBase;

const VisiteManagementPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [visiteList, setVisiteList] = useState<Visite[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visite | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Visite>({
    defaultValues: {
      fullname: "", // Full name of the client
      telephone: "", // Telephone number of the client
      dateVisite: "", // Date of the visit

      oD_Sphere: "", // Right eye sphere
      oD_Cylinder: "", // Right eye cylinder
      oD_Axis: 0, // Right eye axis

      oS_Sphere: "", // Left eye sphere
      oS_Cylinder: "", // Left eye cylinder
      oS_Axis: 0, // Left eye axis

      add: 0, // Addition
      pd: "", // Pupillary distance

      verreOD: "", // Verre for the right eye
      verreOS: "", // Verre for the left eye

      priceOD: 0, // Price for the right eye
      priceOS: 0, // Price for the left eye

      prixmonture: 0, // Price for the frame

      total: 0, // Total amount
      avance: 0, // Advance payment
      reste: 0, // Remaining balance

      remise: 0, // Discount
      doctor: "", // Name of the doctor
    },
    resolver: yupResolver(visiteSchema) as any,
  });

  useEffect(() => {
    const fetchVisites = async () => {
      try {
        const [visitesResponse] = await Promise.all([getVisites()]);
        setVisiteList(visitesResponse.data);
      } catch (error) {
        console.error(
          "There was an error fetching the visites or clients!",
          error
        );
      }
    };

    fetchVisites();
  }, []);

  const handleCreateVisite: SubmitHandler<AddVisite> = async (data) => {
    try {
      await createVisite(data);
      setIsModalVisible(false);
      message.success("Visite ajoutée avec succès");
      reset();
      const visitesResponse = await getVisites();
      setVisiteList(visitesResponse.data);
    } catch (error) {
      message.error("Erreur lors de l'ajout de la visite");
      console.error("Failed to create visite:", error);
    }
  };

  const handleUpdateVisite: SubmitHandler<Visite> = async (data) => {
    try {
      console.log(data.id, data);
      await updateVisite(data.id, data);
      setIsModalVisible(false);
      message.success("Visite mise à jour avec succès");
      const visitesResponse = await getVisites();
      setVisiteList(visitesResponse.data);
    } catch (error) {
      message.error("Erreur lors de la mise à jour de la visite");
      console.error("Failed to update visite:", error);
    }
  };

  const handleDeleteVisite = async (visiteId: string) => {
    try {
      await deleteVisite(visiteId);
      message.success("Visite supprimée avec succès");
      const visitesResponse = await getVisites();
      setVisiteList(visitesResponse.data);
    } catch (error) {
      message.error("Erreur lors de la suppression de la visite");
      console.error("Failed to delete visite:", error);
    }
  };

  const confirmDelete = (visiteId: string) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cette visite?",
      content: "Cette action ne peut pas être annulée.",
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      onOk: () => handleDeleteVisite(visiteId),
    });
  };

  // Define the types of lenses
  const lensTypes = [
    "Organique Blanc 1.5",
    "Organique Blanc 1.56",
    "Organique Anti-reflet 1.56",
    "Organique Anti-reflet 1.61",
    "Organique Anti-reflet 1.67",
    "Organique Anti-reflet 1.74",
    "Organique Anti-reflet Bleu 1.56",
    "Organique Anti-reflet Bleu 1.61",
    "Organique Anti-reflet Bleu 1.67",
    "Organique Anti-reflet Bleu 1.74",
    "Minéral Blanc",
    "Fort Indice 1.7",
    "Fort Indice Anti-reflet 1.7",
    "Fort Indice Anti-reflet 1.8",
    "Fort Indice Anti-reflet 1.9",
    "Minéral PHG",
    "Minéral PHB",
    "Minéral PHB Anti-reflet",
    "Minéral PHG Anti-reflet",
    "Progressif Or Blanc",
    "Progressif Or Anti-reflet 1.56",
    "Progressif Or Bleu 1.5",
    "Progressif Or Anti-reflet 1.6",
    "Progressif Or Bleu 1.6",
    "Progressif Or PHG AR",
    "Progressif Or PHB AR",
    "Organique PHB Anti-reflet",
    "Organique PHG Anti-reflet",
    "Organique PHB Anti-reflet Bleu",
    "Organique PHG Anti-reflet Bleu",
  ];

  const showModal = () => {
    setIsEdit(false);
    reset({
      fullname: "", // Updated field
      telephone: "", // Updated field
      dateVisite: new Date().toISOString().split("T")[0],

      oD_Sphere: "",
      oD_Cylinder: "",
      oD_Axis: 0,

      oS_Sphere: "",
      oS_Cylinder: "",
      oS_Axis: 0,

      add: 0,
      pd: "",

      verreOD: "", // Verre for the right eye
      verreOS: "", // Verre for the left eye

      priceOD: 0, // Price for the right eye
      priceOS: 0, // Price for the left eye

      prixmonture: 0, // Added field for the frame price

      total: 0,
      avance: 0,
      reste: 0,

      remise: 0,
      doctor: "",
    });

    setIsModalVisible(true);
  };

  const showEditModal = (visite: Visite) => {
    setIsEdit(true);
    reset({
      ...visite,
      dateVisite: new Date(visite.dateVisite).toISOString().split("T")[0],
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleVisitClick = (visit: Visite) => {
    setSelectedVisit(visit);
    setShowDetailsModal(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedVisit(null);
  };

  const filteredVisites = visiteList.filter((visite) =>
    visite.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVisites = filteredVisites.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const columns = [
    {
      title: "Client",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Client",
      dataIndex: "telephone",
      key: "telephone",
    },
    {
      title: "Date Visite",
      dataIndex: "dateVisite",
      key: "dateVisite",
      render: (dateVisite: string) => new Date(dateVisite).toLocaleDateString(),
    },

    { title: "Total", dataIndex: "total", key: "total" },
    { title: "Avance", dataIndex: "avance", key: "avance" },
    { title: "Reste", dataIndex: "reste", key: "reste" },
    { title: "Remise", dataIndex: "remise", key: "remise" },

    { title: "Médecin", dataIndex: "doctor", key: "doctor" },
    {
      title: "Actions",
      key: "actions",
      render: (record: Visite) => (
        <div className="flex items-center justify-evenly">
          <FaEye
            className="cursor-pointer text-green-500 hover:text-green-700"
            onClick={() => handleVisitClick(record)}
          />
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
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Gestion des Client
      </h1>

      <div className="mb-4 flex justify-between">
        <AntInput
          className="p-2 rounded-md shadow-md"
          placeholder="Recherche par client"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
        <div className="">
          <Button
            type="primary"
            icon={<FaPlus />}
            onClick={showModal}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md shadow-md"
          >
            Ajouter une visite
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={currentVisites}
        rowKey="id"
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={filteredVisites.length}
        onChange={(page) => setCurrentPage(page)}
        className="mt-4"
      />
      <Modal
        title={isEdit ? "Modifier Visite" : "Ajouter Visite"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEdit ? "Mettre à jour" : "Créer"}
        cancelText="Annuler"
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit(
            isEdit ? handleUpdateVisite : handleCreateVisite
          )}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <Controller
                control={control}
                name="fullname"
                render={({ field }) => <AntInput {...field} />}
              />
              <p className="text-red-600">{errors.fullname?.message}</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date Visite
              </label>
              <Controller
                control={control}
                name="dateVisite"
                render={({ field }) => <AntInput type="date" {...field} />}
              />
              <p className="text-red-600">{errors.dateVisite?.message}</p>
            </div>

            {/* OD (Right Eye) fields in one line */}
            <div className="col-span-2 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OD Sphere
                </label>
                <Controller
                  control={control}
                  name="oD_Sphere"
                  render={({ field }) => (
                    <AntInput
                      type="text" // Use text input as we're handling value formatting
                      {...field}
                      value={field.value === "0" ? "" : field.value} // Hide zero values
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
                <p className="text-red-600">{errors.oD_Sphere?.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OD Cylinder
                </label>
                <Controller
                  control={control}
                  name="oD_Cylinder"
                  render={({ field }) => (
                    <AntInput
                      type="text" // Use text input as we're handling value formatting
                      {...field}
                      value={field.value === "0" ? "" : field.value} // Hide zero values
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
                <p className="text-red-600">{errors.oD_Cylinder?.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OD Axis
                </label>
                <Controller
                  control={control}
                  name="oD_Axis"
                  render={({ field }) => (
                    <AntInput
                      type="number"
                      {...field}
                      value={field.value === 0 ? "" : field.value} // Hide zero values
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                <p className="text-red-600">{errors.oD_Axis?.message}</p>
              </div>
            </div>

            {/* OS (Left Eye) fields in one line */}
            <div className="col-span-2 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OS Sphere
                </label>
                <Controller
                  control={control}
                  name="oS_Sphere"
                  render={({ field }) => (
                    <AntInput
                      type="text" // Use text input as we're handling value formatting
                      {...field}
                      value={field.value === "0" ? "" : field.value} // Hide zero values
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
                <p className="text-red-600">{errors.oS_Sphere?.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OS Cylinder
                </label>
                <Controller
                  control={control}
                  name="oS_Cylinder"
                  render={({ field }) => (
                    <AntInput
                      type="text" // Use text input as we're handling value formatting
                      {...field}
                      value={field.value === "0" ? "" : field.value} // Hide zero values
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
                <p className="text-red-600">{errors.oS_Cylinder?.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OS Axis
                </label>
                <Controller
                  control={control}
                  name="oS_Axis"
                  render={({ field }) => (
                    <AntInput
                      type="number"
                      {...field}
                      value={field.value === 0 ? "" : field.value} // Hide zero values
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                <p className="text-red-600">{errors.oS_Axis?.message}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Addition
              </label>
              <Controller
                control={control}
                name="add"
                render={({ field }) => (
                  <AntInput
                    type="number"
                    {...field}
                    value={field.value === 0 ? "" : field.value} // Hide zero values
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <p className="text-red-600">{errors.add?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                PD
              </label>
              <Controller
                control={control}
                name="pd"
                render={({ field }) => <AntInput type="text" {...field} />}
              />
              <p className="text-red-600">{errors.pd?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Verre de Loin
              </label>
              <Controller
                control={control}
                name="verreOD"
                render={({ field }) => (
                  <Select
                    showSearch
                    placeholder="Sélectionner un type de verre pour OD"
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    {...field}
                    options={lensTypes.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                  />
                )}
              />
              <p className="text-red-600">{errors.verreOD?.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Verre de Pres
              </label>
              <Controller
                control={control}
                name="verreOS"
                render={({ field }) => (
                  <Select
                    showSearch
                    placeholder="Sélectionner un type de verre pour OD"
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    {...field}
                    options={lensTypes.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                  />
                )}
              />
              <p className="text-red-600">{errors.verreOS?.message}</p>
            </div>

            {/* Price fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prix de VL
              </label>
              <Controller
                control={control}
                name="priceOD"
                render={({ field }) => (
                  <AntInput
                    type="number"
                    {...field}
                    value={field.value === 0 ? "" : field.value} // Hide zero values
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <p className="text-red-600">{errors.priceOD?.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prix de VP
              </label>
              <Controller
                control={control}
                name="priceOS"
                render={({ field }) => (
                  <AntInput
                    type="number"
                    {...field}
                    value={field.value === 0 ? "" : field.value} // Hide zero values
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <p className="text-red-600">{errors.priceOS?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prix de Monture
              </label>
              <Controller
                control={control}
                name="prixmonture"
                render={({ field }) => (
                  <AntInput
                    type="number"
                    {...field}
                    value={field.value === 0 ? "" : field.value} // Hide zero values
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <p className="text-red-600">{errors.prixmonture?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total
              </label>
              <Controller
                control={control}
                name="total"
                render={({ field }) => (
                  <AntInput
                    type="number"
                    {...field}
                    value={field.value === 0 ? "" : field.value} // Hide zero values
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <p className="text-red-600">{errors.total?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Avance
              </label>
              <Controller
                control={control}
                name="avance"
                render={({ field }) => (
                  <AntInput
                    type="number"
                    {...field}
                    value={field.value === 0 ? "" : field.value} // Hide zero values
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <p className="text-red-600">{errors.avance?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reste
              </label>
              <Controller
                control={control}
                name="reste"
                render={({ field }) => (
                  <AntInput
                    type="number"
                    {...field}
                    value={field.value === 0 ? "" : field.value} // Hide zero values
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <p className="text-red-600">{errors.reste?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Remise
              </label>
              <Controller
                control={control}
                name="remise"
                render={({ field }) => (
                  <AntInput
                    type="number"
                    {...field}
                    value={field.value === 0 ? "" : field.value} // Hide zero values
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              <p className="text-red-600">{errors.remise?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Médecin
              </label>
              <Controller
                control={control}
                name="doctor"
                render={({ field }) => <AntInput {...field} />}
              />
              <p className="text-red-600">{errors.doctor?.message}</p>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        title={`Détails de la Visite`}
        open={showDetailsModal}
        onCancel={handleCloseDetailsModal}
        footer={null}
        width={800} // Set the desired width here
      >
        {selectedVisit ? (
          <VisitCard visit={selectedVisit} onClose={handleCloseDetailsModal} />
        ) : (
          <p>Chargement des détails de la visite...</p>
        )}
      </Modal>
    </div>
  );
};

export default VisiteManagementPage;
