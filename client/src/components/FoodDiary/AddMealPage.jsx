import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddMealPage.module.css';
import ApiUtils from '../../utils/ApiUtils';
import { useLocation } from 'react-router-dom';



const AddMealPage = () => {
    const location = useLocation();
    const { remainingCalories } = location.state || {}; 
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [description, setDescription] = useState('');
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
        if (!selectedFile && !description) {
            setError('יש לבחור תמונה או להזין תיאור לפני הניתוח.');
            return;
        }

        setIsLoading(true);
        setError('');

        const formData = new FormData();
        if (selectedFile) {
            formData.append('mealImage', selectedFile);
        }
        formData.append('description', description);

        try {
            const response = await ApiUtils.post(
                `${import.meta.env.VITE_API_URL}/food-diary/analyze`,
                formData
            );
            console.log('Analysis response:', response);

            navigate('/calorie-dashboard/meal-analysis-result', {
                state: {
                    analysis: response,
                    remainingCalories
                }
            });


        } catch (err) {
            setError('אופס, משהו השתבש בניתוח התמונה. נסי שוב.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreview(null);
    };

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.backButton}
                onClick={() => navigate(-1)}
                aria-label="חזרה אחורה"
            >
                ← חזרה
            </button>

            <header className={styles.header}>
                <div className={styles.headerIcon}>📸</div>
                <h1 className={styles.mainTitle}>העלאת ארוחה חדשה</h1>
                <p className={styles.subtitle}>צלמי או בחרי תמונה של הארוחה שלך, וה-AI שלנו ינתח אותה</p>
            </header>

            <div className={styles.contentSection}>
                {/* Upload Box */}
                <div className={styles.uploadBox}>
                    <input
                        type="file"
                        id="meal-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="meal-upload" className={styles.uploadLabel}>
                        {preview ? (
                            <div className={styles.previewContainer}>
                                <img src={preview} alt="תצוגה מקדימה" className={styles.imagePreview} />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className={styles.removeBtn}
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className={styles.uploadPlaceholder}>
                                <div className={styles.uploadIcon}>📷</div>
                                <span className={styles.uploadText}>לחצי כאן לבחירת תמונה</span>
                                <span className={styles.uploadHint}>או גררי תמונה לכאן</span>
                            </div>
                        )}
                    </label>
                </div>

                {/* Divider */}
                <div className={styles.divider}>
                    <span className={styles.dividerText}>או</span>
                </div>

                {/* Description Box */}
                <div className={styles.descriptionBox}>
                    <label htmlFor="meal-description" className={styles.descriptionLabel}>
                        תארי את הארוחה במילים:
                    </label>
                    <textarea
                        id="meal-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="לדוגמה: סלט קינואה עם ירקות צלויים וחזה עוף, כוס אורז מלא, ועוגיית שוקולד קטנה"
                        rows="5"
                        className={styles.textarea}
                    />
                </div>

                {/* Error Message */}
                {error && <p className={styles.errorMessage}>{error}</p>}

                {/* Analyze Button */}
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || (!selectedFile && !description)}
                    className={styles.analyzeBtn}
                >
                    {isLoading ? (
                        <>
                            <span className={styles.spinner}></span>
                            מנתח את הארוחה...
                        </>
                    ) : (
                        <>
                            <span className={styles.btnIcon}>🤖</span>
                            נתח את הארוחה
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddMealPage;