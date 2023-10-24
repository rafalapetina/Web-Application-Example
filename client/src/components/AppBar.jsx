import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useLocation, useNavigate } from "react-router-dom";
import { ClickAwayListener, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";

const AppNavBar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = props.user.id ? true : false;
  const canEdit = props.user.role == "admin" && location.pathname === "/";
  const [title, setTitle] = useState(props.title);
  const [titleChanged, setTitleChanged] = useState(false);

  useEffect(() => {
    setTitle(props.title);
  }, [props.title]);

  const changeAppTitle = () => {
    if (titleChanged) props.updateAppTitle(title);
    setTitleChanged(false);
  };

  const onClickLogin = () => {
    isLoggedIn ? props.logOut() : navigate("/login");
  };

  return (
    <Box sx={{ zIndex: 1, mt: "80px" }}>
      <AppBar component="nav" sx={{ zIndex: 2 }}>
        <Toolbar>
          {canEdit ? (
            <ClickAwayListener onClickAway={changeAppTitle}>
              <TextField
                label="App Title"
                variant="outlined"
                sx={{ input: { color: "white" } }}
                size="small"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setTitleChanged(true);
                }}
              />
            </ClickAwayListener>
          ) : (
            <Link
              href=""
              onClick={() => {
                navigate("/");
              }}
              variant="h6"
              component="div"
              sx={{
                color: "#fff",
                ":hover": {
                  cursor: "pointer",
                },
              }}
            >
              {props.title}
            </Link>
          )}

          <Box sx={{ flexGrow: 1 }}></Box>
          {isLoggedIn ? (
            <Typography sx={{ fontWeight: "light", pr: 1 }}>
              Logged in as <b>{props.user.username}</b>
            </Typography>
          ) : (
            <></>
          )}
          {location.pathname == "/" ? (
            <Box>
              <Button sx={{ color: "#fff" }} onClick={onClickLogin}>
                {isLoggedIn ? "Logout" : "Login"}
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppNavBar;
