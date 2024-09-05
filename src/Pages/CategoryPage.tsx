import { DeleteOutlined, EditOutlined, FrownOutlined } from "@ant-design/icons";
import { Button, Modal, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetProductsByCategoryId } from "../hook/useCategories";

interface Category {
  id: string;
  name: string;
}

const CategoryPage: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [listcategories, setListcategories] = useState<Category[]>([]);

  const { register, handleSubmit, reset, setValue } = useForm<Category>();

  useEffect(() => {
    axios
      .get("http://localhost:5062/Category")
      .then((response) => {
        setListcategories(response.data);
      })
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la récupération des catégories !",
          error
        );
      });
  }, []);

  const { products, loading: productsLoading } =
    useGetProductsByCategoryId(selectedCategoryId);

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showUpdateModal = (category: Category) => {
    setCurrentCategory(category);
    setValue("name", category.name);
    setIsUpdateModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsUpdateModalVisible(false);
    setCurrentCategory(null);
    reset();
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const handleDeleteCategory = (categoryId: string) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cette catégorie ?",
      onOk: () => {
        axios
          .delete(`http://localhost:5062/Category/${categoryId}`)
          .then(() => {
            setListcategories(
              listcategories.filter((c) => c.id !== categoryId)
            );
            message.success("Catégorie supprimée avec succès !");
          })
          .catch((error) => {
            message.error(
              "Une erreur s'est produite lors de la suppression de la catégorie !"
            );
            console.error(
              "Une erreur s'est produite lors de la suppression de la catégorie !",
              error
            );
          });
      },
    });
  };

  const onCreateSubmit = (data: Category) => {
    axios
      .post("http://localhost:5062/Category", data)
      .then((response) => {
        setListcategories([...listcategories, response.data]);
        message.success("Catégorie ajoutée avec succès !");
        handleCancel();
      })
      .catch((error) => {
        message.error(
          "Une erreur s'est produite lors de l'ajout de la catégorie !"
        );
        console.error(
          "Une erreur s'est produite lors de l'ajout de la catégorie !",
          error
        );
      });
  };

  const onUpdateSubmit = (data: Category) => {
    if (currentCategory) {
      axios
        .put(`http://localhost:5062/Category/${currentCategory.id}`, data)
        .then((response) => {
          setListcategories(
            listcategories.map((c) =>
              c.id === currentCategory.id ? response.data : c
            )
          );
          message.success("Catégorie mise à jour avec succès !");
          handleCancel();
        })
        .catch((error) => {
          message.error(
            "Une erreur s'est produite lors de la mise à jour de la catégorie !"
          );
          console.error(
            "Une erreur s'est produite lors de la mise à jour de la catégorie !",
            error
          );
        });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8 text-center text-gradient bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">
        Gestion des Catégories
      </h2>
      <div className="flex justify-end  items-center mb-4">
        <button
          className="px-8 py-3 text-white bg-gradient-to-r from-blue-500 to-sky-400 rounded-md shadow-lg hover:shadow-xl transition duration-300"
          onClick={showCreateModal}
        >
          Nouvelle Catégorie
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {listcategories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleSelectCategory(category.id)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <div className="flex items-center space-x-2">
                <EditOutlined
                  className="text-blue-600 hover:text-blue-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    showUpdateModal(category);
                  }}
                />
                <DeleteOutlined
                  className="text-red-600 hover:text-red-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.id);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedCategoryId && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Produits dans la catégorie sélectionnée
          </h2>
          {productsLoading ? (
            <p className="text-center text-gray-500">Chargement en cours...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.productID}
                    className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 rounded-2xl shadow-xl transform hover:translate-y-1 hover:shadow-2xl transition-all duration-300 ease-in-out"
                  >
                    <h3 className="text-white font-bold text-xl truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-200 mt-2 truncate">
                      {product.description}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-white font-extrabold text-lg">
                        {product.price} dh
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center col-span-4">
                  <FrownOutlined className="text-gray-400 text-3xl" />
                  <span className="text-gray-500 text-xl ml-2">
                    Aucun produit trouvé
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <Modal
        title="Nouvelle Catégorie"
        open={isCreateModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit(onCreateSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="categoryName"
              className="block text-sm font-medium text-gray-700"
            >
              Nom de la Catégorie
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              id="categoryName"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Soumettre
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        title="Mettre à Jour la Catégorie"
        open={isUpdateModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit(onUpdateSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="categoryName"
              className="block text-sm font-medium text-gray-700"
            >
              Nom de la Catégorie
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              id="categoryName"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Mettre à Jour
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
