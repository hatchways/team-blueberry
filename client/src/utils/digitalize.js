export default function digitalize(item) {
  switch (item) {
    case 1:
      return "Beginner";
    case 2:
      return "Advanced";
    case 3:
      return "Expert";
    default:
      return 0;
  }
}
