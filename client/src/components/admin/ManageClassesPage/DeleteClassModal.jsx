import { useState } from "react";
import ApiUtils from "../../../utils/ApiUtils";


const DeleteClassModal = ({ classData, onClose, onDeleteSuccess }) => {
    const [confirmStep, setConfirmStep] = useState(false);
    const [sending, setSending] = useState(false);
    const [notifyParticipants, setNotifyParticipants] = useState(false);

    const handleDelete = async () => {
        setSending(true);
        try {
            await ApiUtils.delete(`http://localhost:3000/classes/${classData.id}?notify=${notifyParticipants}`);
            onDeleteSuccess();
        } catch (err) {
            console.error("שגיאה במחיקת שיעור", err);
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

                {!confirmStep ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">האם אתה בטוח שברצונך למחוק את השיעור?</h2>
                        <p className="mb-4">{classData.title}</p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={onClose}
                            >
                                ביטול
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => setConfirmStep(true)}
                            >
                                כן, המשך למחיקה
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">האם לשלוח הודעה למשתתפים על ביטול השיעור?</h3>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={notifyParticipants}
                                onChange={(e) => setNotifyParticipants(e.target.checked)}
                            />
                            שלח הודעת ביטול לכל הנרשמים במייל
                        </label>
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
                                {sending ? "מוחק..." : "מחק את השיעור"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeleteClassModal;
