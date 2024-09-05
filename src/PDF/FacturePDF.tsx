import { Document, Page, Text, View, Image, Font } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import opfacture from "../assets/optiquefacture.png";
import { Facture } from "../Types/Facture";
import { Visite } from "../Types/VisiteType";
import { Client } from "../Types/Client";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import writtenNumber from "written-number";

// Register the font
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu72xKOzY.woff2",
    }, // regular font
    {
      src: "https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc9.ttf",
      fontWeight: 700,
    }, // bold font
  ],
});

// Create Tailwind instance
const tw = createTw({
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto"],
      },
      colors: {
        primary: "#1F316F",
        secondary: "#EDF2F7",
        accent: "#4299E1",
        gray: "#F7FAFC",
      },
    },
  },
});

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("fr-FR", options).format(new Date(dateString));
};

type Factureprops = {
  facture: Facture;
  visite?: Visite;
  client?: Client;
};

const FacturePDF = ({ facture, visite }: Factureprops) => {
  const amountInWordsFr = writtenNumber(
    (visite?.priceOD ?? 0) +
      (visite?.priceOS ?? 0) +
      (visite?.prixmonture ?? 0),
    { lang: "fr" }
  );

  return (
    <Document>
      <Page size="A5" style={tw("p-8 bg-white relative font-sans")}>
        {/* Header Section */}
        <View style={tw("flex flex-row justify-between items-center mb-8")}>
          <Image src={opfacture} style={tw("w-32 h-16")} />
          <View style={tw("text-right")}>
            <Text style={tw("text-primary text-sm mb-1")}>
              Kenitra, le {formatDate(facture.dateFacture)}
            </Text>
            <Text style={tw("text-sm font-semibold")}>
              Facture N°: {facture.nFacture}
            </Text>
          </View>
        </View>

        {/* Client and Doctor Information */}
        <View style={tw("flex flex-row justify-between mb-2 ")}>
          <Text style={tw("font-semibold text-sm text-primary")}>
            M: {visite?.fullname}
          </Text>{" "}
          <Text style={tw("font-semibold text-sm text-primary")}>
            Dr: {visite?.doctor}
          </Text>
        </View>

        {/* Vision Details */}
        <Text style={tw("text-primary font-semibold text-md mb-1 text-center")}>
          Vision de Loin
        </Text>
        <Table>
          <TH>
            <TD style={tw("bg-accent text-center text-xs p-2 w-[25%]")}>
              <Text style={tw("font-bold text-sm text-white")}>Oeil</Text>
            </TD>
            <TD style={tw("bg-secondary text-center text-xs p-2 w-[25%]")}>
              <Text style={tw("font-bold text-sm text-primary")}>Sphère</Text>
            </TD>
            <TD style={tw("bg-secondary text-center text-xs p-2 w-[25%]")}>
              <Text style={tw("font-bold text-sm text-primary")}>Cylindre</Text>
            </TD>
            <TD style={tw("bg-secondary text-center text-xs p-2 w-[25%]")}>
              <Text style={tw("font-bold text-sm text-primary")}>Axe</Text>
            </TD>
          </TH>
          <TR>
            <TD style={tw("bg-gray text-center text-xs p-2 w-[25%]")}>
              <Text style={tw("text-primary font-semibold")}>OD</Text>
            </TD>
            <TD style={tw("text-center text-xs p-2 w-[25%]")}>
              {visite?.oD_Sphere}
            </TD>
            <TD style={tw("text-center text-xs p-2 w-[25%]")}>
              {visite?.oD_Cylinder}
            </TD>
            <TD style={tw("text-center text-xs p-2 w-[25%]")}>
              {visite?.oD_Axis}
            </TD>
          </TR>
          <TR>
            <TD style={tw("bg-gray text-center text-xs p-2 w-[25%]")}>
              <Text style={tw("text-primary font-semibold")}>OG</Text>
            </TD>
            <TD style={tw("text-center text-xs p-2 w-[25%]")}>
              {visite?.oS_Sphere}
            </TD>
            <TD style={tw("text-center text-xs p-2 w-[25%]")}>
              {visite?.oS_Cylinder}
            </TD>
            <TD style={tw("text-center text-xs p-2 w-[25%]")}>
              {visite?.oS_Axis}
            </TD>
          </TR>
        </Table>

        {/* Addition Section */}
        <View style={tw("mt-4 mb-6")}>
          <Text style={tw("text-primary text-sm font-semibold ")}>
            Addition
          </Text>
          <View style={tw("p-3 bg-secondary rounded text-center")}>
            <Text style={tw("text-primary font-bold text-sm")}>
              Add: {visite?.add}
            </Text>
          </View>
        </View>

        {/* Montant Section */}
        <Text style={tw("text-center font-bold text-sm mt-1")}>Montant</Text>
        <Table style={tw("mt-4")}>
          <TH>
            <TD style={tw("bg-secondary text-center text-xs p-2 w-[25%]")}>
              Quantité
            </TD>
            <TD style={tw("bg-secondary text-center text-xs p-2 w-[50%]")}>
              Désignation
            </TD>
            <TD style={tw("bg-secondary text-center text-xs p-2 w-[25%]")}>
              Prix
            </TD>
          </TH>
          <TR>
            <TD style={tw("text-center text-xs p-2")}>1</TD>
            <TD style={tw("text-left text-xs p-2")}>Monture</TD>
            <TD style={tw("text-right text-xs p-2")}>
              {visite?.prixmonture} DH
            </TD>
          </TR>
          <TR>
            <TD style={tw("text-center text-xs p-2")}>VL</TD>
            <TD style={tw("text-left text-xs p-2")}>{visite?.verreOD}</TD>
            <TD style={tw("text-right text-xs p-2")}>{visite?.priceOD} DH</TD>
          </TR>
          <TR>
            <TD style={tw("text-center text-xs p-2")}>VP</TD>
            <TD style={tw("text-left text-xs p-2")}>{visite?.verreOS}</TD>
            <TD style={tw("text-right text-xs p-2")}>{visite?.priceOS} DH</TD>
          </TR>
        </Table>

        {/* Total Amount */}
        <View style={tw("flex flex-row justify-between mt-4")}>
          <Text style={tw("text-xs font-semibold")}>
            Montant en lettres: {amountInWordsFr} dirhams
          </Text>{" "}
          <Text style={tw("text-xs font-semibold")}>
            Total TTC:{" "}
            {(visite?.priceOD ?? 0) +
              (visite?.priceOS ?? 0) +
              (visite?.prixmonture ?? 0)}{" "}
            MAD
          </Text>
        </View>

        {/* Signature Section */}
        <View
          style={tw(
            "mt-8 p-4 bg-gray text-center text-xs rounded border border-accent"
          )}
        >
          <Text>Signature et cachet</Text>
        </View>

        {/* Footer Section */}
        <View
          style={tw(
            "bg-gray-200 text-xs p-2 text-center absolute bottom-0 left-0 right-0"
          )}
        >
          <Text>INPE: 055016604</Text>
          <Text>ICE: 001979697000031</Text>
          <Text>
            R.C: 66898 - Patente: 20600569 IF: 15237994 - CNSS: 4388725
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default FacturePDF;
