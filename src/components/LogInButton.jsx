import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";


export const LogInButton = ({context}) => {
    const {loginWithRedirect} = useAuth0();


    return(
        <Button  color={context === "navBar" ? "secondary" : "primary"} variant="contained" onClick={() => loginWithRedirect()} >Log In</Button>
    )
}