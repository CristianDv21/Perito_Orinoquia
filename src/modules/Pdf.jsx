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
    placa, marca, linea, modelo, modeloAnio, numMotor, numChasis, organismoTransito,
    kilometraje, cilindrada, tipoTransmision, traccion, tipoVehiculo,
    venceSoat, soatAlDia,
    venceTecnicoMecanica, tecnicoMecanicaAlDia,
    tarjetaOperacion,
    accesoriosList,
    motorObservaciones, comentariosMotor,
    clienteNombre, clienteDocumento,
    scoreCarroceria, scoreMecanica, scoreElectrico, scoreEstructura, scoreLegal
  } = peritajeData || {};

  // Función para extraer texto de forma limpia si llega como objeto o texto plano
  const extraerTexto = (campo) => {
    if (!campo) return "";
    if (typeof campo === 'object') {
      return campo.nombre || campo.name || campo.label || campo.descripcion || campo.razonSocial || "";
    }
    return String(campo);
  };

  const nombreSucursal = extraerTexto(
    peritajeData?.sucursal || 
    peritajeData?.sucursalNombre || 
    peritajeData?.sucursal_vendedor?.nombre || 
    peritajeData?.sucursalVendedor
  ) || "CDA YOPAL";

  const nombreVendedor = extraerTexto(
    peritajeData?.vendedor || 
    peritajeData?.vendedorNombre || 
    peritajeData?.nombre_vendedor || 
    peritajeData?.vendedor?.name || 
    peritajeData?.vendedor?.nombre
  ) || "N/A";

  const nombreInspector = extraerTexto(
    peritajeData?.inspector || 
    peritajeData?.inspectorNombre || 
    peritajeData?.nombre_inspector || 
    peritajeData?.inspector?.name || 
    peritajeData?.inspector?.nombre
  ) || "N/A";

  const nombreCliente = clienteNombre || "N/A";

  // Paleta de colores profesional y moderna
  const colorFondoBarra = [41, 55, 77];       
  const colorTextoBarra = [255, 255, 255];   
  const colorTextoNegro = [30, 41, 59];      
  const colorBordeGrid = [203, 213, 225];    

  // --- ENCABEZADO PRINCIPAL ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...colorBordeGrid);
  doc.roundedRect(10, 8, 196, 22, 1, 1, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("CDA / YOPAL", 14, 17);
  
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(" • INSPECCIÓN TÉCNICA", 14, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...colorTextoNegro);
  
  const modeloMostrar = modeloAnio || modelo || "";
  const vehiculoTexto = [marca, linea, modeloMostrar].filter(Boolean).join(" ");
  let tituloVehiculo = `Peritaje ${vehiculoTexto || "Vehículo"} Placa:`.trim();
  doc.text(tituloVehiculo, 105, 12);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 64, 175);
  doc.text(placa ? placa.toUpperCase() : "SIN PLACA", 168, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...colorTextoNegro);
  doc.text(`Sucursal: ${nombreSucursal}`, 105, 16);
  doc.text(`Inspector: ${nombreInspector}`, 150, 16);
  doc.text(`Cliente: ${nombreCliente} ${clienteDocumento ? `(Doc: ${clienteDocumento})` : ''}`, 105, 20);
  doc.text(`Vendedor: ${nombreVendedor}`, 150, 20);
  doc.text(`Tipo de Vehículo: ${tipoVehiculo || "N/A"}`, 105, 24);

  let currentY = 33;

  const agregarBarraSeccion = (titulo) => {
    doc.setFillColor(...colorFondoBarra);
    doc.rect(10, currentY, 196, 5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...colorTextoBarra);
    doc.text(titulo.toUpperCase(), 108, currentY + 3.5, { align: "center" });
    currentY += 5;
  };

  // --- 1. DATOS DEL VEHÍCULO ---
  agregarBarraSeccion("1. Datos del vehículo");

  autoTable(doc, {
    startY: currentY,
    margin: { left: 10, right: 10 },
    theme: "grid",
    styles: { fontSize: 6.5, textColor: colorTextoNegro, cellPadding: 1, lineColor: colorBordeGrid },
    body: [
      ["TIPO VEHÍCULO:", tipoVehiculo || "N/A", "KILOMETRAJE:", kilometraje ? `${kilometraje} km` : "N/A", "CILINDRADA:", cilindrada || "N/A"],
      ["TRANSMISIÓN:", tipoTransmision || "N/A", "TRACCIÓN:", traccion || "N/A", "TARJETA OP:", tarjetaOperacion || "N/A"]
    ],
  });
  currentY = doc.lastAutoTable.finalY;

  // --- 2. DOCUMENTACIÓN ---
  agregarBarraSeccion("2. Documentación");

  autoTable(doc, {
    startY: currentY,
    margin: { left: 10, right: 10 },
    theme: "grid",
    styles: { fontSize: 6.5, textColor: colorTextoNegro, cellPadding: 1, lineColor: colorBordeGrid },
    body: [
      ["Org. de Tránsito", organismoTransito || "N/A", "Número de Chasis", numChasis || "N/A", "Tecnomecánica al día", tecnicoMecanicaAlDia ? "Sí" : "No", "SOAT al día", soatAlDia ? "Sí" : "No"],
      ["Número de Motor", numMotor || "N/A", "Configuración Ejes", peritajeData?.configuracionEjes || "N/A", "Próxima RTM", venceTecnicoMecanica || "N/A", "Vigencia SOAT", venceSoat || "N/A"]
    ],
  });
  currentY = doc.lastAutoTable.finalY;

  // --- 3. ACCESORIOS Y EQUIPAMIENTOS ---
  agregarBarraSeccion("3. Accesorios y equipamientos");

  let accesoriosBody = [];
  const fuenteAccesorios = accesoriosList || [];

  if (Array.isArray(fuenteAccesorios) && fuenteAccesorios.length > 0) {
    let filaActual = [];
    fuenteAccesorios.forEach((item) => {
      const nombreBonito = item.name || item.id || "Accesorio";
      let estadoBonito = "N/A";
      
      if (item.seleccion) {
        estadoBonito = item.seleccion;
      } else if (item.presente === true) {
        estadoBonito = item.danado ? "Sí (Dañado)" : "Sí";
      } else if (item.presente === false) {
        estadoBonito = "No";
      }

      filaActual.push(nombreBonito, estadoBonito);
      if (filaActual.length === 4) {
        accesoriosBody.push(filaActual);
        filaActual = [];
      }
    });

    if (filaActual.length > 0) {
      while (filaActual.length < 4) filaActual.push("", "");
      accesoriosBody.push(filaActual);
    }
  }

  if (accesoriosBody.length === 0) {
    accesoriosBody = [["Sin accesorios registrados", "N/A", "", ""]];
  }

  autoTable(doc, {
    startY: currentY,
    margin: { left: 10, right: 10 },
    theme: "grid",
    styles: { fontSize: 6, textColor: colorTextoNegro, cellPadding: 0.8, lineColor: colorBordeGrid },
    body: accesoriosBody,
  });
  currentY = doc.lastAutoTable.finalY;

  // --- 4. OBSERVACIONES Y MOTOR ---
  agregarBarraSeccion("4. Motor y Diagnóstico General");
  
  autoTable(doc, {
    startY: currentY,
    margin: { left: 10, right: 10 },
    theme: "grid",
    styles: { fontSize: 6.5, textColor: colorTextoNegro, cellPadding: 1, lineColor: colorBordeGrid },
    body: [
      ["ESTADO GENERAL:", peritajeData?.estadoGeneralVehiculo || "N/A", "ESTADO BATERÍA:", peritajeData?.estadoBateria || "N/A"],
      ["COMPRESIÓN CILINDROS:", `Cil 1: ${peritajeData?.compresionCil1 || 'N/A'} | Cil 2: ${peritajeData?.compresionCil2 || 'N/A'}`, "FUGAS DE ACEITE:", peritajeData?.fugasAceite ? "Sí" : "No"],
      ["COMENTARIOS MOTOR:", comentariosMotor || motorObservaciones || "Sin observaciones.", "", ""]
    ],
  });
  currentY = doc.lastAutoTable.finalY;

  // --- 5. CALIFICACIÓN FINAL (SCORES) ---
  agregarBarraSeccion("5. Calificación General de Sistemas");

  autoTable(doc, {
    startY: currentY,
    margin: { left: 10, right: 10 },
    theme: "grid",
    headStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 6.5, cellPadding: 1 },
    styles: { fontSize: 6, textColor: colorTextoNegro, cellPadding: 1, lineColor: colorBordeGrid },
    head: [["SISTEMA", "PUNTAJE"]],
    body: [
      ["Carrocería", `${scoreCarroceria ?? 100} / 100`],
      ["Mecánica", `${scoreMecanica ?? 100} / 100`],
      ["Eléctrico", `${scoreElectrico ?? 100} / 100`],
      ["Estructura", `${scoreEstructura ?? 100} / 100`],
      ["Legal", `${scoreLegal ?? 100} / 100`]
    ],
  });

  return doc;
};