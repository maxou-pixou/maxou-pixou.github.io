import React, { useState } from "react";
import { Link } from "react-router-dom";
import validator from "validator";
import toast from "react-hot-toast";
import { HiArrowLeft, HiCheckCircle } from "react-icons/hi2";
import { HiMail } from "react-icons/hi";

import LoadingButton from "../../components/LoadingButton";
import api from "../../services/api";

export default () => {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const send = async () => {
    setBtnLoading(true);
    try {
      if (!validator.isEmail(email)) return toast.error("Adresse email invalide");

      const { ok, data } = await api.post("/admin/forgot_password", { email });
      if (!ok) return toast.error(data?.message || "Erreur lors de l'envoi du lien de réinitialisation");

      toast.success("Lien de réinitialisation envoyé !");
      setDone(true);
    } catch (e) {
      console.log(e);
      toast.error("Une erreur est survenue");
    } finally {
      setBtnLoading(false);
    }
  };

  if (done) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl p-6">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <HiCheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">Email envoyé !</h1>

          <p className="text-center text-gray-600 mb-6">Un lien de réinitialisation du mot de passe a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et suivre les instructions.</p>

          <Link
            to="/auth"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-base font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all"
          >
            <HiArrowLeft className="h-5 w-5" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Mot de passe oublié ?</h1>
        <p className="text-center text-gray-600 mb-6">Entrez votre adresse email ci-dessous pour recevoir un lien de réinitialisation.</p>

        <div className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <HiMail className="mr-2 text-indigo-600" size={18} />
              Adresse email
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 placeholder-gray-400"
              placeholder="admin@exemple.com"
            />
          </div>

          <LoadingButton
            loading={btnLoading}
            onClick={send}
            disabled={!email}
            className="w-full py-3 rounded-lg text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50"
          >
            Envoyer le lien de réinitialisation
          </LoadingButton>

          <Link
            to="/auth"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            <HiArrowLeft className="h-5 w-5" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};
