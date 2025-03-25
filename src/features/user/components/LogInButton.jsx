import React, { useState } from 'react';
import { Button } from '@mui/material';
import AuthPopup from './AuthPopup';

export const LogInButton = ({ context }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsPopupOpen(true)}
        variant={context === "navBar" ? "contained" : "outlined"}
        color="primary"
      >
        Log In
      </Button>
      <AuthPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </>
  );
};