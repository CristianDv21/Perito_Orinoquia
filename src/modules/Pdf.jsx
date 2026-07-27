import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const previsualizarPdfEstiloCliente = (peritajeData) => {
  const doc = generarInstanciaPdf(peritajeData);
  const pdfBlobUrl = doc.output('bloburl');
  window.open(pdfBlobUrl, '_blank');
};

export const generarPdfEstiloCliente = (peritajeData) => {
  const doc = generarInstanciaPdf(peritajeData);
  const placa = peritajeData?.placa;
  const nombreArchivo = `Peritaje_${placa ? placa.toUpperCase() : "REGISTRO"}_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(nombreArchivo);
};

export const generarInstanciaPdf = (peritajeData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter",
  });

  const {
    placa, marca, linea, modelo, numMotor, numChasis, organismoTransito, comentariosSiniestros,
    numeroSoat, entityEmisoraSoat, venceSoat, soatAlDia,
    numeroControlRtm, cdaEmisor, venceTecnicoMecanica, tecnicoMecanicaAlDia,
    coincidePropietarioRunt, tieneEmbargosOAlertas, restriccionBlindaje,
    accesoriosList, llantasData, accesoriosObservaciones, accesoriosCosto,
    compresionMotor, fugasAceite, estadoBateria, ruidosExtranos, motorObservaciones,
    estadoGeneralVehiculo, conceptofinal,
    imagenesList, // Array de imágenes [{ urlBase64: "..." }]
    firma         // 👈 Imagen de la firma en Base64 (capturada del módulo de firmas)
  } = peritajeData || {};

  const colorPrimario = [8, 13, 26];    
  const colorSecundario = [37, 99, 235]; 
  const colorTexto = [51, 65, 85];      

  // --- ENCABEZADO PRINCIPAL (PÁGINA 1) ---
  doc.setFillColor(...colorPrimario);
  doc.rect(0, 0, 216, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("PERITO ORINOQUIA", 14, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("CONSOLA DE PERITAJE AUTOMOTRIZ", 14, 22);
  doc.text("Yopal, Casanare", 155, 14);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 155, 20);

  doc.setFillColor(...colorPrimario);
  doc.roundedRect(160, 38, 42, 16, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(placa ? placa.toUpperCase() : "SIN PLACA", 164, 49);

  // --- SECCIÓN 1: IDENTIFICACIÓN DEL VEHÍCULO ---
  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("1. IDENTIFICACIÓN Y DATOS RUNT", 14, 45);

  autoTable(doc, {
    startY: 48,
    margin: { left: 14, right: 14 },
    theme: "striped",
    headStyles: { fillColor: colorPrimario, fontStyle: "bold" },
    styles: { fontSize: 9, textColor: colorTexto },
    head: [["Campo", "Información Registrada"]],
    body: [
      ["Placa Vehicular", placa ? placa.toUpperCase() : "N/A"],
      ["Marca", marca || "N/A"],
      ["Línea / Versión", linea || "N/A"],
      ["Modelo (Año)", modelo || "N/A"],
      ["Número de Motor", numMotor || "N/A"],
      ["Número de Chasis", numChasis || "N/A"],
      ["Organismo de Tránsito", organismoTransito || "N/A"],
      ["Comentarios de Siniestros", comentariosSiniestros || "Sin siniestros reportados"],
    ],
  });

  // --- SECCIÓN 2: CONTROL LEGAL Y DOCUMENTACIÓN ---
  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("2. VALIDACIÓN LEGAL Y DOCUMENTAL", 14, doc.lastAutoTable.finalY + 10);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 13,
    margin: { left: 14, right: 14 },
    theme: "grid",
    headStyles: { fillColor: colorPrimario, fontStyle: "bold" },
    styles: { fontSize: 9, textColor: colorTexto },
    head: [["Documento / Control", "Detalle", "Estado"]],
    body: [
      ["SOAT (N° Control)", numeroSoat || "N/A", soatAlDia ? "AL DÍA" : "VENCIDO / NO REGISTRA"],
      ["Entidad Emisora SOAT", entityEmisoraSoat || "N/A", `Vence: ${venceSoat || "N/A"}`],
      ["RTM (N° Control)", numeroControlRtm || "N/A", tecnicoMecanicaAlDia ? "AL DÍA" : "VENCIDO / NO REGISTRA"],
      ["CDA Emisor RTM", cdaEmisor || "N/A", `Vence: ${venceTecnicoMecanica || "N/A"}`],
      ["Coincide Propietario RUNT", coincidePropietarioRunt ? "SÍ" : "NO", "Validación en Plataforma"],
      ["Embargos o Alertas", tieneEmbargosOAlertas ? "SÍ (ALERTA)" : "NINGUNO", "Verificación de Historial"],
      ["Restricción por Blindaje", restrictionLabel(restriccionBlindaje), "Estado Físico"],
    ],
  });

  // --- SECCIÓN 3: DIAGNÓSTICO DEL MOTOR ---
  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("3. COMPONENTES MECÁNICOS Y MOTOR", 14, doc.lastAutoTable.finalY + 10);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 13,
    margin: { left: 14, right: 14 },
    theme: "striped",
    headStyles: { fillColor: colorPrimario, fontStyle: "bold" },
    styles: { fontSize: 9, textColor: colorTexto },
    head: [["Ítem Evaluado", "Resultado / Estado"]],
    body: [
      ["Compresión de Motor", compressionMotorText(compresionMotor)],
      ["Fugas de Aceite", fugasAceite ? "SÍ PRESENTA" : "NO PRESENTA"],
      ["Estado de la Batería", estadoBateria || "Bueno"],
      ["Ruidos Extraños en Motor", ruidosExtranos ? "SÍ PRESENTA" : "NO PRESENTA"],
      ["Observaciones Mecánicas", motorObservaciones || "Sin observaciones particulares"],
    ],
  });

  // --- NUEVA PÁGINA PARA ACCESORIOS Y LLANTAS ---
  doc.addPage();
  
  doc.setFillColor(...colorPrimario);
  doc.rect(0, 0, 216, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(`Reporte Complementario - Placa: ${placa ? placa.toUpperCase() : "N/A"}`, 14, 10);

  // --- SECCIÓN 4: ACCESORIOS ---
  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("4. ACCESORIOS E INVENTARIO", 14, 25);

  const bodyAccesorios = (accesoriosList || []).map(acc => [
    acc.name, acc.categoria, acc.presente ? "SÍ" : "NO", acc.danado ? "MALO / DAÑADO" : "OPERATIVO"
  ]);

  autoTable(doc, {
    startY: 28,
    margin: { left: 14, right: 14 },
    theme: "striped",
    headStyles: { fillColor: colorPrimario, fontStyle: "bold" },
    styles: { fontSize: 8.5, textColor: colorTexto },
    head: [["Accesorio", "Categoría", "Presente", "Estado Funcional"]],
    body: bodyAccesorios.length > 0 ? bodyAccesorios : [["Sin datos de accesorios", "", "", ""]],
  });

  // --- SECCIÓN 5: ESTADO DE LLANTAS ---
  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("5. MEDICIÓN Y ESTADO DE NEUMÁTICOS", 14, doc.lastAutoTable.finalY + 10);

  const llantasRows = [
    ["Delantera Derecha", llantasData?.delantera_der?.marca || "N/A", llantasData?.delantera_der?.medida || "N/A", `${llantasData?.delantera_der?.profundidad_mm || "0"} mm`, `${llantasData?.delantera_der?.porcentaje_vida || "0"}%`],
    ["Delantera Izquierda", llantasData?.delantera_izq?.marca || "N/A", llantasData?.delantera_izq?.medida || "N/A", `${llantasData?.delantera_izq?.profundidad_mm || "0"} mm`, `${llantasData?.delantera_izq?.porcentaje_vida || "0"}%`],
    ["Trasera Derecha", llantasData?.trasera_der?.marca || "N/A", llantasData?.trasera_der?.medida || "N/A", `${llantasData?.trasera_der?.profundidad_mm || "0"} mm`, `${llantasData?.trasera_der?.porcentaje_vida || "0"}%`],
    ["Trasera Izquierda", llantasData?.trasera_izq?.marca || "N/A", llantasData?.trasera_izq?.medida || "N/A", `${llantasData?.trasera_izq?.profundidad_mm || "0"} mm`, `${llantasData?.trasera_izq?.porcentaje_vida || "0"}%`],
    ["Repuesto", llantasData?.repuesto?.marca || "N/A", llantasData?.repuesto?.medida || "N/A", `${llantasData?.repuesto?.profundidad_mm || "0"} mm`, `${llantasData?.repuesto?.porcentaje_vida || "0"}%`],
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 13,
    margin: { left: 14, right: 14 },
    theme: "grid",
    headStyles: { fillColor: colorPrimario, fontStyle: "bold" },
    styles: { fontSize: 9, textColor: colorTexto },
    head: [["Posición", "Marca", "Medida", "Profundidad", "Vida Útil Est."]],
    body: llantasRows,
  });

  // --- SECCIÓN 6: DICTAMEN FINAL ---
  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("6. DICTAMEN Y CONCEPTO FINAL", 14, doc.lastAutoTable.finalY + 10);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 13,
    margin: { left: 14, right: 14 },
    theme: "plain",
    styles: { fontSize: 10, textColor: colorTexto },
    body: [
      ["Estado General del Vehículo:", estadoGeneralVehiculo ? estadoGeneralVehiculo.toUpperCase() : "ACEPTABLE"],
      ["Costos Estimados en Accesorios:", `$ ${Number(accesoriosCosto || 0).toLocaleString()}`],
      ["Observaciones de Inventario:", accesoriosObservaciones || "Ninguna"],
      ["Concepto Técnico Final:", conceptofinal || "Vehículo inspeccionado bajo los estándares requeridos."],
    ],
  });

  // --- NUEVA PÁGINA: REGISTRO FOTOGRÁFICO Y FIRMA ---
  doc.addPage();
  doc.setFillColor(...colorPrimario);
  doc.rect(0, 0, 216, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(`Evidencia y Firmas - Placa: ${placa ? placa.toUpperCase() : "N/A"}`, 14, 10);

  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("7. EVIDENCIA FOTOGRÁFICA DEL VEHÍCULO", 14, 25);

  let posX = 14;
  let posY = 32;
  let imgWidth = 55;   
  let imgHeight = 40;  
  let marginX = 10;
  let marginY = 12;
  let maxPerRow = 3;

  if (imagenesList && imagenesList.length > 0) {
    imagenesList.forEach((imgObj, index) => {
      if (posY + imgHeight > 220) { // Dejamos espacio abajo para la firma
        doc.addPage();
        posY = 25;
      }

      const base64Data = imgObj?.urlBase64 || imgObj?.url;
      if (base64Data) {
        try {
          doc.addImage(base64Data, 'JPEG', posX, posY, imgWidth, imgHeight);
          doc.setDrawColor(200, 200, 200);
          doc.rect(posX, posY, imgWidth, imgHeight);
        } catch (error) {
          console.error("Error al cargar imagen en el PDF", error);
        }
      }

      if ((index + 1) % maxPerRow === 0) {
        posX = 14;
        posY += imgHeight + marginY;
      } else {
        posX += imgWidth + marginX;
      }
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("No se registraron imágenes fotográficas en este peritaje.", 14, 33);
    posY = 40;
  }

  // --- SECCIÓN DE FIRMA DIGITAL ---
  // Calculamos una posición segura para la firma al fondo de la última página o en nueva página si no cabe
  let firmaPosY = posY + 15;
  if (firmaPosY > 220) {
    doc.addPage();
    firmaPosY = 30;
  }

  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("8. FIRMA DE VALIDACIÓN Y CONFORMIDAD", 14, firmaPosY);

  // Cuadro para la firma
  const firmaAncho = 60;
  const firmaAlto = 25;
  const firmaPosX = 14;
  const firmaBoxY = firmaPosY + 5;

  doc.setDrawColor(150, 150, 150);
  doc.rect(firmaPosX, firmaBoxY, firmaAncho, firmaAlto);

  if (firma) {
    try {
      doc.addImage(firma, 'PNG', firmaPosX + 2, firmaBoxY + 2, firmaAncho - 4, firmaAlto - 4);
    } catch (e) {
      console.error("Error al cargar la firma", e);
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Sin firma registrada", firmaPosX + 15, firmaBoxY + 14);
  }

  // Línea de firma y datos del perito/cliente
  doc.setDrawColor(50, 50, 50);
  doc.line(firmaPosX, firmaBoxY + firmaAlto + 10, firmaPosX + firmaAncho, firmaBoxY + firmaAlto + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...colorTexto);
  doc.text("Firma del Perito / Inspector", firmaPosX, firmaBoxY + firmaAlto + 14);
  doc.text("Perito Orinoquia", firmaPosX, firmaBoxY + firmaAlto + 18);

  // --- PIE DE PÁGINA DE CIERRE LEGAL ---
  const finalY = doc.lastAutoTable.finalY + 15;
  if (finalY < 260) {
    doc.setDrawColor(200, 200, 200);
    doc.line(14, finalY, 202, finalY);
    doc.setFontSize(8);
    doc.setTextColor(120, 130, 140);
    doc.text("Este peritaje representa una inspección técnico-visual al momento del examen.", 14, finalY + 5);
    doc.text("Perito Orinoquia - Yopal, Casanare, Colombia.", 14, finalY + 9);
  }

  return doc;
};

const restrictionLabel = (key) => {
  const types = {
    sin_blindaje: "Sin Blindaje",
    blindaje_2: "Blindaje Nivel 2",
    blindaje_3: "Blindaje Nivel 3",
    blindaje_4: "Blindaje Nivel 4 o Superior"
  };
  return types[key] || "Sin Especificar";
};

const compressionMotorText = (val) => {
  if (!val) return "No Medida / Pendiente";
  return `${val} PSI (Promedio Cilindros)`;
};