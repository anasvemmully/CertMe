export const isEmail = (email) => {
  if (email.length !== 0) {
    if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return true;
    }
  }
  console.log(false);
  return false;
};

export const isUsername = (username) => {
  if (username.length > 0) {
    if (/^[a-zA-Z0-9]*$/.test(username)) {
      console.log("username length : " + true);

      return true;
    }
  }
  console.log("username length : " + false);
  return false;
};
export const isPassword = (password) => {
  if (password.length > 0) {
    if (password.length >= 8) {
      console.log("username length : " + true);
      return true;
    }
  }
  console.log("password length : " + false);
  return false;
};

export const comparePassword = (password, password2) => {
  if (password === password2) return true;
  else return false;
};
