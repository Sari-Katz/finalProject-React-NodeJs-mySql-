import React, { useEffect, useState } from "react";
import { useUser } from "../UserContext";
import ApiUtils from "../../utils/ApiUtils";
import { Container, Typography, Box, Avatar, Paper, Stack, TextField, Button } from "@mui/material";
import {
    Email as EmailIcon, LocationOn as LocationIcon, Phone as PhoneIcon, Person as PersonIcon,
    EmojiEvents as CrownIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGlobalMessage } from "../GlobalMessageContext";
import InfoRow from "./InfoRow";
const apiUtils = new ApiUtils();

const Info = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [editData, setEditData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const { currentUser, setCurrentUser } = useUser();
    const { showMessage } = useGlobalMessage();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser.id == "") {
            navigate("/login");
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const data = await apiUtils.get(`http://localhost:3000/users/${userId}`);
                setUserInfo(data);
                setEditData(data);
            } catch (err) {
                console.error("Error fetching user info:", err);
                showMessage(err.message, "error");
            }
        };
        fetchUserInfo();
    }, [currentUser, navigate]);

    const handleEditChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const updated = await apiUtils.put(
                `http://localhost:3000/users/${currentUser.id}`,
                { body: editData }
            );
            setUserInfo({ ...editData });
            setCurrentUser(prev => ({
                ...prev,
                username: updated.username,
                email: updated.email,
            }));
            setEditMode(false);
        } catch (err) {
            console.error("Error saving user info:", err);
            showMessage("שגיאה בשמירת פרטי החשבון", "error");
        }
    };

    if (!userInfo) {
        return null;
    }

    const firstLetter = (editMode ? editData.username : userInfo.username)?.charAt(0)?.toUpperCase() || "";

    return (
        <Container maxWidth="sm" sx={{ py: 6, background: "linear-gradient(to bottom right, #e0f7fa, #e3f2fd)", direction: "rtl" }}>
            <Box sx={{ position: "relative", textAlign: "center" }}>
                <Avatar sx={{
                    width: 130, height: 130,
                    bgcolor: "teal.400",
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
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4" fontWeight="bold" color="teal.700" gutterBottom>פרטי משתמש</Typography>
                        {editMode ? (
                            <>
                                <Button startIcon={<SaveIcon />} color="success" onClick={handleSave}>שמור</Button>
                                <Button startIcon={<CancelIcon />} color="error" onClick={() => { setEditMode(false); setEditData(userInfo); }}>ביטול</Button>
                            </>
                        ) : (
                            <Button startIcon={<EditIcon />} onClick={() => setEditMode(true)}>ערוך</Button>
                        )}
                    </Box>
                    <Stack spacing={2} mt={4}>
                        <InfoRow icon={<PersonIcon color="primary" />} label="שם משתמש" value={editData.full_name} editable={editMode} onChange={val => handleEditChange("username", val)} />
                        <InfoRow icon={<EmailIcon color="info" />} label="אימייל" value={editData.email} editable={editMode} onChange={val => handleEditChange("email", val)} />
                        <InfoRow icon={<PhoneIcon color="success" />} label="טלפון" value={editData.phone} editable={editMode} onChange={val => handleEditChange("phone", val)} />
                        {userInfo.role === "admin" && (
                            <InfoRow icon={<CrownIcon sx={{ color: "#fdd835" }} />} label="הרשאה" value="יש לך הרשאת מנהל" />
                        )}
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );
};

export default Info;