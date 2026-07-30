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
    accesoriosList, accesoriosObservaciones,
    compresionMotor, fugasAceite, estadoBateria, ruidosExtranos, motorObservaciones,
    estadoGeneralVehiculo, conceptofinal,
    imagenesList, 
    firma,
    svgEsquemaVehiculo,
    comentariosGenerales
  } = peritajeData || {};

  const colorPrimario = [8, 13, 26];    
  const colorSecundario = [37, 99, 235]; 
  const colorTexto = [51, 65, 85];      

  // --- ENCABEZADO PRINCIPAL (PÁGINA 1) ---
  doc.setFillColor(...colorPrimario);
  doc.rect(0, 0, 216, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("PERITO ORINOQUIA", 14, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text("CONSOLA DE PERITAJE AUTOMOTRIZ", 14, 21);
  doc.text("Yopal, Casanare", 14, 26);

  doc.setFontSize(8.5);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 202, 14, { align: "right" });

  const placaAncho = 45;
  const placaAlto = 16;
  const placaX = 157;
  const placaY = 18;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(placaX, placaY, placaAncho, placaAlto, 1.5, 1.5, "FD");

  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("REPÚBLICA DE COLOMBIA", placaX + (placaAncho / 2), placaY + 4.5, { align: "center" });

  doc.setTextColor(8, 13, 26);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(placa ? placa.toUpperCase() : "SIN PLACA", placaX + (placaAncho / 2), placaY + 13, { align: "center" });

  // --- SECCIÓN 1: IDENTIFICACIÓN DEL VEHÍCULO ---
  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("1. IDENTIFICACIÓN Y DATOS RUNT", 14, 46);

  autoTable(doc, {
    startY: 50,
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

  // --- NUEVA PÁGINA PARA ESQUEMAS SVG Y ACCESORIOS ---
  doc.addPage();
  
  doc.setFillColor(...colorPrimario);
  doc.rect(0, 0, 216, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(`Esquema e Inventario - Placa: ${placa ? placa.toUpperCase() : "N/A"}`, 14, 10);

  // --- SECCIÓN 4: MAPA DE DAÑOS (VISTAS INTERNA / EXTERNA O SVG) ---
  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("4. MAPA DE DAÑOS Y PARTES AFECTADAS", 14, 25);

  let currentY = 32;

  // Si envías un array de esquemas (ej: vista externa e interna) o un único string SVG
  const esquemasArray = Array.isArray(svgEsquemaVehiculo) 
    ? svgEsquemaVehiculo 
    : (svgEsquemaVehiculo ? [svgEsquemaVehiculo] : []);

  if (esquemasArray.length > 0) {
    esquemasArray.forEach((esquema, idx) => {
      if (currentY > 210) {
        doc.addPage();
        currentY = 25;
      }
      
      try {
        let svgData = esquema;
        // Si viene como string HTML o SVG puro, lo convertimos a data URI base64
        if (typeof svgData === 'string') {
          if (!svgData.startsWith('data:image/svg+xml')) {
            svgData = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
          }
          doc.addImage(svgData, 'SVG', 45, currentY, 125, 65);
          doc.setDrawColor(220, 220, 220);
          doc.rect(45, currentY, 125, 65);
        }
      } catch (e) {
        console.error(`Error al renderizar el esquema SVG ${idx + 1}:`, e);
      }
      currentY += 72;
    });
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("No hay esquemas gráficos de daños registrados.", 14, currentY);
    currentY += 15;
  }

  // --- SECCIÓN 5: ACCESORIOS E INVENTARIO ---
  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("5. ACCESORIOS E INVENTARIO", 14, currentY + 5);

  const bodyAccesorios = (accesoriosList || []).map(acc => [
    acc.name, 
    acc.tipo === 'seleccion_multiple' ? (acc.seleccion || "N/A") : (acc.presente ? "SÍ" : "NO"), 
    acc.danado ? "DADO / DAÑADO" : "OPERATIVO",
    acc.costoReparacion ? `$ ${Number(acc.costoReparacion).toLocaleString()}` : "$ 0"
  ]);

  autoTable(doc, {
    startY: currentY + 9,
    margin: { left: 14, right: 14 },
    theme: "striped",
    headStyles: { fillColor: colorPrimario, fontStyle: "bold" },
    styles: { fontSize: 8, textColor: colorTexto },
    head: [["Accesorio / Elemento", "Detalle / Selección", "Estado", "Costo Rep."]],
    body: bodyAccesorios.length > 0 ? bodyAccesorios : [["Sin datos de accesorios", "", "", ""]],
  });


  // --- NUEVA PÁGINA PARA DETALLE DE COSTOS Y DICTAMEN ---
  doc.addPage();
  
  doc.setFillColor(...colorPrimario);
  doc.rect(0, 0, 216, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(`Valoración y Dictamen - Placa: ${placa ? placa.toUpperCase() : "N/A"}`, 14, 10);

  // --- SECCIÓN 6: DETALLE DE COSTOS Y VALORACIÓN DE DAÑOS ---
  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("6. DETALLE DE COSTOS Y VALORACIÓN DE DAÑOS", 14, 25);

  const accesoriosDaniados = (accesoriosList || []).filter(item => item.danado);
  
  const bodyCostosDanos = accesoriosDaniados.map(item => [
    item.name || "Accesorio",
    item.comentarioDaño || "Dañado / Mal Estado",
    `$ ${Number(item.costoReparacion || 0).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 29,
    margin: { left: 14, right: 14 },
    theme: "striped",
    headStyles: { fillColor: colorPrimario, fontStyle: "bold" },
    styles: { fontSize: 8.5, textColor: colorTexto },
    head: [["Parte / Elemento Afectado", "Descripción del Daño", "Costo Estimado"]],
    body: bodyCostosDanos.length > 0 ? bodyCostosDanos : [["Sin elementos con daños valorizados", "-", "$ 0"]],
  });

  const totalCostoAccesorios = accesoriosDaniados.reduce((acc, curr) => acc + Number(curr.costoReparacion || 0), 0);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...colorPrimario);
  doc.text(`VALOR TOTAL ESTIMADO DE REPARACIÓN: $ ${Number(totalCostoAccesorios).toLocaleString()}`, 14, doc.lastAutoTable.finalY + 8);


  // --- SECCIÓN 7: DICTAMEN FINAL Y COMENTARIOS ---
  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("7. DICTAMEN Y COMENTARIOS GENERALES", 14, doc.lastAutoTable.finalY + 14);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 17,
    margin: { left: 14, right: 14 },
    theme: "plain",
    styles: { fontSize: 9.5, textColor: colorTexto },
    body: [
      ["Estado General del Vehículo:", estadoGeneralVehiculo ? estadoGeneralVehiculo.toUpperCase() : "ACEPTABLE"],
      ["Costos Totales Estimados:", `$ ${Number(totalCostoAccesorios).toLocaleString()}`],
      ["Observaciones de Inventario:", accesoriosObservaciones || "Ninguna"],
      ["Comentarios Adicionales / Generales:", comentariosGenerales || comentariosSiniestros || "Sin comentarios adicionales."],
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
  doc.text("8. EVIDENCIA FOTOGRÁFICA DEL VEHÍCULO", 14, 25);

  let posX = 14;
  let posY = 32;
  let imgWidth = 55;   
  let imgHeight = 40;  
  let marginX = 10;
  let marginY = 12;
  let maxPerRow = 3;

  if (imagenesList && imagenesList.length > 0) {
    imagenesList.forEach((imgObj, index) => {
      if (posY + imgHeight > 220) { 
        doc.addPage();
        posY = 25;
      }

      // Soportar tanto si viene como URL, Base64 directo, o un objeto con propiedad url/base64
      const imgSource = typeof imgObj === 'string' ? imgObj : (imgObj?.urlBase64 || imgObj?.url || imgObj?.preview);
      
      if (imgSource) {
        try {
          const processedImg = prepararImagenParaPdf(imgSource);
          if (processedImg) {
            doc.addImage(processedImg.data, processedImg.format, posX, posY, imgWidth, imgHeight);
            doc.setDrawColor(200, 200, 200);
            doc.rect(posX, posY, imgWidth, imgHeight);
          }
        } catch (error) {
          console.error("Error al renderizar imagen fotográfica:", error);
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
  let firmaPosY = posY + 15;
  if (firmaPosY > 220) {
    doc.addPage();
    firmaPosY = 30;
  }

  doc.setTextColor(...colorSecundario);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("9. FIRMA DE VALIDACIÓN Y CONFORMIDAD", 14, firmaPosY);

  const firmaAncho = 60;
  const firmaAlto = 25;
  const firmaPosX = 14;
  const firmaBoxY = firmaPosY + 5;

  doc.setDrawColor(150, 150, 150);
  doc.rect(firmaPosX, firmaBoxY, firmaAncho, firmaAlto);

  if (firma) {
    try {
      const processedFirma = prepararImagenParaPdf(firma);
      if (processedFirma) {
        doc.addImage(processedFirma.data, processedFirma.format, firmaPosX + 2, firmaBoxY + 2, firmaAncho - 4, firmaAlto - 4);
      }
    } catch (e) {
      console.error("Error al renderizar la firma en el PDF:", e);
    }
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Sin firma registrada", firmaPosX + 15, firmaBoxY + 14);
  }

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

// Función auxiliar mejorada para formatear imágenes y firmas de manera segura
const prepararImagenParaPdf = (source) => {
  if (!source) return null;
  
  if (typeof source === 'object' && source.data && source.format) {
    return source;
  }

  let format = 'JPEG';
  let data = source;

  if (typeof source === 'string') {
    if (source.includes('image/png') || source.startsWith('iVBORw0KGgo') || source.endsWith('.png')) {
      format = 'PNG';
    }
    
    if (!source.startsWith('data:image') && !source.startsWith('http')) {
      data = `data:image/${format.toLowerCase()};base64,${source}`;
    }
  }

  return { data, format };
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