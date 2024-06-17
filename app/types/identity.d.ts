interface IUser {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  scope: string;
}

interface IUserCredentials extends IUser {
  password: string;
}

interface IUserSession extends IUser {
  logged_in: string;
}

interface IUserProfileUpdate {
  first_name: string;
  last_name: string;
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}
