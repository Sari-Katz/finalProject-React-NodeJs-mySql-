import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiUtils from "../../../utils/ApiUtils";

const api = new ApiUtils();

const ChallengeSearch = ({ openCompletedListModal }) => {
    const [challenges, setchallenges] = useState([]);
    const [page, setPage] = useState(0);
    const [expandedId, setExpandedId] = useState(null);
    const limit = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchchallenges = async () => {
            try {
                const res = await api.get(
                    `http://localhost:3000/challenges?limit=${limit}&offset=${page * limit}`
                );
                setchallenges(res);
            } catch (err) {
                console.error("בעיה בשליפת שיעורים", err);
                setchallenges([]);
            }
        };
        fetchchallenges();
    }, [page]);



    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-lg">חפש את האתגר המבוקש </h3>


            <ul className="divide-y border rounded max-h-60 overflow-auto">
                {challenges.length > 0 ? (
                    challenges.map((c) => (
                        <li
                            key={c.id}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                        >
                            <div className="flex flex-col gap-2">
                                <span className="font-medium">{c.description}</span>
                                {expandedId === c.id && (
                                    <div className="flex gap-2">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExpandedId(null); // סגור את ההרחבה
                                                openCompletedListModal(c)
                                            }}
                                        >
                                            הצג משתתפים
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="p-3 text-gray-500">לא נמצאו אתגרים </li>
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
                    disabled={challenges.length < limit}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    הבא
                </button>
            </div>
        </div>
    );
};


export default ChallengeSearch
