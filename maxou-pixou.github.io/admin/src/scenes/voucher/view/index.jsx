import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiArrowLeft } from "react-icons/hi2";

import Loader from "../../../components/Loader";
import TabItem from "../../../components/TabItem";
import api from "../../../services/api";

import Information from "./Information";
import RawData from "./RawData";

const INFORMATION = "INFORMATION";
const RAW_DATA = "RAW_DATA";

export default function VoucherView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState();
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(INFORMATION);

    useEffect(() => {
        fetchVoucher();
    }, [id]);

    const fetchVoucher = async () => {
        setLoading(true);
        try {
            const { data, ok } = await api.get(`/voucher/${id}`);
            if (!ok) return toast.error("Erreur lors de la récupération du code promo");
            setItem(data);
        } catch (e) {
            toast.error("Erreur lors de la récupération du code promo");
        }
        setLoading(false);
    };

    if (loading) return <Loader />;

    return (
        <div className="p-6 space-y-6">
            <button onClick={() => navigate("/voucher")} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
                <HiArrowLeft className="h-4 w-4" />
                Retour aux codes promo
            </button>

            <nav className="flex items-center gap-2">
                <TabItem tab={INFORMATION} title="Informations" setTab={setTab} active={tab === INFORMATION} />
                <TabItem tab={RAW_DATA} title="Données brutes" setTab={setTab} active={tab === RAW_DATA} />
            </nav>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                {tab === INFORMATION && item && <Information voucher={item} setVoucher={setItem} />}
                {tab === RAW_DATA && item && <RawData voucher={item} />}
            </div>
        </div>
    );
}
