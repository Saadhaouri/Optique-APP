import {
  Input as AntInput,
  Button,
  Modal,
  Pagination,
  Select,
  Table,
  message,
} from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  updateOrder,
} from "../Services/OrderServices";
import { Fournisseur } from "../Types/Fournisseur";
import { Order } from "../Types/OrderTypes";
import Product from "../Types/ProductType";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const OrderPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [supplierList, setSupplierList] = useState<Fournisseur[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Order>({
    defaultValues: {
      fournisseurId: "",

      productIds: [],
      orderDate: "",
      totalAmount: 0,
      status: "",
    },
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5062/Order");

        setOrderList(response.data);
      } catch (error) {
        console.error("There was an error fetching the orders!", error);
      }
    };

    const fetchProducts = async () => {
      axios
        .get("http://localhost:5062/Product")
        .then((response) => {
          setProductList(response.data);
        })
        .catch((error) => {
          console.error(
            "Une erreur s'est produite lors de la récupération des Client !",
            error
          );
        });
    };

    const fetchSuppliers = async () => {
      axios
        .get("http://localhost:5062/Fournisseur")
        .then((response) => {
          setSupplierList(response.data);
        })
        .catch((error) => {
          console.error(
            "Une erreur s'est produite lors de la récupération des Client !",
            error
          );
        });
    };

    fetchOrders();
    fetchProducts();
    fetchSuppliers();
  });

  const handleCreateOrder = async (data: Order) => {
    try {
      await createOrder(data);
      setIsModalVisible(false);
      message.success("Commande ajoutée avec succès");

      reset();
      getAllOrders();
    } catch (error) {
      message.error("Erreur lors de l'ajout de la commande");
      console.error("Failed to create order:", error);
    }
  };

  const handleUpdateOrder = async (data: Order) => {
    try {
      await updateOrder(data.id, data);
      setIsModalVisible(false);
      message.success("Commande mise à jour avec succès");
      getAllOrders();
    } catch (error) {
      message.error("Erreur lors de la mise à jour de la commande");
      console.error("Failed to update order:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      message.success("Commande supprimée avec succès");
    } catch (error) {
      message.error("Erreur lors de la suppression de la commande");
      console.error("Failed to delete order:", error);
    }
  };

  const confirmDelete = (orderId: string) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cette commande?",
      content: "Cette action ne peut pas être annulée.",
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      onOk: () => handleDeleteOrder(orderId),
    });
  };

  const showModal = () => {
    setIsEdit(false);
    reset({
      fournisseurId: "",
      productIds: [],
      orderDate: "",
      totalAmount: 0,
      status: "",
    });
    setIsModalVisible(true);
  };

  const showEditModal = (order: Order) => {
    setIsEdit(true);
    reset(order);
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

  const filteredOrders = orderList.filter((order) =>
    `${order.clientId} ${order.fournisseurId}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // const getClientName = (clientID: string) => {
  //   const client = clientList.find((c) => c.id === clientID);
  //   return client ? `${client.prenom} ${client.nom}` : "Unknown";
  // };

  const getSupplierName = (fournisseurId: string) => {
    const fournisseur = supplierList.find((c) => c.id === fournisseurId);
    return fournisseur ? ` ${fournisseur.nom}` : "Unknown";
  };

  const getProductNames = (productIds: string[]) => {
    const productNames = productIds
      .map((id) => productList.find((product) => product.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    return productNames || "Unknown";
  };

  const columns = [
    {
      title: "Fournisseur",
      dataIndex: "fournisseurId",
      key: "fournisseurId",
      render: (fournisseurId: string) => getSupplierName(fournisseurId),
    },

    {
      title: "Produits",
      dataIndex: "productIds",
      key: "productIds",
      render: (productIds: string[]) => getProductNames(productIds),
    },
    {
      title: "Date de Commande",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (orderDate: string) => new Date(orderDate).toLocaleDateString(),
    },
    { title: "Montant Total", dataIndex: "totalAmount", key: "totalAmount" },
    { title: "Statut", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (record: Order) => (
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
        Gestion des Commandes
      </h2>
      <div className="mb-6 flex justify-between items-center">
        <AntInput
          className="w-1/3 p-2 rounded-md shadow-md"
          placeholder="Recherche par fournisseur ou client"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" icon={<FaPlus />} onClick={showModal}>
          Ajouter une commande
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={currentOrders}
        rowKey="id"
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={filteredOrders.length}
        onChange={(page) => setCurrentPage(page)}
        className="mt-4"
      />
      <Modal
        title={isEdit ? "Modifier la commande" : "Ajouter une commande"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isEdit ? "Mettre à jour" : "Ajouter"}
        cancelText="Annuler"
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit(
            isEdit ? handleUpdateOrder : handleCreateOrder
          )}
        >
          <div className="mb-4">
            <label
              htmlFor="fournisseurId"
              className="block text-sm font-medium text-gray-700"
            >
              Fournisseur
            </label>
            <Controller
              name="fournisseurId"
              control={control}
              rules={{ required: "Le fournisseur est requis" }}
              render={({ field }) => (
                <Select
                  showSearch
                  placeholder=" Fournisseur "
                  optionFilterProp="label"
                  style={{ width: "100%" }}
                  {...field}
                  options={supplierList.map((supplier) => ({
                    value: supplier.id,
                    label: supplier.nom,
                  }))}
                  className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                />
              )}
            />
            {errors.fournisseurId && (
              <span className="text-red-500">
                {errors.fournisseurId.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="productIds"
              className="block text-sm font-medium text-gray-700"
            >
              Produits
            </label>
            <Controller
              name="productIds"
              control={control}
              rules={{ required: "Au moins un produit est requis" }}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  mode="multiple"
                  className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                  placeholder="Sélectionner des produits"
                  onChange={(value) => field.onChange(value)}
                  value={field.value || []}
                  optionFilterProp="label"
                >
                  {productList.map((product) => (
                    <Select.Option
                      key={product.id}
                      value={product.id}
                      label={product.name}
                    >
                      {product.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
            {errors.productIds && (
              <span className="text-red-500">{errors.productIds.message}</span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="orderDate"
              className="block text-sm font-medium text-gray-700"
            >
              Date de Commande
            </label>
            <Controller
              name="orderDate"
              control={control}
              rules={{ required: "La date de commande est requise" }}
              render={({ field }) => <AntInput type="date" {...field} />}
            />
            {errors.orderDate && (
              <span className="text-red-500">{errors.orderDate.message}</span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="totalAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Montant Total
            </label>
            <Controller
              name="totalAmount"
              control={control}
              rules={{ required: "Le montant total est requis" }}
              render={({ field }) => <AntInput type="number" {...field} />}
            />
            {errors.totalAmount && (
              <span className="text-red-500">{errors.totalAmount.message}</span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Statut
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <Select {...field} placeholder="Statut">
                    <Select.Option value="En attente">En attente</Select.Option>
                    <Select.Option value="En cours">En cours</Select.Option>
                    <Select.Option value="Prêt à expédier">
                      Prêt à expédier
                    </Select.Option>
                    <Select.Option value="Expédié">Expédié</Select.Option>
                    <Select.Option value="Livré">Livré</Select.Option>
                    <Select.Option value="Annulé">Annulé</Select.Option>
                    <Select.Option value="Retour demandé">
                      Retour demandé
                    </Select.Option>
                    <Select.Option value="Retour accepté">
                      Retour accepté
                    </Select.Option>
                    <Select.Option value="Retour rejeté">
                      Retour rejeté
                    </Select.Option>
                    <Select.Option value="Échoué">Échoué</Select.Option>
                  </Select>
                  {errors.status && (
                    <p className="text-red-500 text-sm">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrderPage;
