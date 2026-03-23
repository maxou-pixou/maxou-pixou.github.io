import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Modal from "../../components/Modal";
import LoadingButton from "../../components/LoadingButton";
import FileInput from "../../components/FileInput";
import api from "../../services/api";

export default function CreatePortfolioModal({ onSuccess }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState({});
    const [btnLoading, setBtnLoading] = useState(false);

    const onCreate = async () => {
        setBtnLoading(true);
        try {
            const { ok, code, data } = await api.post("/portfolio", values);

            if (!ok) {
                toast.error(code || "Erreur lors de la création de l'élément du portfolio !");
                setBtnLoading(false);
            } else {
                toast.success("Élément du portfolio créé !");
                setOpen(false);
                setValues({});
                setBtnLoading(false);
                if (onSuccess) onSuccess();
                navigate(`/portfolio/${data._id}`);
            }
        } catch (error) {
            toast.error("Erreur lors de la création de l'élément du portfolio !");
            setBtnLoading(false);
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
                Ajouter au portfolio
            </button>

            <Modal isOpen={open} className="!w-[90vw] md:!w-[500px] p-6" onClose={() => setOpen(false)}>
                <h1 className="text-xl font-semibold mb-6 text-gray-900">Ajouter un élément au portfolio</h1>

                <div className="space-y-4">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                        <div className="flex flex-col gap-4">
                            {values.image && <img src={values.image} alt="Aperçu" className="w-full rounded-lg border border-gray-200" />}
                            <FileInput
                                name="image"
                                folder="portfolio"
                                buttonText={values.image ? "Changer l'image" : "Sélectionner une image"}
                                onChange={(e) => setValues({ ...values, image: e.target.value })}
                                buttonClassName="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-3 mt-6">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </button>
                    <LoadingButton
                        className="py-2 px-4 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-lg shadow-black/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        loading={btnLoading}
                        disabled={!values.image}
                        onClick={onCreate}
                    >
                        Créer
                    </LoadingButton>
                </div>
            </Modal>
        </div>
    );
}
