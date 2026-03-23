import React from "react";

export default function RawData({ item }) {
    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">{JSON.stringify(item, null, 2)}</pre>
        </div>
    );
}
