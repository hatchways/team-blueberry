const dateToYMD = (date) => {
  let internalDate = new Date(date);
  var strArray = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var d = internalDate.getDate();
  var m = strArray[internalDate.getMonth()];
  var y = internalDate.getFullYear();
  return "" + (d <= 9 ? "" + d : d) + " " + m + " " + y;
};

export default dateToYMD;
