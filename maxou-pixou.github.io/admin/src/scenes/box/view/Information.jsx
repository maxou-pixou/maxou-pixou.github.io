import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import LoadingButton from "../../../components/LoadingButton";
import api from "../../../services/api";

export default function Information({ item, setItem }) {
    const navigate = useNavigate();
    const [values, setValues] = useState(item);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValues(item);
    }, [item]);

    const updateBox = async () => {
        const boxTotalDimensions = parseFloat(values.box_length) + parseFloat(values.box_width) + parseFloat(values.box_height);
        if (boxTotalDimensions < 4) {
            toast.error("La somme des dimensions doit être au minimum de 4 cm");
            return;
        }
        if (boxTotalDimensions > 150) {
            toast.error("La somme des dimensions ne peut pas dépasser 150 cm");
            return;
        }
        
        setLoading(true);
        try {
            const { data, ok } = await api.put(`/box/${item._id}`, values);
            if (!ok) throw new Error();
            setItem(data);
            toast.success("Mis à jour avec succès !");
            navigate("/box");
        } catch (e) {
            toast.error("Erreur lors de la mise à jour de la boîte");
        } finally {
            setLoading(false);
        }
    };

    const deleteBox = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette boîte ? Cette action est irréversible.")) return;

        try {
            const { ok } = await api.remove(`/box/${item._id}`);
            if (!ok) throw new Error();
            toast.success("Boîte supprimée avec succès !");
            navigate("/box");
        } catch (e) {
            toast.error("Erreur lors de la suppression de la boîte");
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Créé par</label>
                    <div className="flex items-center gap-3">
                        {item.admin_avatar ? (
                            <img src={item.admin_avatar} alt={item.admin_name} className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover" />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center font-bold text-gray-400 uppercase">
                                {item.admin_name}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{item.admin_name}</p>
                            <p className="text-[10px] text-gray-400 font-mono">ID : {item.admin_id}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <p className="text-sm text-gray-900">{item.created_at ? new Date(item.created_at).toLocaleString() : "—"}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none font-semibold"
                            value={values.name || ""}
                            onChange={(e) => setValues({ ...values, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Longueur (cm)</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
                            value={values.box_length || ""}
                            onChange={(e) => {
                                const floatFormat = e.target.value.replace(',', '.');
                                if (/^\d*\.?\d*$/.test(floatFormat)) {
                                setValues({ ...values, box_length: floatFormat });
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Poids (g)</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
                            value={values.weight_g }
                            onChange={(e) => {
                                const floatFormat = e.target.value.replace(',', '.');
                                if (/^\d*\.?\d*$/.test(floatFormat)) {
                                    setValues({ ...values, weight_g: floatFormat });
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Largeur (cm)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
                            value={values.box_width || ""}
                            onChange={(e) => {
                                const floatFormat = e.target.value.replace(',', '.');
                                if (/^\d*\.?\d*$/.test(floatFormat)) {
                                setValues({ ...values, box_width: floatFormat });
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hauteur (cm)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
                            value={values.box_height || ""}
                            onChange={(e) => {
                                const floatFormat = e.target.value.replace(',', '.');
                                if (/^\d*\.?\d*$/.test(floatFormat)) {
                                    setValues({ ...values, box_height: floatFormat });
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {(() => {
                const sum = parseFloat(values.box_length) + parseFloat(values.box_width) + parseFloat(values.box_height);
                if (sum > 150 || sum < 4) {
                    return (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 font-medium">⚠️ La somme des dimensions ({sum.toFixed(2)} cm) est incorrecte</p>
                        </div>
                    );
                }
                return null;
            })()}

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <LoadingButton
                    loading={loading}
                    onClick={updateBox}
                    className="py-2.5 px-6 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-lg shadow-black/30 transition-all"
                >
                    Mettre à jour la boîte
                </LoadingButton>
                {/* <button onClick={deleteBox} className="py-2.5 px-6 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                    Supprimer
                </button> */}
            </div>
        </div>
    );
}
