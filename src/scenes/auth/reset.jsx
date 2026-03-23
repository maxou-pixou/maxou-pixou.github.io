import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import toast from "react-hot-toast";
import { HiLockClosed, HiEye, HiEyeSlash, HiCheckCircle } from "react-icons/hi2";

import LoadingButton from "../../components/LoadingButton";
import api from "../../services/api";

export default ({ location }) => {
  const navigate = useNavigate();
  const [seePassword, setSeePassword] = useState(false);
  const [values, setValues] = useState({ password: "", password1: "" });
  const [btnLoading, setBtnLoading] = useState(false);

  const send = async () => {
    if (values.password.length < 6) return toast.error("Le mot de passe doit contenir au moins 6 caractères");

    setBtnLoading(true);
    try {
      const { token } = queryString.parse(location.search);
      const { ok, data } = await api.post("/admin/forgot_password_reset", {
        password: values.password,
        token,
      });
      if (!ok) return toast.error(data?.message || "Erreur lors de la réinitialisation du mot de passe");

      toast.success("Mot de passe réinitialisé avec succès !");
      navigate("/auth");
    } catch (e) {
      console.log(e);
      toast.error("Une erreur est survenue");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Créer un nouveau mot de passe</h1>
        <p className="text-center text-gray-600 mb-6">Entrez votre nouveau mot de passe ci-dessous</p>

        <div className="space-y-4">
          {/* Password Requirements */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <HiCheckCircle className="text-indigo-600 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-indigo-900">
                <p className="font-medium mb-1">Exigences du mot de passe :</p>
                <ul className="text-indigo-700 space-y-0.5">
                  <li>• Minimum 6 caractères</li>
                  <li>• Au moins une lettre</li>
                </ul>
              </div>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <HiLockClosed className="mr-2 text-indigo-600" size={18} />
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={seePassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setSeePassword(!seePassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {seePassword ? <HiEyeSlash size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          <LoadingButton
            loading={btnLoading}
            disabled={!values.password}
            className="w-full py-3 rounded-lg text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50"
            onClick={send}
          >
            Réinitialiser le mot de passe
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};
