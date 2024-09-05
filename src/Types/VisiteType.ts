export interface Visite {
  id: string;
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
}

export interface CreateVisite {
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

  prixMonture: number; // Price for the frame

  total: number; // Total amount
  avance: number; // Advance payment
  reste: number; // Remaining balance

  remise: number; // Discount
  doctor: string; // Name of the doctor
}
