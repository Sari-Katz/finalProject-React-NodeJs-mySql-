import { useState } from "react";
import ApiUtils from "../../../utils/ApiUtils";
const api = new ApiUtils();

const AddClassForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    class_types: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    date_start: "",
  });

  const [errors, setErrors] = useState({});

  const daysOfWeek = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

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
      await api.post("http://localhost:3000/classes/create", formData);
      alert("קורס נוסף בהצלחה");
    } catch (err) {
      alert("שגיאה בהוספת הקורס");
      console.error(err);
    }

    setFormData({
      title: "",
      class_types: "",
      day_of_week: "",
      start_time: "",
      end_time: "",
      date_start: "",
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
          name="title"
          placeholder="שם הקורס"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <input
          type="text"
          name="class_types"
          placeholder="סוג האימון"
          value={formData.class_types}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.class_types && (
          <p className="text-red-500 text-sm">{errors.class_types}</p>
        )}
      </div>

      <div>
        <select
          name="day_of_week"
          value={formData.day_of_week}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">בחר יום בשבוע</option>
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        {errors.day_of_week && (
          <p className="text-red-500 text-sm">{errors.day_of_week}</p>
        )}
      </div>

      <div>
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.start_time && (
          <p className="text-red-500 text-sm">{errors.start_time}</p>
        )}
      </div>

      <div>
        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.end_time && (
          <p className="text-red-500 text-sm">{errors.end_time}</p>
        )}
      </div>

      <div>
        <input
          type="date"
          name="date_start"
          value={formData.date_start}
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

export default AddClassForm;
