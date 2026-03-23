import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Modal from "../../components/Modal";
import LoadingButton from "../../components/LoadingButton";
import Select from "../../components/Select";
import api from "../../services/api";

export default function CreateClotheModal({ onSuccess, categories }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState({ name: "", category_id: "", category_name: "" });
    const [loading, setLoading] = useState(false);

    const onCreate = async () => {
        setLoading(true);
        try {
            const { ok, code, data } = await api.post("/clothe", {
                name: values.name,
                category_id: values.category_id,
                category_name: values.category_name
            });

            if (!ok) {
                toast.error(code || "Erreur lors de la création de l'article !");
                setLoading(false);
            } else {
                toast.success("Article créé !");
                setOpen(false);
                setValues({ name: "", category_id: "", category_name: "" });
                setLoading(false);
                if (onSuccess) onSuccess();
                navigate(`/clothe/${data._id}`);
            }
        } catch (error) {
            toast.error("Erreur lors de la création de l'article !");
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                className="whitespace-nowrap flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-lg shadow-black/30 text-sm font-medium text-white bg-black hover:bg-gray-800 transition-all"
                onClick={() => setOpen(true)}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter un vêtement
            </button>

            <Modal isOpen={open} className="!w-[90vw] md:!w-[400px] p-6" onClose={() => setOpen(false)}>
                <h1 className="text-xl font-semibold mb-6 text-gray-900">Créer un nouvel article</h1>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'article</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
                            placeholder="Entrez le nom de l'article"
                            value={values.name || ""}
                            onChange={(e) => setValues({ ...values, name: e.target.value })}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                        <Select
                            placeholder="Sélectionner une catégorie"
                            data={categories.map((c) => c.name)}
                            value={values.category_name}
                            onChange={(val) => {
                                const cat = categories.find((c) => c.name === val);
                                setValues({ ...values, category_id: cat?._id, category_name: cat?.name });
                            }}
                            className="w-full max-w-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                    <button
                        onClick={() => {
                            setOpen(false);
                            setValues({ name: "", category_id: "", category_name: "" });
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </button>
                    <LoadingButton
                        className="py-2 px-4 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-lg shadow-black/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        loading={loading}
                        disabled={!values.name || !values.category_id}
                        onClick={onCreate}
                    >
                        Créer
                    </LoadingButton>
                </div>
            </Modal>
        </div>
    );
}
