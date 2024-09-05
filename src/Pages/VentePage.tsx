import React, { useEffect, useState } from "react";
import { Input, message, Modal, Table, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import {
  FaCalendarAlt,
  FaCalendarDay,
  FaCalendarWeek,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import {
  createVente,
  deleteAllSales,
  getAllVentes,
  getDailySales,
  getMonthlySales,
  getTotalDailyProfit,
  getTotalMonthlyProfit,
  getTotalWeeklyProfit,
  getWeeklySales,
} from "../Services/VenteServices";
import { getAllProducts } from "../Services/Productservices";

interface Vente {
  productId: string;
  quantity: number;
  saleDate: string;
  id: string;
  price: number;
  profit: number;
}

interface Product {
  id: string;
  name: string;
}

const VentePage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [dailySales, setDailySales] = useState<Vente[]>([]);
  const [weeklySales, setWeeklySales] = useState<Vente[]>([]);
  const [monthlySales, setMonthlySales] = useState<Vente[]>([]);
  const [allSales, setAllSales] = useState<Vente[]>([]);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [weeklyProfit, setWeeklyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Vente>();

  useEffect(() => {
    fetchSalesData();
    fetchProfitData();
    fetchProducts();
  }, []);

  const fetchSalesData = async () => {
    try {
      const [daily, weekly, monthly, all] = await Promise.all([
        getDailySales(),
        getWeeklySales(),
        getMonthlySales(),
        getAllVentes(),
      ]);
      setDailySales(daily);
      setWeeklySales(weekly);
      setMonthlySales(monthly);
      setAllSales(all);
    } catch (error) {
      message.error("Erreur lors de la récupération des ventes");
    }
  };

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

  const fetchProducts = async () => {
    try {
      const products = await getAllProducts();
      setProducts(products);
    } catch (error) {
      message.error("Erreur lors de la récupération des produits");
    }
  };

  const onSubmit = async (data: Vente) => {
    try {
      await createVente(data);
      message.success("Vente ajoutée avec succès");
      setIsModalVisible(false);
      reset();
      fetchSalesData();
      fetchProfitData();
    } catch (error) {
      message.error("Erreur lors de l'ajout de la vente");
    }
  };

  const handleDeleteAllSales = async () => {
    try {
      await deleteAllSales();
      message.success("Toutes les ventes ont été supprimées");
      setIsDeleteModalVisible(false);
      fetchSalesData();
    } catch (error) {
      message.error("Erreur lors de la suppression des ventes");
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find((c) => c.id === productId);
    return product ? `${product.name}` : "Unknown";
  };
  const columns = [
    {
      title: "Produit",
      dataIndex: "productId",
      key: "productId",
      render: (productId: string) => getProductName(productId),
    },
    {
      title: "Quantité",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Prix",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Bénéfices",
      dataIndex: "profit",
      key: "profit",
    },
    {
      title: "Date",
      dataIndex: "venteDate",
      key: "venteDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Gestion des Ventes
      </h2>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold"></h1>
        <div className="space-x-4 flex items-center justify-evenly">
          <button
            onClick={() => setIsModalVisible(true)}
            className="bg-blue-500 text-white px-4 py-1 rounded-md shadow hover:bg-blue-600 flex items-center"
          >
            <FaPlus className="mr-2" /> Ajouter Vente
          </button>
          <button
            onClick={() => setIsDeleteModalVisible(true)}
            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 flex items-center"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Ventes Quotidiennes</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">{dailySales.length}</p>
              <p>Bénéfices: {dailyProfit} DH</p>
            </div>
            <FaCalendarDay className="text-4xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Ventes Hebdomadaires</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">{weeklySales.length}</p>
              <p>Bénéfices: {weeklyProfit} DH</p>
            </div>
            <FaCalendarWeek className="text-4xl text-purple-500" />
          </div>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Ventes Mensuelles</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">{monthlySales.length}</p>
              <p>Bénéfices: {monthlyProfit} DH</p>
            </div>
            <FaCalendarAlt className="text-4xl text-green-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-6 gap-4 p-4">
        <div className="bg-white p-4 shadow rounded-lg lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Ventes Hebdomadaires</h2>
          <div className="overflow-x-auto">
            <Table
              className="min-w-full"
              columns={columns}
              dataSource={weeklySales}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded-lg lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Ventes Quotidiennes</h2>
          <div className="overflow-x-auto">
            <Table
              className="min-w-full"
              columns={columns}
              dataSource={dailySales}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Ventes Mensuelles</h2>
          <div className="overflow-x-auto">
            <Table
              className="min-w-full"
              columns={columns}
              dataSource={monthlySales}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-6 bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-bold mb-4">Toutes les Ventes</h2>
          <div className="overflow-x-auto">
            <Table
              className="min-w-full"
              columns={columns}
              dataSource={allSales}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </div>
        </div>
      </div>

      <Modal
        title="Ajouter Vente"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="productId"
              className="block text-sm font-medium text-gray-700"
            >
              Product
            </label>
            <Controller
              name="productId"
              control={control}
              render={({ field }) => (
                <Select
                  showSearch
                  placeholder="Select a product"
                  optionFilterProp="label"
                  onChange={(value) => field.onChange(value)}
                  options={products.map((product) => ({
                    value: product.id,
                    label: product.name,
                  }))}
                  value={field.value || ""}
                  className="mt-1 block w-full rounded-md shadow-sm border-gray-300"
                />
              )}
            />
            {errors.productId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.productId.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Quantité
            </label>
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => <Input {...field} type="number" />}
            />
            {errors.quantity && (
              <p className="text-red-500">{errors.quantity.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Ajouter
          </button>
        </form>
      </Modal>

      <Modal
        title="Confirmer la suppression"
        open={isDeleteModalVisible}
        onOk={handleDeleteAllSales}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Confirmer"
        cancelText="Annuler"
      >
        <p>Êtes-vous sûr de vouloir supprimer toutes les ventes?</p>
      </Modal>
    </div>
  );
};

export default VentePage;
