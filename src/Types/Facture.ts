export interface Facture {
  id: string; // UUID represented as a string
  nFacture: string; // Invoice number
  
  dateFacture: string; // Invoice date
  visiteId: string; // UUID for the associated visit, represented as a string
}
