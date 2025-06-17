import React from "react";
import { Box, Typography, TextField } from "@mui/material";

const InfoRow = ({ icon, label, value, editable = false, onChange }) => (
  <Box
    display="flex"
    alignItems="center"
    gap={2}
    p={1.5}
    borderRadius={3}
    sx={{
      backgroundColor: "#e0f2f1",
      flexDirection: "row-reverse",
      "&:hover": { backgroundColor: "#b2dfdb" },
      transition: "0.3s"
    }}
  >
    <Box>{icon}</Box>
    <Typography variant="subtitle1" fontWeight="medium" sx={{ minWidth: "100px", color: "teal.800" }}>
      {label}:
    </Typography>
    {editable ? (
      <TextField
        variant="standard"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        fullWidth
        sx={{ direction: "rtl", textAlign: "right" }}
      />
    ) : (
      <Typography variant="body1" fontWeight="bold" sx={{ color: "teal.900" }}>
        {value}
      </Typography>
    )}
  </Box>
);

export default InfoRow;
