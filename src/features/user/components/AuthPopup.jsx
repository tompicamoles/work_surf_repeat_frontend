import { Box, Modal } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { supabase } from "../../../tierApi/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { selectSession } from "../userSlice";

const AuthPopup = ({ isOpen, onClose }) => {
  const session = useSelector(selectSession);

  // Close modal when session changes to a valid session
  useEffect(() => {
    if (session) {
      onClose();
    }
  }, [session, onClose]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid",
    borderColor: "primary.main",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="auth-modal"
      aria-describedby="authentication-form"
    >
      <Box sx={style}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </Box>
    </Modal>
  );
};

export default AuthPopup;
