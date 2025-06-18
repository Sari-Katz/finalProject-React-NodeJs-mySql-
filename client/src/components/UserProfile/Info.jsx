import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import ApiUtils from "../../utils/ApiUtils";
import { Container, Typography, Box, Avatar, Paper, Stack, TextField, Button } from "@mui/material";
import {
    Email as EmailIcon, 
    LocationOn as LocationIcon, 
    Phone as PhoneIcon, 
    Person as PersonIcon,
    EmojiEvents as CrownIcon, 
    Edit as EditIcon, 
    Save as SaveIcon, 
    Cancel as CancelIcon,
    ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import InfoRow from "./InfoRow";

const apiUtils = new ApiUtils();

const Info = ({ onBack }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [editData, setEditData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await apiUtils.get(`http://localhost:3000/users/me`);
                setUserInfo(data);
                setEditData(data);
            } catch (err) {
                console.error("Error fetching user info:", err);
            }
        };
        fetchUserInfo();
    }, [user.id]);

    const handleEditChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const updated = await apiUtils.put(
                `http://localhost:3000/users/${user.id}`,
                { body: editData }
            );
            setUserInfo({ ...editData });
            setEditMode(false);
        } catch (err) {
            console.error("Error saving user info:", err);
        }
    };

    if (!userInfo) {
        return (
            <Container maxWidth="sm" sx={{ py: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Typography>טוען פרטי משתמש...</Typography>
            </Container>
        );
    }

    const firstLetter = (editMode ? editData.username : userInfo.username)?.charAt(0)?.toUpperCase() || 
                       userInfo.full_name?.charAt(0)?.toUpperCase() || "?";

    return (
        <Container maxWidth="sm" sx={{ py: 6, background: "linear-gradient(to bottom right, #e0f7fa, #e3f2fd)", direction: "rtl" }}>
            <Box sx={{ position: "relative", textAlign: "center" }}>
                {/* Back Button */}
                {onBack && (
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={onBack}
                        sx={{
                            position: 'absolute',
                            top: -20,
                            right: 0,
                            mb: 2,
                            color: '#064e1d',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: 'rgba(6, 78, 29, 0.1)'
                            }
                        }}
                    >
                        חזרה לפרופיל
                    </Button>
                )}
                
                <Avatar sx={{
                    width: 130, 
                    height: 130,
                    bgcolor: "#064e1d",
                    color: "white",
                    fontSize: 60,
                    fontWeight: "bold",
                    mx: "auto",
                    mb: 3,
                    boxShadow: 4,
                    border: "4px solid white",
                    position: "absolute",
                    top: -70,
                    left: "50%",
                    transform: "translateX(-50%)"
                }}>
                    {firstLetter}
                </Avatar>
                
                <Paper elevation={3} sx={{ pt: 10, pb: 5, px: 4, borderRadius: 6, backgroundColor: "white" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: "#064e1d" }} gutterBottom>
                            פרטי משתמש
                        </Typography>
                        {editMode ? (
                            <Box display="flex" gap={1}>
                                <Button 
                                    startIcon={<SaveIcon />} 
                                    variant="contained"
                                    sx={{ backgroundColor: "#27ae60", '&:hover': { backgroundColor: "#2ecc71" } }}
                                    onClick={handleSave}
                                >
                                    שמור
                                </Button>
                                <Button 
                                    startIcon={<CancelIcon />} 
                                    variant="outlined"
                                    color="error" 
                                    onClick={() => { 
                                        setEditMode(false); 
                                        setEditData(userInfo); 
                                    }}
                                >
                                    ביטול
                                </Button>
                            </Box>
                        ) : (
                            <Button 
                                startIcon={<EditIcon />} 
                                variant="outlined"
                                sx={{ 
                                    borderColor: "#064e1d", 
                                    color: "#064e1d",
                                    '&:hover': { 
                                        borderColor: "#0a6b24", 
                                        backgroundColor: "rgba(6, 78, 29, 0.1)" 
                                    }
                                }}
                                onClick={() => setEditMode(true)}
                            >
                                ערוך
                            </Button>
                        )}
                    </Box>
                    
                    <Stack spacing={2} mt={4}>
                        <InfoRow 
                            icon={<PersonIcon sx={{ color: "#064e1d" }} />} 
                            label="שם מלא" 
                            value={editData.full_name} 
                            editable={editMode} 
                            onChange={val => handleEditChange("full_name", val)} 
                        />
                        <InfoRow 
                            icon={<EmailIcon sx={{ color: "#2196f3" }} />} 
                            label="אימייל" 
                            value={editData.email} 
                            editable={editMode} 
                            onChange={val => handleEditChange("email", val)} 
                        />
                        <InfoRow 
                            icon={<PhoneIcon sx={{ color: "#4caf50" }} />} 
                            label="טלפון" 
                            value={editData.phone} 
                            editable={editMode} 
                            onChange={val => handleEditChange("phone", val)} 
                        />
                        {userInfo.role === "admin" && (
                            <InfoRow 
                                icon={<CrownIcon sx={{ color: "#fdd835" }} />} 
                                label="הרשאה" 
                                value="יש לך הרשאת מנהל" 
                            />
                        )}
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );
};

export default Info;