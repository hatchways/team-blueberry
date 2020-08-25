import React, { useState, useEffect, useContext, useReducer } from "react";
import socket from "../services/sockets";
import axios from "axios";
import userContext from "../userContext";
import calcDate from "../utils/calcDate";
import { Link } from "react-router-dom";
//MaterialUI imports
import { makeStyles } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  menu: {
    padding: "0",
  },
  seen: { background: "white" },
  unseen: {
    background: "#C2DFFF",
  },
  wrapper: {
    padding: "0 1vh 0 0",
    margin: "0",
  },
  time: {
    color: "gray",
  },
  link: {
    textDecoration: "none",
  },
});

const initialState = {
  notifications: [],
};

const reducer = (state, action) => {
  const updateUnread = () => {
    const unread = state.notifications.map((item) => {
      item.seen = true;
      return item;
    });
    axios.put(`api/notifications/update-read`, { notifications: unread });
    return unread;
  };

  switch (action.type) {
    case "newNotification":
      return { notifications: [action.payload, ...state.notifications] };
    case "getNotifications":
      return { notifications: action.payload };
    case "setSeen":
      return { notifications: updateUnread() };
    default:
      throw new Error("State update error");
  }
};

const Notifications = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const classes = useStyles();
  const [seen, setSeen] = useState(false);

  const user = useContext(userContext);
  const [anchorNotificaton, setAnchorNotificaton] = useState(null);

  const getNotifications = async () => {
    const { data } = await axios.get(`/api/notifications/${user.id}`);
    dispatch({ type: "getNotifications", payload: data.reverse() });
  };

  useEffect(() => {
    getNotifications();
    socket.subscribe("notifications", handleSocketNotification);
    return () => socket.unsubscribe("notifications");
  }, []);

  const deleteNotification = (notificationId) => {
    axios.delete(`/api/notifications/${notificationId}`);
    getNotifications();
    state.notifications.length === 1 && setAnchorNotificaton(null);
  };

  const handleSocketNotification = (notification) => {
    console.log("New notification:", notification);
    dispatch({ type: "newNotification", payload: notification });
  };

  useEffect(() => {
    setSeen(state.notifications.every((item) => item.seen === true));
  }, [anchorNotificaton]);

  const handleMenu = (event) => {
    setAnchorNotificaton(event.currentTarget);
    setSeen(true);
  };

  const handleClose = () => {
    let updateRequired = false;
    for (let i = 0; i < state.notifications.length; i++) {
      if (!state.notifications[i].seen) {
        updateRequired = true;
        break;
      }
    }

    if (updateRequired) {
      dispatch({ type: "setSeen" });
    }

    setAnchorNotificaton(null);
  };

  return (
    <React.Fragment>
      <Badge
        color="primary"
        overlap="circle"
        badgeContent={state.notifications.length}
      >
        <IconButton
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          className={classes.notification}
          disabled={state.notifications.length < 1}
        >
          <NotificationsNoneIcon />
        </IconButton>
      </Badge>
      <Menu
        id="notification-menu"
        anchorEl={anchorNotificaton}
        getContentAnchorEl={null}
        open={Boolean(anchorNotificaton)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        className={classes.menu}
      >
        {state.notifications.map((item) => {
          return (
            <MenuItem
              className={`${classes.link} ${
                item.seen ? classes.seen : classes.unseen
              }`}
              key={item._id}
            >
              <Grid container direction="row">
                <Grid item container className={classes.wrapper} xs={11}>
                  <Grid item xs={12} className={classes.message}>
                    <Link
                      to={`/reviews/${item.thread}`}
                      className={classes.link}
                      onClick={handleClose}
                    >
                      <Typography variant="h6">{item.text}</Typography>
                    </Link>
                  </Grid>
                  <Grid item xs={12} className={classes.time}>
                    <Typography variant="subtitle2">
                      {calcDate(item.createdAt)} by {item.author}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    onClick={() => {
                      deleteNotification(item._id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </MenuItem>
          );
        })}
      </Menu>
    </React.Fragment>
  );
};

export default Notifications;
