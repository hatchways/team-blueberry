import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Badge from "@material-ui/core/Badge";
import CodeIcon from "@material-ui/icons/Code";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
  },
  button: {
    textTransform: "none",
    color: theme.palette.primary.white,
    marginRight: theme.spacing(3),
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
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

const Navbar = () => {
  const classes = useStyles();

  const [anchorNotificaton, setAnchorNotificaton] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleNotificaton = (event) => {
    setAnchorNotificaton(event.currentTarget);
  };

  // menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" color="secondary">
      <Toolbar>
        <div className={classes.root}>
          <CodeIcon />
        </div>
        <Button className={classes.button}>Reviews</Button>
        <Button className={classes.button}>Balance</Button>
        <Badge color="primary" variant="dot" overlap="circle">
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleNotificaton}
            color="inherit"
            className={classes.notification}
          >
            <NotificationsNoneIcon />
          </IconButton>
        </Badge>
        <Button
          className={classes.button}
          color="primary"
          variant="outlined"
          className={classes.upload}
        >
          Upload Code
        </Button>
        <div className={classes.avatar}>
          {/* input user's image */}
          <Avatar src="">UI {/* here is the user initial */}</Avatar>
        </div>
        <Button
          className={classes.buttonMenu}
          aria-controls="customized-menu"
          aria-haspopup="true"
          variant="text"
          color="primary"
          onClick={handleClick}
        >
          Profile
          <ArrowDropDownIcon />
          {/* // menu goes here */}
        </Button>
        <Menu
          id="nav-menu"
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Navbar);
