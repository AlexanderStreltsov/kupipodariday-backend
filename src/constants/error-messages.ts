export const USER_EXIST_MSG =
  'Пользователь с таким email или username уже зарегистрирован';
export const USER_NOT_FOUND_MSG = 'Пользователь не найден';

export const UNAUTORIZED_MSG = 'Пользователь неавторизован';
export const INCORRECT_AUTH_MSG = 'Некорректная пара логин и пароль';

export const WISH_NOT_FOUND_MSG = 'Подарок не найден';
export const WISH_NOT_MY_MSG = 'Редактировать чужие подарки невозможно';
export const WISH_CANT_EDIT_MSG =
  'Редактировать подарок невозможно, если есть желающие скинуться';
export const WISH_DELETE_MSG = 'Удалять чужие подарки невозможно';

export const WISHLISTS_NOT_FOUND_MSG = 'Подборки не найдены';
export const WISHLIST_CANT_EDIT_MSG = 'Невозможно редактировать чужие подборки';
export const WISHLIST_DELETE_MSG = 'Невозможно удалять чужие подборки';

export const OFFERS_NOT_FOUND = 'Предложение не найдено';
export const OFFERS_SUM_MSG = 'Сумма взноса превышает стоимость подарка';
export const OFFERS_CANT_EDIT_MSG =
  'Внести деньги на собственный подарок невозможно';

export const getSameValueError = (field: string) =>
  `Пользователь с таким ${field} уже существует`;

export const mustBeString = (field: string) =>
  `Поле ${field} должно быть строкой`;

export const mustBeUrl = (field: string) =>
  `Поле ${field} должно быть корректным URL`;

export const mustBeNumber = (field: string) =>
  `Поле ${field} должно быть числом`;

export const mustBePositive = (field: string) =>
  `Поле ${field} должно быть числом больше 0`;

export const mustBeMin = (field: string, min: number) =>
  `Поле ${field} должно быть не менее ${min}`;

export const mustBeMinLength = (field: string, min: number) =>
  `Поле ${field} должно быть не менее ${min} символа(-ов)`;

export const mustBeMaxLength = (field: string, max: number) =>
  `Поле ${field} должно быть не более ${max} символа(-ов)`;

export const mustBeEmail = (field: string) =>
  `Поле ${field} должно быть корректным адресом почтового ящика`;

export const mustBeNotEmpty = (field: string) =>
  `Поле ${field} должно быть заполнено`;

export const mustBeArray = (field: string) =>
  `Поле ${field} должно быть массивом данных`;

export const mustBeBoolean = (field: string) =>
  `Поле ${field} должно быть булевым значением`;
