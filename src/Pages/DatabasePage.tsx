import { Button, Card, Typography, message } from "antd";
import db from "../assets/db.png";
import { backupDatabase } from "../Services/Database"; // Ajustez le chemin si nécessaire
import { TbDatabaseImport } from "react-icons/tb";

const { Title, Text } = Typography;

const DatabasePage = () => {
  const handleBackup = async () => {
    try {
      await backupDatabase();
      message.success("Sauvegarde terminée avec succès.");
    } catch (error) {
      message.error("Erreur lors de la sauvegarde. Veuillez réessayer.");
    }
  };

  return (
    <div className="p-4 flex justify-center items-center h-screen bg-background">
      <Card
        className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 rounded-lg shadow-lg"
        bordered={false}
        style={{ textAlign: "center" }}
      >
        <div className="flex justify-center mb-6">
          <img
            src={db}
            alt="base de données"
            className="w-full max-w-xs h-auto"
          />
        </div>
        <div className="space-y-4">
          <Title level={3} className="text-card-foreground">
            Gérez Votre Base de Données
          </Title>
          <Text className="text-muted-foreground">
            Exportez et gérez facilement votre base de données avec nos outils
            puissants.
          </Text>
          <Button
            type="primary"
            block
            onClick={handleBackup}
            icon={<TbDatabaseImport />}
          >
            Exporter la Base de Données
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DatabasePage;
