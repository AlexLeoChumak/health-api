export interface UserProfileConstantInterface {
  CURRENT_PASSWORD_INVALID: string;
  NEW_PASSWORDS_NO_MATCH: string;
  PASSWORD_UPDATED_SUCCESSFULLY: string;
  INFO_GROUP_UPDATED_SUCCESSFULLY: string;
  INFO_GROUP_NOT_FOUND: string;
  REPOSITORY_NOT_FOUND: string;
  USER_DELETE_SUCCESS: string;
}

export const USER_PROFILE_CONSTANT: UserProfileConstantInterface = {
  CURRENT_PASSWORD_INVALID: 'Текущий пароль неверен',
  NEW_PASSWORDS_NO_MATCH: 'Новый пароль и его подтверждение не совпадают',
  PASSWORD_UPDATED_SUCCESSFULLY: 'Пароль успешно обновлён',
  INFO_GROUP_UPDATED_SUCCESSFULLY: 'Информация успешно обновлёна',
  INFO_GROUP_NOT_FOUND: 'Информационная группа не найдена',
  REPOSITORY_NOT_FOUND: 'Репозиторий не найден',
  USER_DELETE_SUCCESS: 'Пользователь успешно удалён',
};
