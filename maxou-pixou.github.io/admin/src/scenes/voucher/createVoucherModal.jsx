import React, { useState } from "react";
import toast from "react-hot-toast";
import { HiX } from "react-icons/hi";
import LoadingButton from "../../components/LoadingButton";
import api from "../../services/api";

export default function CreateVoucherModal({ onSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        valid_from: "",
        valid_to: "",
        usage_limit: "",
        active: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.code || !form.discount_value) {
            return toast.error("Code et valeur de réduction sont obligatoires");
        }

        setLoading(true);
        try {
            const payload = {
                code: form.code.toUpperCase(),
                discount_type: form.discount_type,
                discount_value: Number(form.discount_value),
            };

            const { ok } = await api.post("/voucher", payload);
            if (!ok) {
                return toast.error("Erreur lors de la création du code promo");
            }

            toast.success("Code promo créé avec succès !");
            setForm({
                code: "",
                discount_type: "percentage",
                discount_value: "",
            });
            setIsOpen(false);
            onSuccess();
        } catch (error) {
            toast.error("Erreur lors de la création du code promo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all text-sm font-semibold"
            >
                + Nouveau code promo
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Créer un code promo</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={form.code}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type de réduction <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="discount_type"
                                        value={form.discount_type}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    >
                                        <option value="percentage">Pourcentage (%)</option>
                                        <option value="fixed">Montant fixe (€)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Valeur <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="discount_value"
                                        value={form.discount_value}
                                        onChange={handleChange}
                                        placeholder={form.discount_type === "percentage" ? "10" : "5.00"}
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold text-sm"
                                >
                                    Annuler
                                </button>
                                <LoadingButton
                                    loading={loading}
                                    onClick={handleSubmit}
                                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-all font-semibold text-sm"
                                >
                                    Créer
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
