import React from "react";
import { Route, Routes } from "react-router-dom";

import List from "./list";
import View from "./view/index";
export default function Voucher() {
    return (
        <Routes >
            <Route path="/:id" element={<View />} />
            <Route path="/" element={<List />} />
        </Routes >
    );
}
