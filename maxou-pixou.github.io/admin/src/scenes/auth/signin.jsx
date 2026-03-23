import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiLockClosed, HiEye, HiEyeSlash } from "react-icons/hi2";
import { HiMail } from "react-icons/hi";

import useStore from "../../store";
import api from "../../services/api";
import LoadingButton from "../../components/LoadingButton";

export default () => {
  const { user, setUser } = useStore();
  const [seePassword, setSeePassword] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { ok, data, user, token } = await api.post(`/admin/signin`, values);
      if (!ok) {
        toast.error(data.message || "Erreur de connexion");
        setBtnLoading(false);
        return;
      }

      if (token) api.setToken(token);
      if (user) setUser(user);
    } catch (e) {
      console.error(e);
      toast.error("Une erreur est survenue");
    } finally {
      setBtnLoading(false);
    }
  };

  if (user) return <Navigate to="/" />;

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Panneau d'administration</h1>
        <p className="text-center text-gray-600 mb-6">Connectez-vous à votre compte administrateur</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <HiMail className="mr-2 text-black" size={18} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all text-gray-900 placeholder-gray-400 outline-none"
              placeholder="admin@exemple.com"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <HiLockClosed className="mr-2 text-black" size={18} />
                Mot de passe
              </label>
              <Link className="text-sm text-gray-600 hover:text-black transition-colors" to="/auth/forgot">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <input
                type={seePassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all text-gray-900 outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setSeePassword(!seePassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {seePassword ? <HiEyeSlash size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          <LoadingButton
            loading={btnLoading}
            className="w-full py-3 rounded-lg text-base font-semibold text-white bg-black hover:bg-gray-800 shadow-lg shadow-black/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!values?.email || !values?.password}
            type="submit"
          >
            Se connecter
          </LoadingButton>
        </form>
      </div>
    </div>
  );
};
