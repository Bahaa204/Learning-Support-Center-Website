export type LoginFormData = {
  email: string;
  password: string;
  email_sent: boolean;
};

export type ResetPasswordInput = {
  password: string;
  confirm_password: string;
};
