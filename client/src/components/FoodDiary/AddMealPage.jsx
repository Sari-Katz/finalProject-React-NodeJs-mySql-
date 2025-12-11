import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddMealPage.css';

const AddMealPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError('');
        } else {
            setError('אנא בחרי קובץ תמונה בלבד.');
            setSelectedFile(null);
            setPreview(null);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            setError('יש לבחור תמונה לפני הניתוח.');
            return;
        }

        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('mealImage', selectedFile);

        try {
            // TODO: Replace with actual API call to your backend
            // const response = await api.post('/api/food-diary/analyze', formData);
            
            // For now, we'll simulate a delay and navigate with mock results
            console.log('Simulating sending image to backend for analysis...');
            await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate network & AI delay
            
            // The backend would return the identified foods and estimated calories
            const mockAnalysisResult = {
                foodItems: ['סלט ירקות גדול', 'חזה עוף בגריל (150 גרם)', 'כף טחינה גולמית'],
                estimatedCalories: 450,
            };

            // Navigate to a results page (we will create this next)
            navigate('/meal-analysis-result', { state: { analysis: mockAnalysisResult } });

        } catch (err) {
            setError('אופס, משהו השתבש בניתוח התמונה. נסו שוב.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="add-meal-container">
            <h1>העלאת ארוחה חדשה</h1>
            <p>צלמי או בחרי תמונה של הארוחה שלך, וה-AI שלנו ינתח אותה.</p>

            <div className="upload-box">
                <input 
                    type="file" 
                    id="meal-upload" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                />
                <label htmlFor="meal-upload" className="upload-label">
                    {preview ? <img src={preview} alt="תצוגה מקדימה" className="image-preview" /> : <span>📷 לחצי כאן לבחירת תמונה</span>}
                </label>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button onClick={handleAnalyze} disabled={isLoading || !selectedFile} className="analyze-btn">
                {isLoading ? 'מנתח את התמונה...' : 'נתחי את הארוחה'}
            </button>
        </div>
    );
};

export default AddMealPage;