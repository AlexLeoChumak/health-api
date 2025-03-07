export interface UserProfileConstantInterface {
  CURRENT_PASSWORD_INVALID: string;
  NEW_PASSWORDS_NO_MATCH: string;
  PASSWORD_UPDATED_SUCCESSFULLY: string;
}

export const USER_PROFILE_CONSTANT: UserProfileConstantInterface = {
  CURRENT_PASSWORD_INVALID: 'Текущий пароль неверен',
  NEW_PASSWORDS_NO_MATCH: 'Новый пароль и его подтверждение не совпадают',
  PASSWORD_UPDATED_SUCCESSFULLY: 'Пароль успешно обновлён',
};
