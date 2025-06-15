import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiUtils from "../../../utils/ApiUtils";

const api = new ApiUtils();

const ClassSearch = ({ openParticipantsModal, openDeleteModal }) => {
  const [query, setQuery] = useState("");
  const [classes, setClasses] = useState([]);
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const limit = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get(
          `http://localhost:3000/classes?search=${query}&limit=${limit}&offset=${page * limit}`
        );
        setClasses(res);
      } catch (err) {
        console.error("בעיה בשליפת שיעורים", err);
        setClasses([]);
      }
    };
    fetchClasses();
  }, [query, page]);

 const handleAction = (c, action) => {
  if (action === "participants") {
    openParticipantsModal(c);
  } else if (action === "delete") {
    openDeleteModal(c);
  }
};


  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">חפש שיעור קיים</h3>

      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(0);
        }}
        placeholder="הקלד שם שיעור…"
        className="w-full p-2 border rounded"
      />

      <ul className="divide-y border rounded max-h-60 overflow-auto">
        {classes.length > 0 ? (
          classes.map((c) => (
            <li
              key={c.id}
              className="p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
            >
              <div className="flex flex-col gap-2">
                <span className="font-medium">{c.title}</span>
                {expandedId === c.id && (
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                          setExpandedId(null); // סגור את ההרחבה

                        handleAction(c, "participants");
                      }}
                    >
                      הצג משתתפים
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                          setExpandedId(null); // סגור את ההרחבה

                        handleAction(c, "delete");
                      }}
                    >
                      מחק שיעור
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="p-3 text-gray-500">לא נמצאו שיעורים</li>
        )}
      </ul>

      <div className="flex justify-between">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          קודם
        </button>
        <button
          disabled={classes.length < limit}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          הבא
        </button>
      </div>
    </div>
  );
};

export default ClassSearch;
