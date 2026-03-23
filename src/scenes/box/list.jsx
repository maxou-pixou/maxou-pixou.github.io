import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LuPackage } from "react-icons/lu";

import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import CreateBoxModal from "./createBoxModal";
import api from "../../services/api";

export default function BoxList() {
    const navigate = useNavigate();
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ page: 1 });
    const [total, setTotal] = useState();

    useEffect(() => {
        fetchBoxes();
    }, [filter]);

    const fetchBoxes = async () => {
        try {
            setLoading(true);
            const { data, ok, total } = await api.post("/box/search", { offset: (filter.page - 1) * 10, });
            if (!ok) return toast.error("Erreur de chargement des boîtes !");
            setBoxes(data);
            setTotal(total);
        } catch (error) {
            return toast.error("Erreur lors de la récupération des boîtes !");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                        Total : <span className="font-semibold font-mono text-gray-900">{total || 0}</span> boîtes
                    </div>
                    <CreateBoxModal onSuccess={fetchBoxes} />
                </div>
            </div>

            <div className="flow-root relative">
                {loading && <Loader />}
                {boxes.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                        <LuPackage className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-500">Aucune boîte trouvée</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {boxes.map((box) => (
                            <div
                                key={box._id}
                                onClick={() => navigate(`/box/${box._id}`)}
                                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-black transition-all cursor-pointer"
                            >
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="h-16 w-16 rounded-lg bg-black flex items-center justify-center">
                                        <LuPackage className="h-8 w-8 text-white" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900">{box.name || "—"}</h3>

                                    <div className="w-full space-y-2 text-sm">
                                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                            <span className="text-gray-600">Dimensions (cm)</span>
                                            <span className="font-medium text-gray-900">
                                                {box.box_length || box.box_length === 0 ? box.box_length : "—"} × {box.box_width || box.box_width === 0 ? box.box_width : "—"} × {box.box_height || box.box_height === 0 ? box.box_height : "—"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                            <span className="text-gray-600">Poids (g)</span>
                                            <span className="font-medium text-gray-900">
                                                {box.weight_g || box.weight_g === 0 ? `${box.weight_g}` : "—"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                            <span className="text-gray-600">Créé par</span>
                                            <div className="flex items-center gap-2">
                                                {box.admin_avatar ? (
                                                    <img src={box.admin_avatar} alt={box.admin_name} className="h-5 w-5 rounded-full border border-gray-200 object-cover" />
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 uppercase">
                                                        {box.admin_name?.[0] || "A"}
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-900 text-xs">{box.admin_name || "—"}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                            <span className="text-gray-600">Créé le</span>
                                            <span className="font-medium text-gray-900">
                                                {box.created_at ? new Date(box.created_at).toLocaleDateString() : "—"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Pagination total={total} per_page={10} currentPage={filter.page} onChange={(page) => setFilter({ ...filter, page })} />
        </div>
    );
}
