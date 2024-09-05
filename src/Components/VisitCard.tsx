import React from "react";

type VisitCardProps = {
  visit: {
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
  onClose: () => void;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const VisitCard: React.FC<VisitCardProps> = ({ visit, onClose }) => {
  return (
    <div className="w-full max-w-3xl p-4  rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">{visit.fullname}</h2>
          <p className="text-sm text-gray-500">
            {formatDate(visit.dateVisite)}
          </p>
        </div>                                                                                                                                                                                                  
        <button
          className="text-red-500 hover:text-red-700"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>

      <div className="grid md:grid-cols-1 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Détails de la prescription
          </h3>
          <div className="relative w-full overflow-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Œil
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Sphère
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Cylindre
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                    Axe
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-100">
                  <td className="px-4 py-2">OD</td>
                  <td className="px-4 py-2">{visit.oD_Sphere}</td>
                  <td className="px-4 py-2">{visit.oD_Cylinder}</td>
                  <td className="px-4 py-2">{visit.oD_Axis}</td>
                </tr>
                <tr className="hover:bg-gray-100">
                  <td className="px-4 py-2">OG</td>
                  <td className="px-4 py-2">{visit.oS_Sphere}</td>
                  <td className="px-4 py-2">{visit.oS_Cylinder}</td>
                  <td className="px-4 py-2">{visit.oS_Axis}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm text-gray-500">Verre OD</p>
          <p className="text-lg font-semibold">{visit.verreOD}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Prix Verre OD</p>
          <p className="text-lg font-semibold">{visit.priceOD} DH</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Verre OS</p>
          <p className="text-lg font-semibold">{visit.verreOS}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Prix Verre OS</p>
          <p className="text-lg font-semibold">{visit.priceOS} DH</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Addition</p>
          <p className="text-lg font-semibold">{visit.add}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">PD</p>
          <p className="text-lg font-semibold">{visit.pd}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Monture</p>
          <p className="text-lg font-semibold">{visit.prixmonture} DH</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-lg font-semibold">{visit.total} DH</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Avance</p>
          <p className="text-lg font-semibold">{visit.avance} DH</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Reste</p>
          <p className="text-lg font-semibold">{visit.reste} DH</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Remise</p>
          <p className="text-lg font-semibold">{visit.remise} DH</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Médecin</p>
          <p className="text-lg font-semibold">{visit.doctor}</p>
        </div>
      </div>
    </div>
  );
};

export default VisitCard;
