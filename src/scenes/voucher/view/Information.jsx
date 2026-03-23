import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingButton from "../../../components/LoadingButton";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function Information({ voucher, setVoucher }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(voucher);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValues(voucher);
  }, [voucher]);

  const updateVoucher = async () => {
    setLoading(true);
    try {
      const payload = {
        code: values.code,
        discount_type: values.discount_type,
        discount_value: Number(values.discount_value),
        valid_from: values.valid_from,
        valid_to: values.valid_to,
        usage_limit: values.usage_limit === "" ? 9999 : Number(values.usage_limit),
        active: values.active,
      };
      const { data, ok } = await api.put(`/voucher/${voucher._id}`, payload);
      if (!ok) return toast.error("Erreur lors de la mise à jour du code promo");
      setVoucher(data);
      toast.success("Code promo mis à jour avec succès !");
      navigate("/voucher");
    } catch (e) {
      toast.error("Erreur lors de la mise à jour du code promo");
    } finally {
      setLoading(false);
    }
  };

  const deleteVoucher = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce code promo ? Cette action est irréversible.")) return;

    try {
      const { ok } = await api.remove(`/voucher/${voucher._id}`);
      if (!ok) return toast.error("Erreur lors de la suppression du code promo");
      toast.success("Code promo supprimé avec succès !");
      navigate("/voucher");
    } catch (e) {
      toast.error("Erreur lors de la suppression du code promo");
    }
  };

  const discountDisplay = values.discount_type === "percentage" ? `${values.discount_value}%` : `${values.discount_value}€`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
          <input
            type="text"
            value={values.code}
            onChange={(e) => setValues({ ...values, code: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="active"
              checked={values.active}
              onChange={(e) => setValues({ ...values, active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Actif
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de réduction</label>
          <select
            value={values.discount_type}
            onChange={(e) => setValues({ ...values, discount_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="percentage">Pourcentage (%)</option>
            <option value="fixed">Montant fixe (€)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Valeur ({discountDisplay})</label>
          <input
            type="number"
            value={values.discount_value}
            onChange={(e) => setValues({ ...values, discount_value: e.target.value })}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Valide à partir du</label>
          <input
            type="datetime-local"
            value={values.valid_from ? new Date(values.valid_from).toISOString().slice(0, 16) : ""}
            onChange={(e) => setValues({ ...values, valid_from: e.target.value ? new Date(e.target.value).toISOString() : null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Valide jusqu'au</label>
          <input
            type="datetime-local"
            value={values.valid_to ? new Date(values.valid_to).toISOString().slice(0, 16) : ""}
            onChange={(e) => setValues({ ...values, valid_to: e.target.value ? new Date(e.target.value).toISOString() : null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Limite d'utilisation</label>
          <input
            type="number"
            value={values.usage_limit === 9999 || values.usage_limit === "" ? "" : values.usage_limit}
            onChange={(e) => setValues({ ...values, usage_limit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Utilisé</label>
          <input type="number" value={values.times_used || 0} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <LoadingButton loading={loading} onClick={updateVoucher} className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-semibold text-sm">
          Mettre à jour
        </LoadingButton>
        <button onClick={deleteVoucher} className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-all font-semibold text-sm">
          Supprimer
        </button>
      </div>
    </div>
  );
}
