import { useState } from "react";
import ApiUtils from "../../../utils/ApiUtils";
const api = new ApiUtils();

const AddChallengeForm = () => {
    const [formData, setFormData] = useState({
        description: "",
        week_start_date: "",
    });

    const [errors, setErrors] = useState({});


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // מנקה את השגיאה כשמשנים ערך
    };

    const validate = () => {
        const newErrors = {};
        for (let key in formData) {
            if (!formData[key]) {
                newErrors[key] = "שדה חובה";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await api.post("http://localhost:3000/challenges/create", formData);
            alert("אתגר נוסף בהצלחה");
        } catch (err) {
            alert("שגיאה בהוספת האתגר");
            console.error(err);
        }

        setFormData({
            description: "",
            week_start_date: "",
        });
        setErrors({});
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md mx-auto p-6 border rounded-2xl shadow-md bg-white"
        >
            <h2 className="text-xl font-bold text-center">הוספת קורס חדש</h2>

            <div>
                <input
                    type="text"
                    name="description"
                    placeholder="תיאור על האתגר"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>


            <div>
                <input
                    type="date"
                    name="week_start_date"
                    value={formData.week_start_date}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                {errors.date_start && (
                    <p className="text-red-500 text-sm">{errors.date_start}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                הוסף קורס
            </button>
        </form>
    );
};

export default AddChallengeForm;
