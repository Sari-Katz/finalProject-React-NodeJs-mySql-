import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ApiUtils from "../../../utils/ApiUtils";

const ChallengeSearch = ({ refreshKey }) => {
  const [challenges, setChallenges] = useState([]);
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = 10;

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiUtils.get(
        `http://localhost:3000/challenges?limit=${limit}&offset=${page * limit}`
      );
      setChallenges(res);
    } catch (err) {
      console.error("שגיאה בטעינת אתגרים", err);
      setError("בעיה בטעינת האתגרים");
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [page]);

  useEffect(() => {
    if (refreshKey > 0) {
      fetchChallenges();
    }
  }, [refreshKey]);

  const handleAction = (c, action) => {
    if (action === "participants") {
      setSearchParams({
        challengeId: c.id,
        view: "participants",
        description: c.description,
      });
    } else if (action === "delete") {
      setSearchParams({
        challengeId: c.id,
        view: "delete",
        description: c.description,
      });
    }
    setExpandedId(null);
  };

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">רשימת אתגרים</h3>

      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
          <button onClick={fetchChallenges} className="mr-2 text-blue-600 underline">
            נסה שוב
          </button>
        </div>
      )}

      <ul className="divide-y border rounded max-h-60 overflow-auto">
        {challenges.length > 0 ? (
          challenges.map((c) => (
            <li
              key={c.id}
              className="p-3 hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => toggleExpanded(c.id)}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{c.description}</span>
                  <span className="text-xs text-gray-400">
                    {expandedId === c.id ? "▼" : "▶"}
                  </span>
                </div>

                {expandedId === c.id && (
                  <div className="flex gap-2 pt-2 border-t">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(c, "participants");
                      }}
                    >
                      הצג משתתפים
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(c, "delete");
                      }}
                    >
                      מחק אתגר
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="p-3 text-gray-500 text-center">
            {loading ? "טוען..." : "לא נמצאו אתגרים"}
          </li>
        )}
      </ul>

      <div className="flex justify-between items-center">
        <button
          disabled={page === 0 || loading}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          ← קודם
        </button>

        <span className="text-sm text-gray-600">עמוד {page + 1}</span>

        <button
          disabled={challenges.length < limit || loading}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          הבא →
        </button>
      </div>

      {challenges.length > 0 && (
        <div className="text-xs text-gray-500 text-center">
          מוצגים {challenges.length} אתגרים
        </div>
      )}
    </div>
  );
};

export default ChallengeSearch;
