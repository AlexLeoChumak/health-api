export interface AuthNotificationInterface {
  REGISTRATION_SUCCESS: string;
  REGISTRATION_USER_NOT_FOUND_ERROR: string;
  REGISTRATION_PASSWORD_NOT_FOUND_ERROR: string;
  LOGIN_INVALID_PHONE_NUMBER_OR_PASSWORD_ERROR: string;
  USER_NOT_FOUND_ERROR: string;
  TOKEN_EXPIRED: string;
  TOKEN_REFRESH_EXPIRED: string;
  TOKEN_INVALID: string;
  ERROR_SAVING_TOKEN: string;
}

export const AUTH_NOTIFICATIONS: AuthNotificationInterface = {
  REGISTRATION_SUCCESS:
    'Регистрация прошла успешно! Теперь войдите в свой личный кабинет, ',
  REGISTRATION_USER_NOT_FOUND_ERROR:
    'Ошибка при регистрации нового пользователя. Попробуйте зарегистрироваться ещё раз.',
  REGISTRATION_PASSWORD_NOT_FOUND_ERROR:
    'Ошибка при регистрации. Отсутствует пароль.',
  LOGIN_INVALID_PHONE_NUMBER_OR_PASSWORD_ERROR:
    'Неверный номер телефона или пароль',
  USER_NOT_FOUND_ERROR: 'Пользователь не найден',
  TOKEN_EXPIRED: 'Срок действия токена доступа истёк',
  TOKEN_REFRESH_EXPIRED:
    'Срок действия вашего сеанса истёк. Пожалуйста, войдите в систему снова',
  TOKEN_INVALID: 'Токен невалиден',
  ERROR_SAVING_TOKEN: 'Ошибка сохранения токена обновления в базе данных',
};
