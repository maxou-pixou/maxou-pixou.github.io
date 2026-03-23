import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import LoadingButton from "../../../components/LoadingButton";
import FileInput from "../../../components/FileInput";
import api from "../../../services/api";

export default function Information({ item, setItem }) {
    const navigate = useNavigate();
    const [values, setValues] = useState(item);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValues(item);
    }, [item]);

    const onUpdate = async () => {
        setLoading(true);
        try {
            const { data, ok } = await api.put(`/portfolio/${item._id}`, values);
            if (!ok) throw new Error();
            setItem(data);
            toast.success("Mis à jour avec succès !");
            navigate("/portfolio");
        } catch (e) {
            toast.error("Erreur lors de la mise à jour de l'élément du portfolio");
        }
        setLoading(false);
    };

    const onDelete = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément du portfolio ? Cette action est irréversible.")) return;

        try {
            const { ok } = await api.remove(`/portfolio/${item._id}`);
            if (!ok) return toast.error("Erreur lors de la suppression de l'élément du portfolio");
            toast.success("Élément du portfolio supprimé avec succès !");
            navigate("/portfolio");
        } catch (e) {
            toast.error("Erreur lors de la suppression de l'élément du portfolio");
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
                                {item.admin_name?.[0] || "A"}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{item.admin_name || "Inconnu"}</p>
                            <p className="text-[10px] text-gray-400 font-mono">ID : {item.admin_id}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <p className="text-sm text-gray-900">{item.created_at ? new Date(item.created_at).toLocaleString() : "—"}</p>
                </div>
            </div>

            <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <div className="flex flex-col gap-4">
                    {values.image && <img src={values.image} alt="Aperçu" className="max-w-md rounded-lg border border-gray-200 shadow-sm" />}
                    <FileInput
                        name="image"
                        folder="portfolio"
                        buttonText="Changer l'image"
                        onChange={(e) => setValues({ ...values, image: e.target.value })}
                        buttonClassName="max-w-md py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <LoadingButton
                    loading={loading}
                    onClick={onUpdate}
                    disabled={!values.image || values.image === item.image}
                    className="py-2 px-4 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-lg shadow-black/30 transition-all disabled:opacity-50"
                >
                    Mettre à jour
                </LoadingButton>
                <button onClick={onDelete} className="py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                    Supprimer
                </button>
            </div>
        </div>
    );
}
