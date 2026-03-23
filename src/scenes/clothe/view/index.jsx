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

export default function ClotheView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState();
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(INFORMATION);

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        setLoading(true);
        try {
            const { data, ok } = await api.get(`/clothe/${id}`);
            if (!ok) return toast.error("Erreur lors de la récupération des données de l'article");
            setItem(data);
        } catch (e) {
            toast.error("Erreur lors de la récupération des données de l'article");
        }
        setLoading(false);
    };

    if (loading || !item) return <Loader />;

    return (
        <div className="p-6 space-y-6">
            <button onClick={() => navigate("/clothe")} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
                <HiArrowLeft className="h-4 w-4" />
                Retour aux vêtements
            </button>

            <nav className="flex items-center gap-2">
                <TabItem tab={INFORMATION} title="Informations" setTab={setTab} active={tab === INFORMATION} />
                <TabItem tab={RAW_DATA} title="Données brutes" setTab={setTab} active={tab === RAW_DATA} />
            </nav>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                {tab === INFORMATION && item && <Information item={item} setItem={setItem} />}
                {tab === RAW_DATA && item && <RawData item={item} />}
            </div>
        </div>
    );
}
