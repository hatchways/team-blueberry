function toDigit(item) {
  switch (item) {
    case "Beginner":
      return 1;
    case "Advanced":
      return 2;
    case "Expert":
      return 3;
    default:
      return 0;
  }
}

module.exports = toDigit;
