import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    left: theme.spacing(2),
  },
  link: {
    textDecoration: "none",
    color: "#000000",
  },
}));

export default function SwipeableTemporaryDrawer({
  open,
  setOpen,
  userId,
  logout,
}) {
  const classes = useStyles();
  const anchor = "right";

  const toggleDrawer = () => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(!open);
  };

  const menu = [
    {
      text: "Reviews",
      link: "/reviews",
      icon: <AssignmentTurnedInIcon />,
    },
    {
      text: "Balance",
      link: "/balance",
      icon: <AccountBalanceWalletIcon />,
    },
    {
      text: "Profile",
      link: `/profile/${userId}`,
      icon: <PersonIcon />,
    },
  ];

  const list = (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {menu.map((item, index) => (
          <Link to={item.link} key={index} className={classes.link}>
            <ListItem button>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider light />
      <List>
        <ListItem button onClick={() => logout()}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <React.Fragment key={anchor}>
        <SwipeableDrawer
          anchor={anchor}
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        >
          {list}
          <Fab
            size="medium"
            color="secondary"
            aria-label="add"
            onClick={() => setOpen(!open)}
            className={classes.fab}
          >
            <KeyboardArrowRightIcon />
          </Fab>
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
