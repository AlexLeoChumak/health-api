export interface SharedConstantInterface {
  USER_NOT_FOUND_ERROR: string;
  AUTHORIZATION_HEADER_MISSING: string;
  TOKEN_INVALID_OR_EXPIRED: string;
  APPLICATION_ERROR: string;
  FORBIDDEN_EXCEPTION: string;
  REQUIRED_DATA_MISSING: string;
}

export const SHARED_CONSTANT: SharedConstantInterface = {
  USER_NOT_FOUND_ERROR: 'Пользователь не найден',
  AUTHORIZATION_HEADER_MISSING: 'Отсутствует заголовок авторизации',
  TOKEN_INVALID_OR_EXPIRED: 'Недействительный или просроченный токен',
  APPLICATION_ERROR: 'Ошибка приложения. Пожалуйста, обновите страницу',
  FORBIDDEN_EXCEPTION: 'Доступ запрещен',
  REQUIRED_DATA_MISSING: 'Отсутствуют необходимые данные',
};
