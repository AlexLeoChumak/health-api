interface AuthMessageResponseInterface {
  REGISTRATION_SUCCESS: string;
  REGISTRATION_USER_DATA_ERROR: string;
  REGISTRATION_DATABASE_ERROR: string;
  LOGIN_INVALID_PHONE_NUMBER_OR_PASSWORD: string;
}

export const AUTH_MESSAGES: AuthMessageResponseInterface = {
  REGISTRATION_SUCCESS:
    'Регистрация прошла успешно! Теперь войдите в свой личный кабинет.',
  REGISTRATION_USER_DATA_ERROR:
    'Данные некорректны. Попробуйте ввести корректные данные.',
  REGISTRATION_DATABASE_ERROR:
    'Ошибка сохранения данных. Попробуйте ввести данные ещё раз.',
  LOGIN_INVALID_PHONE_NUMBER_OR_PASSWORD: 'Неверный номер телефона или пароль',
};
