import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiTicket } from "react-icons/hi2";

import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import CreateVoucherModal from "./createVoucherModal";
import api from "../../services/api";

export default function VoucherList() {
    const navigate = useNavigate();
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState({ page: 1 });

    useEffect(() => {
        fetchVouchers();
    }, [filter]);

    const fetchVouchers = async () => {
        try {
            setLoading(true);
            const { data, ok, total } = await api.post("/voucher/search", { offset: (filter.page - 1) * 10, });
            if (!ok) return toast.error("Erreur de chargement des codes promo !");
            setVouchers(data);
            setTotal(total);
        } catch (error) {
            return toast.error("Erreur lors de la récupération des codes promo !");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                        Total : <span className="font-semibold font-mono text-gray-900">{total || 0}</span> codes promo
                    </div>
                    <CreateVoucherModal onSuccess={fetchVouchers} />
                </div>
            </div>

            <div className="flow-root relative">
                {loading && <Loader />}
                {vouchers.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                        <HiTicket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-500">Aucun code promo trouvé</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Réduction</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Utilisé</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Limite</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Valide jusqu'au</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vouchers.map((voucher) => {
                                    const isActive = voucher.active && (!voucher.valid_to || new Date(voucher.valid_to) > new Date());
                                    const discountDisplay =
                                        voucher.discount_type === "percentage"
                                            ? `${voucher.discount_value}%`
                                            : `${voucher.discount_value}€`;

                                    return (
                                        <tr
                                            key={voucher._id}
                                            onClick={() => navigate(`/voucher/${voucher._id}`)}
                                            className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{voucher.code}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{discountDisplay}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{voucher.times_used || 0}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{voucher.usage_limit || "—"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {voucher.valid_to ? new Date(voucher.valid_to).toLocaleDateString() : "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${isActive
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {isActive ? "Actif" : "Inactif"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Pagination total={total} per_page={10} currentPage={filter.page} onChange={(page) => setFilter({ ...filter, page })} />
        </div>
    );
}
