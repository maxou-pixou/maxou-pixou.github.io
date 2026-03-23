import React from "react";
import { Route, Routes } from "react-router-dom";

import List from "./list";
import BoxView from "./view/index";

export default function Index() {
    return (
        <Routes>
            <Route path="/:id" element={<BoxView />} />
            <Route path="/" element={<List />} />
        </Routes>
    );
}
