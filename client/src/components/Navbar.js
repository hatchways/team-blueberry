import React, { useState, useContext } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import CodeIcon from "@material-ui/icons/Code";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Link } from "react-router-dom";
import AddCodeDialog from "./UploadCode";
import Notifications from "./Notifications";
import userContext from "../userContext";
// import logout api
import logout from "../services/logout";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "sticky",
    top: 0,
    zIndex: 1200,
  },
  title: {
    flex: 1,
  },
  navLink: {
    textDecoration: "none",
    color: theme.palette.primary.white,
    marginRight: theme.spacing(3),
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
  },
  menuLink: {
    textDecoration: "none",
    color: theme.palette.secondary,
  },
  avatar: {
    display: "flex",
    marginRight: theme.spacing(1),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  notification: {
    backgroundColor: "#4d2899",
  },
  upload: {
    borderRadius: 50,
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(3),
  },
  buttonMenu: {
    textTransform: "none",
    color: theme.palette.primary.white,
  },
}));

const Navbar = ({ state, dispatch }) => {
  const user = useContext(userContext);
  const classes = useStyles();

  // Open UploadCode dialog
  const [open, setOpen] = useState(false);

  // navbar logic
  // const [anchorNotificaton, setAnchorNotificaton] = useState(null);
  const [anchorMenu, setAnchorMenu] = useState(null);

  // handle UploadCode open/close
  const handleClose = () => {
    setOpen(false);
  };

  // // notification
  // const handleNotificaton = (event) => {
  //   setAnchorNotificaton(event.currentTarget);
  // };

  // // close notification
  // const handleCloseNotificaton = () => {
  //   setAnchorNotificaton(null);
  // };

  // add review logic --> populating notifications

  // open menu
  const handleClickMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  // close menu and route to link
  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  // add logout functionality
  const handleLogout = () => {
    logout(dispatch);
    setAnchorMenu(null);
  };

  // add responsiveness
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <div className={classes.root}>
      <AddCodeDialog
        open={open}
        dispatch={dispatch}
        handleClose={handleClose}
      />
      <AppBar position="static" color="secondary">
        <Toolbar>
          <div className={classes.title}>
            {/* brand icon placeholder */}
            <CodeIcon fontSize="large" />
          </div>
          {isMobile ? (
            // need to decide styling on mobile
            <IconButton edge="start" color="inherit">
              <MenuIcon fontSize="large" />
            </IconButton>
          ) : (
            <>
              <Link to="/reviews" className={classes.navLink}>
                Reviews
              </Link>
              <Link to="/balance" className={classes.navLink}>
                Balance
              </Link>
              {/* Populating notifications with badge --> show number of notifications? */}
              <Notifications />
              <Button
                color="primary"
                variant="outlined"
                className={classes.upload}
                onClick={() => {
                  setOpen(true);
                }}
              >
                Upload Code
              </Button>
              <div className={classes.avatar}>
                {/* input user's image */}
                <Avatar src={user.avatar}>
                  {/* here is the user initial */}
                  {user.name
                    .split(/\s|-/)
                    .map((str) => str[0])
                    .join("")}{" "}
                </Avatar>
              </div>
              <Button
                className={classes.buttonMenu}
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="text"
                color="primary"
                onClick={handleClickMenu}
              >
                Profile
                <ArrowDropDownIcon />
              </Button>
              <Menu
                id="nav-menu"
                anchorEl={anchorMenu}
                getContentAnchorEl={null}
                open={Boolean(anchorMenu)}
                onClose={() => setAnchorMenu(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <MenuItem onClick={() => handleCloseMenu()}>
                  <Link to="/profile" className={classes.menuLink}>
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
