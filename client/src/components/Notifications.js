import React, { useState, useEffect, useContext, useReducer } from "react";
import socket from "../services/sockets";
import axios from "axios";
import userContext from "../userContext";
//MaterialUI imports
import { makeStyles } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";

const useStyles = makeStyles({
  menu: {
    padding: "0",
  },
  seen: { background: "white" },
  unseen: {
    background: "blue",
  },
  wrapper: {
    padding: "0 1vh 0 0",
    margin: "0",
  },
  time: {
    color: "gray",
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
    axios.put(`/notifications/update-read`, { notifications: unread });
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

//For time calculation
const timeMap = {
  minute: 60000,
  hour: 3600000,
  day: 86400000,
  week: 604800000,
  month: 2592000000,
  year: 31536000000,
};

const Notifications = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const classes = useStyles();
  const [seen, setSeen] = useState(false);

  const user = useContext(userContext);
  const [anchorNotificaton, setAnchorNotificaton] = useState(null);

  //Get notifications for USER
  useEffect(() => {
    const getNotifications = async () => {
      const { data } = await axios.get(`/notifications/${user._id}`);
      dispatch({ type: "getNotifications", payload: data.reverse() });
    };
    getNotifications();
    socket.subscribe("notifications", handleSocketNotification);
    return () => socket.unsubscribe("notifications");
  }, [user]);

  const handleSocketNotification = (notification) => {
    dispatch({ type: "newNotification", payload: notification });
  };

  useEffect(() => {
    setSeen(state.notifications.every((item) => item.seen === true));
  });

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

  //Transform date to 'ago' format
  const calcDate = (date) => {
    const created = new Date(date);
    const now = Date.now();
    const timeDelta = now - created.valueOf();
    let elapsed = 0;
    if (timeDelta < timeMap.minute) {
      return "just now";
    } else if (timeDelta < timeMap.hour) {
      elapsed = timeDelta / timeMap.minute;
      elapsed = Math.floor(elapsed);
      return `${elapsed} minute(s) ago`;
    } else if (timeDelta < timeMap.day) {
      elapsed = timeDelta / timeMap.hour;
      elapsed = Math.floor(elapsed);
      return `${elapsed} hour(s) ago`;
    } else if (timeDelta < timeMap.week) {
      elapsed = timeDelta / timeMap.day;
      elapsed = Math.floor(elapsed);
      return `${elapsed} day(s) ago`;
    } else if (timeDelta < timeMap.month) {
      elapsed = timeDelta / timeMap.week;
      elapsed = Math.floor(elapsed);
      return `${elapsed} week(s) ago`;
    } else if (timeDelta < timeMap.year) {
      elapsed = timeDelta / timeMap.month;
      elapsed = Math.floor(elapsed);
      return `${elapsed} month(s) ago`;
    } else {
      return "over a year ago";
    }
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
              <Grid container className={classes.wrapper}>
                <Grid item xs={12} className={classes.message}>
                  <Typography variant="h6">{`${item.text} by ${item.author}`}</Typography>
                </Grid>
                <Grid item xs={12} className={classes.time}>
                  <Typography variant="subtitle2">
                    {calcDate(item.created)}
                  </Typography>
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