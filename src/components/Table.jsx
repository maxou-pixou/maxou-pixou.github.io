import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Loader from "./Loader";

const Table = ({ header, sort, total, onSort, loading, children, fixed = false, sticky = false, height = "h-full", width = null }) => {
  if (total === 0 && !loading) return;
  return (
    <div className={`w-full border border-gray-200 rounded-lg overflow-x-auto shadow-sm bg-white ${height}`}>
      <table className={`w-full min-w-[900px] ${fixed ? "table-fixed" : ""}`}>
        <thead className={`text-left ${sticky ? "sticky top-0 z-10 bg-gray-50 shadow-md" : ""}`}>
          <tr className="border-b border-gray-200">
            {header.map((item, index) => (
              <th
                key={index}
                className={`p-3 py-4 whitespace-nowrap ${item.key && "bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"} ${item.width ? item.width : ""}`}
                colSpan={item.colSpan || 1}
                onClick={() => {
                  item.key && onSort(item.key);
                }}
              >
                <div
                  className={`flex items-center gap-3
                   ${item.position === "right" ? "justify-end" : item.position === "center" ? "justify-center" : item.position === "between" ? "justify-between" : "justify-start"
                    }`}
                >
                  <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">{item.title}</h3>
                  {item.key && (
                    <button className="flex flex-col justify-center text-black">
                      {sort[item.key] === 1 ? <IoIosArrowUp /> : sort[item.key] === -1 ? <IoIosArrowDown /> : <IoIosArrowDown className="opacity-0" />}
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="relative divide-y divide-gray-200">
          {total === 0 && !loading ? (
            <tr>
              <td colSpan={header.length} className="p-6 text-center text-sm text-gray-500">
                Aucune donnée trouvée
              </td>
            </tr>
          ) : loading ? (
            <tr>
              <td colSpan={header.length}>
                <Loader />
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
