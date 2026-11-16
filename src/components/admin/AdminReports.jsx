
import { useState } from "react";
import { getPaymentReports } from "../../services/appointmentService";

import * as XLSX from "xlsx-js-style";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminReports() {
  const today = new Date();

  const localDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(
    localDate(new Date(today.getFullYear(), today.getMonth(), 1))
  );

  const [endDate, setEndDate] = useState(localDate(today));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([
  "SINPE",
  "EFECTIVO",
  "TARJETA",
]);

  const formatCurrency = (amount) =>
    `₡${Number(amount || 0).toLocaleString("es-CR")}`;

  const formatDate = (date) => {
    if (!date) return "-";
    const [year, month, day] = String(date).slice(0, 10).split("-");
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time) => {
    return time ? String(time).slice(0, 5) : "-";
  };


  // ==========================================
// FILTRAR MÉTODOS DE PAGO
// ==========================================

const filteredAppointments = report
  ? report.appointments.filter((appointment) =>
      selectedPaymentMethods.includes(appointment.payment_method)
    )
  : [];

const filteredSummary = {
  total_appointments: filteredAppointments.length,

  total_revenue: filteredAppointments.reduce(
    (total, appointment) =>
      total + Number(appointment.service_price || 0),
    0
  ),

  total_sinpe: filteredAppointments
    .filter((appointment) => appointment.payment_method === "SINPE")
    .reduce(
      (total, appointment) =>
        total + Number(appointment.service_price || 0),
      0
    ),

  total_cash: filteredAppointments
    .filter((appointment) => appointment.payment_method === "EFECTIVO")
    .reduce(
      (total, appointment) =>
        total + Number(appointment.service_price || 0),
      0
    ),

  total_card: filteredAppointments
    .filter((appointment) => appointment.payment_method === "TARJETA")
    .reduce(
      (total, appointment) =>
        total + Number(appointment.service_price || 0),
      0
    ),
};

const togglePaymentMethod = (method) => {
  setSelectedPaymentMethods((previous) =>
    previous.includes(method)
      ? previous.filter((item) => item !== method)
      : [...previous, method]
  );
};

const selectAllPaymentMethods = () => {
  setSelectedPaymentMethods(["SINPE", "EFECTIVO", "TARJETA"]);
};
  // ==========================================
  // GENERAR REPORTE
  // ==========================================

  const handleGenerateReport = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError("Selecciona ambas fechas.");
      return;
    }

    if (startDate > endDate) {
      setError("La fecha inicial no puede ser posterior a la final.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getPaymentReports(startDate, endDate);
      setReport(data);
    } catch (error) {
      console.error("Error generando reporte:", error);

      setError(
        error.response?.data?.message ||
        "No se pudo generar el reporte."
      );

      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EXPORTAR EXCEL
  // ==========================================

 
const exportToExcel = () => {
  if (!report) return;

  const workbook = XLSX.utils.book_new();

  const gold = "B8860B";
  const dark = "202020";
  const white = "FFFFFF";
  const gray = "E5E5E5";

  const titleStyle = {
    font: { bold: true, sz: 20, color: { rgb: gold } },
    alignment: { vertical: "center" },
  };

  const subtitleStyle = {
    font: { bold: true, sz: 14, color: { rgb: dark } },
  };

  const sectionStyle = {
    font: { bold: true, sz: 12, color: { rgb: white } },
    fill: { fgColor: { rgb: gold } },
    alignment: { vertical: "center" },
  };

  const headerStyle = {
    font: { bold: true, color: { rgb: white } },
    fill: { fgColor: { rgb: dark } },
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
    border: {
      bottom: { style: "thin", color: { rgb: gold } },
    },
  };

  const cellStyle = {
    font: { color: { rgb: "333333" }, sz: 10 },
    alignment: { vertical: "center" },
    border: {
      bottom: { style: "thin", color: { rgb: gray } },
    },
  };

  const currencyStyle = {
    ...cellStyle,
    numFmt: '"₡" #,##0',
    alignment: {
      horizontal: "right",
      vertical: "center",
    },
  };

  // ==========================================
  // TODOS LOS DATOS EN UNA SOLA HOJA
  // ==========================================

  const excelData = [
    ["AURA BARBER STUDIO"],
    ["REPORTE DE INGRESOS"],
    [],
    ["Fecha inicial", formatDate(startDate)],
    ["Fecha final", formatDate(endDate)],
    [],
    ["RESUMEN FINANCIERO"],
    ["Concepto", "Total"],
    ["Ingresos totales", Number(filteredSummary.total_revenue || 0)],
    ["Total SINPE", Number(filteredSummary.total_sinpe || 0)],
    ["Total efectivo", Number(filteredSummary.total_cash || 0)],
    ["Total tarjeta", Number(filteredSummary.total_card || 0)],
    ["Citas pagadas", Number(filteredSummary.total_appointments || 0)],
    [],
    ["DETALLE DE PAGOS"],
    [
      "Cliente",
      "Servicio",
      "Precio",
      "Fecha",
      "Hora",
      "Método de pago",
      "Barbero",
    ],
    ...filteredAppointments.map((appointment) => [
      `${appointment.first_name} ${appointment.last_name}`,
      appointment.service_name,
      Number(appointment.service_price || 0),
      formatDate(appointment.appointment_date),
      formatTime(appointment.start_time),
      appointment.payment_method,
      `${appointment.barber_first_name} ${appointment.barber_last_name}`,
    ]),
  ];

  const sheet = XLSX.utils.aoa_to_sheet(excelData);

  // ==========================================
  // ANCHO DE COLUMNAS
  // ==========================================

  sheet["!cols"] = [
    { wch: 30 },
    { wch: 28 },
    { wch: 16 },
    { wch: 16 },
    { wch: 12 },
    { wch: 20 },
    { wch: 30 },
  ];

  // ==========================================
  // ALTURA DE FILAS
  // ==========================================

  sheet["!rows"] = [
    { hpt: 35 },
    { hpt: 25 },
    { hpt: 10 },
    { hpt: 23 },
    { hpt: 23 },
    { hpt: 10 },
    { hpt: 25 },
    { hpt: 25 },
    { hpt: 23 },
    { hpt: 23 },
    { hpt: 23 },
    { hpt: 23 },
    { hpt: 15 },
    { hpt: 25 },
    { hpt: 30 },
    { hpt: 30 },
    ...filteredAppointments.map(() => ({ hpt: 30 })),
  ];

  // ==========================================
  // COMBINAR CELDAS
  // ==========================================

  sheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
    { s: { r: 6, c: 0 }, e: { r: 6, c: 6 } },
    { s: { r: 14, c: 0 }, e: { r: 14, c: 6 } },
  ];

  // ==========================================
  // TÍTULOS
  // ==========================================

  sheet["A1"].s = titleStyle;
  sheet["A2"].s = subtitleStyle;

  // ==========================================
  // FECHAS
  // ==========================================

  ["A4", "A5"].forEach((cell) => {
    sheet[cell].s = {
      font: { bold: true, color: { rgb: dark } },
    };
  });

  // ==========================================
  // RESUMEN FINANCIERO
  // ==========================================

  sheet["A7"].s = sectionStyle;
  sheet["A15"].s = sectionStyle;

  sheet["A8"].s = headerStyle;
  sheet["B8"].s = headerStyle;

  for (let row = 9; row <= 13; row++) {
    sheet[`A${row}`].s = cellStyle;

    sheet[`B${row}`].s =
      row === 13
        ? {
            ...cellStyle,
            font: { bold: true, color: { rgb: dark } },
            alignment: { horizontal: "right" },
          }
        : currencyStyle;
  }

  // ==========================================
  // DETALLE DE PAGOS
  // ==========================================

  // Encabezados: fila 16
  for (let col = 0; col < 7; col++) {
    const cell = XLSX.utils.encode_cell({
      r: 15,
      c: col,
    });

    sheet[cell].s = headerStyle;
  }

  // Datos: desde la fila 17
  for (let row = 16; row < 16 + filteredAppointments.length; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = XLSX.utils.encode_cell({
        r: row,
        c: col,
      });

      sheet[cell].s =
        col === 2
          ? currencyStyle
          : {
              ...cellStyle,
              alignment: {
                vertical: "center",
                horizontal: col === 4 ? "center" : "left",
              },
            };
    }
  }

  // Filtros en el detalle
  sheet["!autofilter"] = {
    ref: `A16:G${Math.max(16, 16 + filteredAppointments.length)}`,
  };

  // ==========================================
  // CREAR Y DESCARGAR EXCEL
  // ==========================================

  XLSX.utils.book_append_sheet(
    workbook,
    sheet,
    "Reporte de ingresos"
  );

  XLSX.writeFile(
    workbook,
    `AuraBarber_Reporte_${startDate}_${endDate}.xlsx`
  );
};


  // ==========================================
  // EXPORTAR PDF
  // ==========================================

const exportToPDF = async () => {
  if (!report) return;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // CARGAR FUENTE CON SOPORTE PARA ₡
  try {
    const response = await fetch("/fonts/DejaVuSans.ttf");

    if (!response.ok) {
      throw new Error("No se pudo cargar la fuente DejaVuSans.");
    }

    const fontBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(fontBuffer);

    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    const base64Font = window.btoa(binary);

    doc.addFileToVFS("DejaVuSans.ttf", base64Font);
    doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
    doc.setFont("DejaVuSans", "normal");
  } catch (error) {
    console.error("Error cargando fuente:", error);
    alert("No se pudo cargar la fuente del PDF. Revisa el archivo DejaVuSans.ttf.");
    return;
  }

  // ENCABEZADO
  doc.setFontSize(20);
  doc.setFont("DejaVuSans", "normal");
  doc.text("AURA BARBER STUDIO", 14, 18);

  doc.setFontSize(14);
  doc.text("Reporte de ingresos", 14, 27);

  doc.setFontSize(10);
  doc.text(
    `Periodo: ${formatDate(startDate)} al ${formatDate(endDate)}`,
    14,
    35
  );

  // RESUMEN FINANCIERO
  autoTable(doc, {
    startY: 42,
    head: [["Concepto", "Total"]],
    body: [
      [
        "Ingresos totales",
        formatCurrency(filteredSummary.total_revenue),
      ],
      [
        "Total SINPE",
        formatCurrency(filteredSummary.total_sinpe),
      ],
      [
        "Total efectivo",
        formatCurrency(filteredSummary.total_cash),
      ],
      [
        "Total tarjeta",
        formatCurrency(filteredSummary.total_card),
      ],
      [
        "Citas pagadas",
        String(filteredSummary.total_appointments),
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [184, 134, 11],
      font: "DejaVuSans",
    },
    styles: {
      font: "DejaVuSans",
      fontSize: 9,
    },
    tableWidth: 110,
  });

  // DETALLE DE PAGOS
  const detailRows = filteredAppointments.map((appointment) => [
    `${appointment.first_name} ${appointment.last_name}`,
    appointment.service_name,
    formatCurrency(appointment.service_price),
    formatDate(appointment.appointment_date),
    formatTime(appointment.start_time),
    appointment.payment_method,
    `${appointment.barber_first_name} ${appointment.barber_last_name}`,
  ]);

  const finalY = doc.lastAutoTable.finalY || 42;

  autoTable(doc, {
    startY: finalY + 10,
    head: [[
      "Cliente",
      "Servicio",
      "Precio",
      "Fecha",
      "Hora",
      "Pago",
      "Barbero",
    ]],
    body: detailRows,
    theme: "grid",
    headStyles: {
      fillColor: [184, 134, 11],
      font: "DejaVuSans",
    },
    styles: {
      font: "DejaVuSans",
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 38 },
      2: { cellWidth: 25 },
      3: { cellWidth: 22 },
      4: { cellWidth: 17 },
      5: { cellWidth: 22 },
      6: { cellWidth: 38 },
    },
  });

  doc.save(
    `AuraBarber_Reporte_${startDate}_${endDate}.pdf`
  );
};

  return (
    <div className="w-full">

      {/* ENCABEZADO */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Reportes
        </h1>

        <p className="mt-2 text-gray-400">
          Consulta los ingresos y pagos registrados en la barbería.
        </p>
      </div>

      {/* FILTRO DE FECHAS */}
      <form
        onSubmit={handleGenerateReport}
        className="mb-8 rounded-2xl border border-gray-700 bg-[#202020] p-5 sm:p-6"
      >
        <h2 className="mb-5 text-lg font-bold text-white">
          Filtrar por fechas
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:items-end">

          <div>
            <label className="mb-2 block font-semibold text-gray-300">
              Fecha inicial
            </label>

            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-white focus:border-[#B8860B] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-300">
              Fecha final
            </label>

            <input
              type="date"
              value={endDate}
              min={startDate}
              max={localDate(today)}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-[#111111] px-4 py-3 text-white focus:border-[#B8860B] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#B8860B] px-6 py-3 font-bold text-white transition hover:bg-[#DAA520] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generando..." : "Generar reporte"}
          </button>

        </div>
      </form>

  {/* FILTRO DE MÉTODOS DE PAGO */}
  <div className="mb-8 rounded-2xl border border-gray-700 bg-[#202020] p-5 sm:p-6">

    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-white">
          Filtrar por método de pago
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Selecciona los métodos que deseas incluir en el reporte.
        </p>
      </div>

      <button
        type="button"
        onClick={selectAllPaymentMethods}
        className="rounded-lg border border-[#B8860B] px-4 py-2 text-sm font-semibold text-[#DAA520] transition hover:bg-[#B8860B]/10"
      >
        Seleccionar todos
      </button>
    </div>

    <div className="flex flex-wrap gap-3">

      {[
        { value: "SINPE", label: "SINPE", color: "blue" },
        { value: "EFECTIVO", label: "Efectivo", color: "green" },
        { value: "TARJETA", label: "Tarjeta", color: "purple" },
      ].map((method) => {
        const selected = selectedPaymentMethods.includes(method.value);

        return (
          <button
            key={method.value}
            type="button"
            onClick={() => togglePaymentMethod(method.value)}
            className={`rounded-xl border px-5 py-3 font-semibold transition ${
              selected
                ? "border-[#B8860B] bg-[#B8860B]/20 text-[#DAA520]"
                : "border-gray-700 bg-[#111111] text-gray-400 hover:border-gray-500"
            }`}
          >
            <span className="mr-2">
              {selected ? "✓" : "○"}
            </span>
            {method.label}
          </button>
        );
      })}

    </div>

    <p className="mt-4 text-xs text-gray-500">
      {selectedPaymentMethods.length} de 3 métodos seleccionados.
    </p>

  </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-700 bg-red-900/30 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* RESULTADOS */}
      {report && (
        <>

          {/* RESUMEN */}
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

            <div className="rounded-2xl border border-gray-700 bg-[#202020] p-5">
              <p className="text-sm text-gray-400">
                Ingresos totales
              </p>
              <p className="mt-2 text-2xl font-bold text-[#B8860B]">
                {formatCurrency(filteredSummary.total_revenue)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-700 bg-[#202020] p-5">
              <p className="text-sm text-gray-400">
                Total SINPE
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {formatCurrency(filteredSummary.total_sinpe)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-700 bg-[#202020] p-5">
              <p className="text-sm text-gray-400">
                Total efectivo
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {formatCurrency(filteredSummary.total_cash)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-700 bg-[#202020] p-5">
              <p className="text-sm text-gray-400">
                Total tarjeta
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {formatCurrency(filteredSummary.total_card)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-700 bg-[#202020] p-5">
              <p className="text-sm text-gray-400">
                Citas pagadas
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {filteredSummary.total_appointments}
              </p>
            </div>

          </div>

          {/* EXPORTACIONES */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={exportToExcel}
              className="flex items-center justify-center gap-2 rounded-xl border border-green-700 bg-green-900/20 px-5 py-3 font-semibold text-green-400 transition hover:bg-green-900/40"
            >
              📊 Exportar Excel
            </button>

            <button
              type="button"
              onClick={exportToPDF}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-700 bg-red-900/20 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-900/40"
            >
              📄 Exportar PDF
            </button>

          </div>

          {/* DETALLE */}
          <div className="overflow-hidden rounded-2xl border border-gray-700 bg-[#202020]">

            <div className="border-b border-gray-700 p-5">
              <h2 className="text-xl font-bold text-white">
                Detalle de pagos
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Citas completadas con método de pago registrado.
              </p>
            </div>

            {filteredAppointments.length === 0 ? (

              <div className="p-10 text-center">
                <p className="text-gray-400">
                  No se encontraron pagos en este rango de fechas.
                </p>
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px] text-left">

                  <thead className="bg-[#111111] text-sm text-gray-400">
                    <tr>
                      <th className="px-5 py-4">Cliente</th>
                      <th className="px-5 py-4">Servicio</th>
                      <th className="px-5 py-4">Precio</th>
                      <th className="px-5 py-4">Fecha</th>
                      <th className="px-5 py-4">Hora</th>
                      <th className="px-5 py-4">Método de pago</th>
                      <th className="px-5 py-4">Barbero</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-700 text-sm text-gray-300">

                    {filteredAppointments.map((appointment) => (

                      <tr
                        key={appointment.id}
                        className="hover:bg-[#292929]"
                      >
                        <td className="px-5 py-4 font-semibold text-white">
                          {appointment.first_name} {appointment.last_name}
                        </td>

                        <td className="px-5 py-4">
                          {appointment.service_name}
                        </td>

                        <td className="px-5 py-4 font-semibold text-[#B8860B]">
                          {formatCurrency(appointment.service_price)}
                        </td>

                        <td className="px-5 py-4">
                          {formatDate(appointment.appointment_date)}
                        </td>

                        <td className="px-5 py-4">
                          {formatTime(appointment.start_time)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                              appointment.payment_method === "SINPE"
                                ? "border-blue-700 bg-blue-900/30 text-blue-400"
                                : appointment.payment_method === "EFECTIVO"
                                  ? "border-green-700 bg-green-900/30 text-green-400"
                                  : "border-purple-700 bg-purple-900/30 text-purple-400"
                            }`}
                          >
                            {appointment.payment_method}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {appointment.barber_first_name} {appointment.barber_last_name}
                        </td>
                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </>
      )}

    </div>
  );
}

export default AdminReports;
