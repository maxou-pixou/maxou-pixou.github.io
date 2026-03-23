import React, { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { HiLockClosed, HiEye, HiEyeSlash, HiArrowLeft } from "react-icons/hi2";
import { HiMail } from "react-icons/hi";
import { FiUser } from "react-icons/fi";

import useStore from "../../store";
import api from "../../services/api";
import LoadingButton from "../../components/LoadingButton";

export default () => {
  const navigate = useNavigate();
  const { user, setUser } = useStore();
  const [seePassword, setSeePassword] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { ok, data, user, token } = await api.post(`/admin/signup`, values);
      if (!ok) return toast.error(data?.message || "Erreur lors de la création du compte");

      if (token) api.setToken(token);
      if (user) setUser(user);
      toast.success("Compte créé avec succès !");
      navigate("/");
    } catch (e) {
      console.log("e", e);
      toast.error(e.code || "Erreur lors de la création du compte");
    } finally {
      setBtnLoading(false);
    }
  };

  if (user) return <Navigate to="/" />;

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Créer un compte administrateur</h1>
        <p className="text-center text-gray-600 mb-6">Configurez votre compte administrateur</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FiUser className="mr-2 text-indigo-600" size={18} />
              Nom
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 placeholder-gray-400"
              placeholder="Entrez votre nom"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <HiMail className="mr-2 text-indigo-600" size={18} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-900 placeholder-gray-400"
              placeholder="admin@exemple.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <HiLockClosed className="mr-2 text-indigo-600" size={18} />
              Mot de passe
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
            <p className="text-xs text-gray-500 mt-2">Minimum 6 caractères</p>
          </div>

          <LoadingButton
            loading={btnLoading}
            className="w-full py-3 rounded-lg text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!values?.name || !values?.email || !values?.password}
            type="submit"
          >
            Créer un compte
          </LoadingButton>

          <Link
            to="/auth"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            <HiArrowLeft className="h-5 w-5" />
            Retour à la connexion
          </Link>
        </form>
      </div>
    </div>
  );
};
