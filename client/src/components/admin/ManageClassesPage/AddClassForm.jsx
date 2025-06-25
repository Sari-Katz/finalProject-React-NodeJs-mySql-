import { useState } from "react";
import ApiUtils from "../../../utils/ApiUtils";

const AddClassForm = ({ onClassAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    class_types: "",
    start_time: "",
    end_time: "",
    date_start: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


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

    // בדיקה נוספת - שעת התחלה לפני שעת סיום
    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
      newErrors.end_time = "שעת הסיום חייבת להיות אחרי שעת ההתחלה";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await ApiUtils.post("http://localhost:3000/classes", formData);
      // הצלחה!
      alert("קורס נוסף בהצלחה");
      
      // נקה את הטופס
      setFormData({
        title: "",
        class_types: "",
        start_time: "",
        end_time: "",
        date_start: "",
      });
      setErrors({});
      
      // עדכן את הרשימה ברכיב האב
      if (onClassAdded) {
        onClassAdded(response);
      }
      
    } catch (err) {
      console.error(err);
      // הצג את הודעת השגיאה מהשרת
      const errorMessage = err.response?.data?.message || "שגיאה בהוספת הקורס";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
        {errors.class_types && (
          <p className="text-red-500 text-sm">{errors.class_types}</p>
        )}
      </div>

      

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          שעת התחלה
        </label>
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
        {errors.start_time && (
          <p className="text-red-500 text-sm">{errors.start_time}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          שעת סיום
        </label>
        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        />
        {errors.end_time && (
          <p className="text-red-500 text-sm">{errors.end_time}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          תאריך השיעור
        </label>
        <input
          type="date"
          name="date_start"
          value={formData.date_start}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
          min={new Date().toISOString().split('T')[0]} // מניעת בחירת תאריך עבר
        />
        {errors.date_start && (
          <p className="text-red-500 text-sm">{errors.date_start}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "מוסיף קורס..." : "הוסף קורס"}
      </button>
    </form>
  );
};

export default AddClassForm;