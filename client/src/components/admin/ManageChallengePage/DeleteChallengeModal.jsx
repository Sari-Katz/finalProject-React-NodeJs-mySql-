import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ApiUtils from "../../../utils/ApiUtils";

const DeleteChallengeModal = ({ onClose, onDeleteSuccess }) => {
    const [searchParams] = useSearchParams();
    const challengeId = searchParams.get("challengeId");
    const title = searchParams.get("description"); 
    const [sending, setSending] = useState(false);

    const handleDelete = async () => {
        setSending(true);
        try {
            await ApiUtils.delete(`http://localhost:3000/challenges/${challengeId}`);
            onDeleteSuccess();
        } catch (err) {
            console.error("שגיאה במחיקת אתגר", err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white max-w-md w-full p-6 rounded shadow relative">
                <button className="absolute top-2 left-2 text-gray-500" onClick={onClose}>
                    ✕
                </button>
                <div>
                    <h2 className="text-xl font-bold mb-4">
                        האם אתה בטוח שברצונך למחוק את האתגר?
                    </h2>
                    <p className="mb-4">{title}</p>
                    <div className="flex justify-end gap-4">
                        <button
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            ביטול
                        </button>
                        <button
                            disabled={sending}
                            className="bg-red-600 text-white px-4 py-2 rounded"
                            onClick={handleDelete}
                        >
                            {sending ? "מוחק..." : "מחק את האתגר"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteChallengeModal;
