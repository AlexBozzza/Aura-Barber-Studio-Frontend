import { useEffect, useState } from "react";
import {
    FaCalendarDay,
    FaClock,
    FaUsers,
    FaCut,
    FaMoneyBillWave,
    FaCheckCircle
} from "react-icons/fa";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

import { getDashboardData } from "../services/dashboardService";


function AdminPanel() {

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // CARGAR DASHBOARD
    // ==========================================

    const loadDashboard = async () => {

        try {

            setLoading(true);

            setError("");

            const data =
                await getDashboardData();

            setDashboard(data);

        } catch (error) {

            console.error(
                "Error al cargar dashboard:",
                error
            );

            setError(
                "No se pudieron cargar los datos del dashboard."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // CARGAR AL ENTRAR
    // ==========================================

    useEffect(() => {

        loadDashboard();

    }, []);


    // ==========================================
    // FORMATO DE MONEDA
    // ==========================================

    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "es-CR",
            {
                style: "currency",
                currency: "CRC",
                minimumFractionDigits: 0
            }
        ).format(value || 0);

    };


    // ==========================================
    // FORMATO DE HORA
    // ==========================================

    const formatTime = (time) => {

        if (!time) return "--:--";

        return String(time).slice(0, 5);

    };


    // ==========================================
    // ESTADO DE CITA
    // ==========================================

    const getStatusLabel = (status) => {

        const statuses = {

            PENDING: "Pendiente",

            CONFIRMED: "Confirmada",

            COMPLETED: "Completada",

            CANCELLED: "Cancelada"

        };

        return statuses[status] || status;

    };


    const getStatusClasses = (status) => {

        const classes = {

            PENDING:
                "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

            CONFIRMED:
                "bg-blue-500/10 text-blue-400 border-blue-500/20",

            COMPLETED:
                "bg-green-500/10 text-green-400 border-green-500/20",

            CANCELLED:
                "bg-red-500/10 text-red-400 border-red-500/20"

        };

        return classes[status] ||
            "bg-gray-500/10 text-gray-400 border-gray-500/20";

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="min-h-screen bg-[#111111] text-white">

                <AdminSidebar />

                <div className="ml-0 min-w-0 lg:ml-64">

                    <AdminHeader />

                    <main className="min-w-0 p-4 sm:p-6 lg:p-8">

                        <div className="flex items-center justify-center min-h-[400px]">

                            <div className="text-gray-400">

                                Cargando dashboard...

                            </div>

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error || !dashboard) {

        return (

            <div className="min-h-screen bg-[#111111] text-white">

                <AdminSidebar />

                <div className="ml-0 min-w-0 lg:ml-64">

                    <AdminHeader />

                    <main className="min-w-0 p-4 sm:p-6 lg:p-8">

                        <div className="bg-[#202020] border border-red-500/20 rounded-2xl p-8 text-center">

                            <p className="text-red-400 mb-4">

                                {error ||
                                    "No se pudieron cargar los datos."}

                            </p>

                            <button
                                onClick={loadDashboard}
                                className="px-5 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
                            >
                                Reintentar
                            </button>

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-[#111111] text-white">

            <AdminSidebar />

            <div className="ml-0 min-w-0 lg:ml-64">

                <AdminHeader />

                <main className="min-w-0 p-4 sm:p-6 lg:p-8">

                    {/* ==================================
                        ENCABEZADO
                    ================================== */}

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold">

                            Dashboard

                        </h1>

                        <p className="text-gray-400 mt-2">

                            Resumen general de AuraBarberStudio.

                        </p>

                    </div>


                    {/* ==================================
                        TARJETAS PRINCIPALES
                    ================================== */}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">


                        {/* CITAS DE HOY */}

                        <div className="bg-[#202020] border border-gray-700 rounded-2xl p-6">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-gray-400 text-sm">

                                        Citas de hoy

                                    </p>

                                    <h2 className="text-3xl font-bold mt-2">

                                        {dashboard.todayAppointments}

                                    </h2>

                                </div>

                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">

                                    <FaCalendarDay className="text-blue-400 text-xl" />

                                </div>

                            </div>

                        </div>


                        {/* PENDIENTES */}

                        <div className="bg-[#202020] border border-gray-700 rounded-2xl p-6">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-gray-400 text-sm">

                                        Citas pendientes

                                    </p>

                                    <h2 className="text-3xl font-bold mt-2">

                                        {dashboard.pendingAppointments}

                                    </h2>

                                </div>

                                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">

                                    <FaClock className="text-yellow-400 text-xl" />

                                </div>

                            </div>

                        </div>


                        {/* CLIENTES */}

                        <div className="bg-[#202020] border border-gray-700 rounded-2xl p-6">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-gray-400 text-sm">

                                        Total de clientes

                                    </p>

                                    <h2 className="text-3xl font-bold mt-2">

                                        {dashboard.totalClients}

                                    </h2>

                                </div>

                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">

                                    <FaUsers className="text-purple-400 text-xl" />

                                </div>

                            </div>

                        </div>


                        {/* SERVICIOS */}

                        <div className="bg-[#202020] border border-gray-700 rounded-2xl p-6">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-gray-400 text-sm">

                                        Servicios activos

                                    </p>

                                    <h2 className="text-3xl font-bold mt-2">

                                        {dashboard.activeServices}

                                    </h2>

                                </div>

                                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">

                                    <FaCut className="text-green-400 text-xl" />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        INGRESOS
                    ================================== */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">


                        {/* INGRESO POTENCIAL */}

                        <div className="bg-[#202020] border border-gray-700 rounded-2xl p-6">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-gray-400 text-sm">

                                        Ingreso potencial de hoy

                                    </p>

                                    <h2 className="text-3xl font-bold mt-2">

                                        {formatCurrency(
                                            dashboard.potentialRevenue
                                        )}

                                    </h2>

                                    <p className="text-gray-500 text-sm mt-2">

                                        Citas pendientes y confirmadas

                                    </p>

                                </div>

                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">

                                    <FaMoneyBillWave className="text-emerald-400 text-xl" />

                                </div>

                            </div>

                        </div>


                        {/* INGRESO REALIZADO */}

                        <div className="bg-[#202020] border border-gray-700 rounded-2xl p-6">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-gray-400 text-sm">

                                        Ingreso realizado hoy

                                    </p>

                                    <h2 className="text-3xl font-bold mt-2">

                                        {formatCurrency(
                                            dashboard.completedRevenue
                                        )}

                                    </h2>

                                    <p className="text-gray-500 text-sm mt-2">

                                        Servicios completados

                                    </p>

                                </div>

                                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">

                                    <FaCheckCircle className="text-green-400 text-xl" />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        AGENDA DE HOY
                    ================================== */}

                    <div className="mt-10 bg-[#202020] border border-gray-700 rounded-2xl p-6">

                        <div className="mb-6">

                            <h2 className="text-xl font-semibold">

                                Agenda de hoy

                            </h2>

                            <p className="text-gray-400 text-sm mt-1">

                                Citas programadas para el día de hoy.

                            </p>

                        </div>


                        {dashboard.todaySchedule.length === 0 ? (

                            <div className="py-12 text-center">

                                <FaCalendarDay className="mx-auto text-3xl text-gray-600 mb-4" />

                                <p className="text-gray-500">

                                    No hay citas programadas para hoy.

                                </p>

                            </div>

                        ) : (

                            <div className="space-y-3">

                                {dashboard.todaySchedule.map(
                                    (appointment) => (

                                        <div
                                            key={appointment.id}
                                            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-[#171717] border border-gray-800"
                                        >

                                            {/* HORA */}

                                            <div className="flex items-center gap-4 min-w-[120px]">

                                                <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center">

                                                    <FaClock className="text-gray-400" />

                                                </div>

                                                <div>

                                                    <p className="font-semibold">

                                                        {formatTime(
                                                            appointment.start_time
                                                        )}

                                                    </p>

                                                    <p className="text-xs text-gray-500">

                                                        {formatTime(
                                                            appointment.end_time
                                                        )}

                                                    </p>

                                                </div>

                                            </div>


                                            {/* CLIENTE */}

                                            <div className="flex-1">

                                                <p className="text-xs text-gray-500 mb-1">

                                                    Cliente

                                                </p>

                                                <p className="font-medium">

                                                    {appointment.client_first_name}{" "}

                                                    {appointment.client_last_name}

                                                </p>

                                            </div>


                                            {/* SERVICIO */}

                                            <div className="flex-1">

                                                <p className="text-xs text-gray-500 mb-1">

                                                    Servicio

                                                </p>

                                                <p className="font-medium">

                                                    {appointment.service_name}

                                                </p>

                                            </div>


                                            {/* BARBERO */}

                                            <div className="flex-1">

                                                <p className="text-xs text-gray-500 mb-1">

                                                    Barbero

                                                </p>

                                                <p className="font-medium">

                                                    {appointment.barber_first_name}{" "}

                                                    {appointment.barber_last_name}

                                                </p>

                                            </div>


                                            {/* PRECIO */}

                                            <div className="min-w-[100px]">

                                                <p className="text-xs text-gray-500 mb-1">

                                                    Precio

                                                </p>

                                                <p className="font-medium">

                                                    {formatCurrency(
                                                        appointment.service_price
                                                    )}

                                                </p>

                                            </div>


                                            {/* ESTADO */}

                                            <div>

                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${getStatusClasses(
                                                        appointment.status
                                                    )}`}
                                                >

                                                    {getStatusLabel(
                                                        appointment.status
                                                    )}

                                                </span>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </main>

            </div>

        </div>

    );

}


export default AdminPanel;