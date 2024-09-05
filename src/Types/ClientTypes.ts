// Types/ClientTypes.ts

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
  // Add other fields relevant to the client if necessary
}

export interface Visit {
  id: string;
  dateVisite: string;
  oD_Sphere: string;
  oD_Cylinder: string;
  oD_Axis: number;

  oS_Sphere: string;
  oS_Cylinder: string;
  oS_Axis: number;
  add: number;
  pd: string;
  total: number;
  verre: string;
  avance: number;
  reste: number;
  remise: number;
  clientId: string;
  doctor: string;
}

// VisitCard.tsx
