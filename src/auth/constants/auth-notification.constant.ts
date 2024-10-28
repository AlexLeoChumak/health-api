interface AuthNotificationInterface {
  REGISTRATION_SUCCESS: string;
  REGISTRATION_USER_NOT_FOUND_ERROR: string;
  REGISTRATION_PASSWORD_NOT_FOUND_ERROR: string;
  LOGIN_INVALID_PHONE_NUMBER_OR_PASSWORD_ERROR: string;
  LOGIN_USER_NOT_FOUND_ERROR: string;
}

export const AUTH_NOTIFICATIONS: AuthNotificationInterface = {
  REGISTRATION_SUCCESS:
    'Регистрация прошла успешно! Теперь войдите в свой личный кабинет.',
  REGISTRATION_USER_NOT_FOUND_ERROR:
    'Ошибка при регистрации нового пользователя. Попробуйте зарегистрироваться ещё раз.',
  REGISTRATION_PASSWORD_NOT_FOUND_ERROR:
    'Ошибка при регистрации. Отсутствует пароль.',
  LOGIN_INVALID_PHONE_NUMBER_OR_PASSWORD_ERROR:
    'Неверный номер телефона или пароль',
  LOGIN_USER_NOT_FOUND_ERROR: 'Пользователь не найден',
};
