export default function RawData({ voucher }) {
    return (
        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs text-gray-700">
            {JSON.stringify(voucher, null, 2)}
        </pre>
    );
}
