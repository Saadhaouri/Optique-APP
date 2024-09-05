import { yupResolver } from "@hookform/resolvers/yup";
import { Input as AntInput, Modal, message } from "antd";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { createClient } from "../Services/ClientService"; // Update this import based on your service

const schemaClient = yup.object().shape({
  nom: yup.string().required("Nom est requis"),
  prenom: yup.string().required("Prénom est requis"),
  telephone: yup.string().required("Téléphone est requis"),
});

interface ClientFormValues {
  nom: string;
  prenom: string;
  telephone: string;
}

interface CreateClientModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  onSuccess?: () => void;
}

const CreateClientModal: React.FC<CreateClientModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  onSuccess,
}) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ClientFormValues>({
    resolver: yupResolver(schemaClient),
  });

  const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {
    try {
      await createClient(data); // Replace with actual creation logic
      message.success("Client ajouté avec succès");
      reset();
      setIsModalVisible(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      message.error("Erreur lors de l'enregistrement du client");
      console.error("Failed to save client:", error);
    }
  };

  return (
    <Modal
      title="Ajouter Client"
      open={isModalVisible}
      onOk={handleSubmit(onSubmit)}
      onCancel={() => setIsModalVisible(false)}
      okText="Créer"
      cancelText="Annuler"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <Controller
              control={control}
              name="nom"
              render={({ field }) => (
                <AntInput className="p-2 rounded-md shadow-md" {...field} />
              )}
            />
            <p className="text-red-600">{errors.nom?.message}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <Controller
              control={control}
              name="prenom"
              render={({ field }) => (
                <AntInput className="p-2 rounded-md shadow-md" {...field} />
              )}
            />
            <p className="text-red-600">{errors.prenom?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <Controller
              control={control}
              name="telephone"
              render={({ field }) => (
                <AntInput className="p-2 rounded-md shadow-md" {...field} />
              )}
            />
            <p className="text-red-600">{errors.telephone?.message}</p>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClientModal;
