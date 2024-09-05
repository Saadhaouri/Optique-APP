import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, message, Button, Input, Select, Table } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../Services/Productservices";
import { Category } from "../Types/Category";
import { FaPlus } from "react-icons/fa";
import { Fournisseur } from "../Types/Fournisseur";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const { Option } = Select;
const { Search } = Input;

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  priceForSale: number;
  quantity: number;
  categoryID: string;
  fournisseurId: string;

  // Include other properties if necessary
};

const productSchema = yup.object({
  id: yup.string(),
  name: yup.string().required("Le nom est requis"),
  description: yup.string().required("La description est requise"),
  price: yup.number().required("Le prix est requis"),
  priceForSale: yup.number().required("Le prix de vente est requis"),
  quantity: yup.number().required("La quantité est requise"),
  categoryID: yup.string().required("La catégorie est requise"),
  fournisseurId: yup.string().required("Le fournisseur est requis"),
});

const ProductPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [productList, setProductList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [supplierList, setSupplierList] = useState<Fournisseur[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Product>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      priceForSale: 0,
      quantity: 0,
      categoryID: "",
      fournisseurId: "",
    },
    resolver: yupResolver(productSchema) as any,
  });

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [productsResponse, categoriesResponse, supplierResponse] =
          await Promise.all([
            axios.get("http://localhost:5062/Product"),
            axios.get("http://localhost:5062/Category"),
            axios.get("http://localhost:5062/Fournisseur"),
          ]);
        setProductList(productsResponse.data);
        setCategories(categoriesResponse.data);
        setSupplierList(supplierResponse.data);
      } catch (error) {
        console.error(
          "There was an error fetching the products or categories!",
          error
        );
      }
    };

    fetchProductsAndCategories();
  }, []);

  const handleCreateProduct: SubmitHandler<Product> = async (data) => {
    try {
      await createProduct(data);
      setIsModalVisible(false);
      message.success("Produit ajouté avec succès");
      reset();
      const productsResponse = await axios.get("http://localhost:5062/Product");
      setProductList(productsResponse.data);
    } catch (error) {
      message.error("Erreur lors de l'ajout du produit");
      console.error("Failed to create produit:", error);
    }
  };

  const handleUpdateProduct: SubmitHandler<Product> = async (data) => {
    try {
      await updateProduct(data.id, data);
      setIsModalVisible(false);
      message.success("Produit mis à jour avec succès");
      const productsResponse = await axios.get("http://localhost:5062/Product");
      setProductList(productsResponse.data);
    } catch (error) {
      message.error("Erreur lors de la mise à jour du produit");
      console.error("Failed to update product:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      message.success("Produit supprimé avec succès");
      const productsResponse = await axios.get("http://localhost:5062/Product");
      setProductList(productsResponse.data);
    } catch (error) {
      message.error("Erreur lors de la suppression du produit");
      console.error("Failed to delete produit:", error);
    }
  };

  const confirmDelete = (productId: string) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer ce produit?",
      content: "Cette action ne peut pas être annulée.",
      okText: "Oui",
      okType: "danger",
      cancelText: "Non",
      onOk: () => handleDeleteProduct(productId),
    });
  };

  const showModal = () => {
    setIsEdit(false);
    reset({
      name: "",
      description: "",
      price: 0,
      priceForSale: 0,
      quantity: 0,
      categoryID: "",
      fournisseurId: "",
    });
    setIsModalVisible(true);
  };

  const showEditModal = (product: Product) => {
    setIsEdit(true);
    reset({
      ...product,
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

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getSupplierName = (supplierId: string) => {
    const supplier = supplierList.find((s) => s.id === supplierId);
    return supplier ? supplier.nom : "Unknown";
  };

  const columns = [
    { title: "Nom", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Prix", dataIndex: "price", key: "price" },
    { title: "Prix de vente", dataIndex: "priceForSale", key: "priceForSale" },
    { title: "Quantité", dataIndex: "quantity", key: "quantity" },
    {
      title: "Fournisseur",
      dataIndex: "fournisseurId",
      key: "fournisseurId",
      render: (text: string) => getSupplierName(text),
    },
    {
      title: "Action",
      key: "action",
      render: (record: Product) => (
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

  // Calculate statistics
  const productCount = productList.length;
  const totalQuantity = productList.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
  const highQuantityProducts = productList.filter(
    (product) => product.quantity > 60
  ).length;
  const highPriceProducts = productList.filter(
    (product) => product.price > 100
  ).length;

  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen overflow-y-auto p-4 ">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Gestion des Produits
      </h2>
      <div className="flex items-center justify-between p-2">
        <div className="pl-4 text-left">
          <h1 className="text-1xl font-bold  p-2 rounded shadow-md"></h1>
        </div>
        <div className="flex items-center justify-end p-4 mx-3">
          <Button onClick={showModal} type="primary" icon={<FaPlus />}>
            Ajouter un produit
          </Button>
        </div>
      </div>
      <div className="mx-4 mb-3">
        <Search
          placeholder="Rechercher un produit"
          enterButton
          onSearch={(value) => setSearchQuery(value)}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mr-4 ml-4 mb-3">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-blue-400">
            Nombre de produits
          </h2>
          <p className="text-2xl text-blue-700 font-bold flex justify-center">
            {productCount}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-blue-400">
            Quantité totale
          </h2>
          <p className="text-2xl text-blue-700 font-bold flex justify-center">
            {totalQuantity}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md border-1 border-blue-700">
          <h2 className="text-lg font-semibold text-blue-400">
            Produits avec plus de 60 unités
          </h2>
          <p className="text-2xl text-blue-700 font-bold flex justify-center">
            {highQuantityProducts}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-blue-400">
            Produits avec un prix supérieur à 100 DH
          </h2>
          <p className="text-2xl text-blue-700 font-bold flex justify-center">
            {highPriceProducts}
          </p>
        </div>
      </div>
      <div className="p-4">
        <Table columns={columns} dataSource={filteredProducts} rowKey="id" />
      </div>
      <Modal
        title={isEdit ? "Modifier un produit" : "Ajouter un produit"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit(
            isEdit ? handleUpdateProduct : handleCreateProduct
          )}
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nom
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                  status={errors.name ? "error" : ""}
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  id="description"
                  className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                  status={errors.description ? "error" : ""}
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Prix
            </label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  id="price"
                  className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                  status={errors.price ? "error" : ""}
                />
              )}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="priceForSale"
              className="block text-sm font-medium text-gray-700"
            >
              Prix de vente
            </label>
            <Controller
              name="priceForSale"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  id="priceForSale"
                  className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                  status={errors.priceForSale ? "error" : ""}
                />
              )}
            />
            {errors.priceForSale && (
              <p className="text-red-500 text-xs mt-1">
                {errors.priceForSale.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantité
            </label>
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  id="quantity"
                  className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                  status={errors.quantity ? "error" : ""}
                />
              )}
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="categoryID"
              className="block text-sm font-medium text-gray-700"
            >
              Catégorie
            </label>
            <Controller
              name="categoryID"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="categoryID"
                  className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                  status={errors.categoryID ? "error" : ""}
                >
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              )}
            />
            {errors.categoryID && (
              <p className="text-red-500 text-xs mt-1">
                {errors.categoryID.message}
              </p>
            )}
          </div>
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
              render={({ field }) => (
                <Select
                  {...field}
                  id="fournisseurId"
                  className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                  status={errors.fournisseurId ? "error" : ""}
                >
                  {supplierList.map((fournisseur) => (
                    <Option key={fournisseur.id} value={fournisseur.id}>
                      {fournisseur.nom}
                    </Option>
                  ))}
                </Select>
              )}
            />
            {errors.fournisseurId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fournisseurId.message}
              </p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductPage;
