export default function pswValidator(password) {
  let errorFound = null;

  switch (true) {
    case password.length < 6:
      errorFound = 'Password must be at least 6 characters long';
      break;
    case password.match(/(?=.*[a-z])/):
      errorFound = 'Password must contain at least one lower case letter';
      break;
    case password.match(/(?=.*\d)/):
      errorFound = 'Password must contain at least one digit';
      break;
    case password.match(/(?=.*[A-Z])/):
      errorFound = 'Password must contain at least one upper case letter';
      break;
    case password.match(/(?=.*[!@#$%^&*])/):
      errorFound = 'Password must contain at least one special char';
      break;
    default:
      break;
  }
  return errorFound;
}
