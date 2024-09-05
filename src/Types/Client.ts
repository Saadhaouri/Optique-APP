// Types/ClientType.ts

export interface AddressClient {
  nr: number;
  street: string;
  neighborhood: string;
  city: string;
}

export interface Visite {
  id: string;
  dateVisite: string; // ISO 8601 format date string
  oD_Sphere: string;
  oD_Cylinder: string;
  oD_Axis: number;
  oD_Add: number;
  oS_Sphere: string;
  oS_Cylinder: string;
  oS_Axis: number;
  oS_Add: number;
  pd: string;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
  visites?: Visite[];
}

export interface CreateClient {
  nom: string;
  prenom: string;

  telephone: string;
}

export interface UpdateClient extends CreateClient {
  visites: Visite[];
}
