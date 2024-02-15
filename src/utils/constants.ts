import { constants as httpConstants } from 'http2';

const {
  HTTP_STATUS_CREATED: CREATED_201,
  HTTP_STATUS_BAD_REQUEST: BAD_REQUEST_400,
  HTTP_STATUS_UNAUTHORIZED: UNAUTHORIZED_401,
  HTTP_STATUS_FORBIDDEN: FORBIDDEN_403,
  HTTP_STATUS_NOT_FOUND: NOT_FOUND_404,
  HTTP_STATUS_CONFLICT: CONFLICT_409,
  HTTP_STATUS_INTERNAL_SERVER_ERROR: INTERNAL_SERVER_ERROR_500,
} = httpConstants;

const SERVER_ERROR_MESSAGE = 'На сервере произошла ошибка';
const VALIDATION_ERROR_MESSAGE = 'Некорректные данные:';
const BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE =
  'Некорректный запрос. Значения параметров page и limit должны быть числом';
const NOT_FOUND_ERROR_MESSAGE = 'Ресурс не найден. Проверьте URL и метод запроса';

const NEWS_NOT_FOUND_ERROR_MESSAGE = 'Такой новости нет';
const DELETE_NEWS_MESSAGE = 'Новость удалена';
const CAST_INCORRECT_NEWSID_ERROR_MESSAGE = 'Некорректный Id нововсти';

const PROJECT_NOT_FOUND_ERROR_MESSAGE = 'Такого проекта нет';
const DELETE_PROJECT_MESSAGE = 'Проект удалён';
const CAST_INCORRECT_PROJECTID_ERROR_MESSAGE = 'Некорректный Id проекта';

const ARTICLE_NOT_FOUND_ERROR_MESSAGE = 'ТакоЙ статьи нет';
const DELETE_ARTICLE_MESSAGE = 'Статья удалена';
const CAST_INCORRECT_ARTICLEID_ERROR_MESSAGE = 'Некорректный Id статьи';

const AUDIO_NOT_FOUND_ERROR_MESSAGE = 'Такого аудио нет';
const DELETE_AUDIO_MESSAGE = 'Аудио удалено';
const CAST_INCORRECT_AUDIOID_ERROR_MESSAGE = 'Некорректный Id аудио';

const MEMBER_NOT_FOUND_ERROR_MESSAGE = 'Такого члена Союза нет';
const DELETE_MEMBER_MESSAGE = 'Запись члена союза удалена';
const CAST_INCORRECT_MEMBERID_ERROR_MESSAGE = 'Некорректный Id члена Союза';

const REPORT_NOT_FOUND_ERROR_MESSAGE = 'Такого отчёта нет';
const DELETE_REPORT_MESSAGE = 'Отчёт удален';
const CAST_INCORRECT_REPORTID_ERROR_MESSAGE = 'Некорректный Id отчёта';
const BAD_REUEST_INCORRECT_REPORTINDEX_ERROR_MESSAGE = 'Недопустимый индекс отчёта';

const SCORE_NOT_FOUND_ERROR_MESSAGE = 'Такого отчёта нет';
const DELETE_SCORE_MESSAGE = 'Отчёт удален';
const CAST_INCORRECT_SCOREID_ERROR_MESSAGE = 'Некорректный Id отчёта';

const VIDEO_NOT_FOUND_ERROR_MESSAGE = 'Такого видео нет';
const DELETE_VIDEO_MESSAGE = 'Видео удалено';
const CAST_INCORRECT_VIDEOID_ERROR_MESSAGE = 'Некорректный Id видео';

const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])\.\d{4}$/;
const urlRegEx = /https?:\/\/w{0,3}\.?[\w0-9-]{1,10}\.\w{2,3}[\w\d\-._~:/?#[\]@!$&'()*+,;=]{0,}/m;

export {
  CREATED_201,
  BAD_REQUEST_400,
  UNAUTHORIZED_401,
  FORBIDDEN_403,
  NOT_FOUND_404,
  CONFLICT_409,
  INTERNAL_SERVER_ERROR_500,
  SERVER_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  NEWS_NOT_FOUND_ERROR_MESSAGE,
  DELETE_NEWS_MESSAGE,
  CAST_INCORRECT_NEWSID_ERROR_MESSAGE,
  PROJECT_NOT_FOUND_ERROR_MESSAGE,
  DELETE_PROJECT_MESSAGE,
  CAST_INCORRECT_PROJECTID_ERROR_MESSAGE,
  ARTICLE_NOT_FOUND_ERROR_MESSAGE,
  DELETE_ARTICLE_MESSAGE,
  CAST_INCORRECT_ARTICLEID_ERROR_MESSAGE,
  AUDIO_NOT_FOUND_ERROR_MESSAGE,
  DELETE_AUDIO_MESSAGE,
  CAST_INCORRECT_AUDIOID_ERROR_MESSAGE,
  MEMBER_NOT_FOUND_ERROR_MESSAGE,
  DELETE_MEMBER_MESSAGE,
  CAST_INCORRECT_MEMBERID_ERROR_MESSAGE,
  REPORT_NOT_FOUND_ERROR_MESSAGE,
  DELETE_REPORT_MESSAGE,
  CAST_INCORRECT_REPORTID_ERROR_MESSAGE,
  BAD_REUEST_INCORRECT_REPORTINDEX_ERROR_MESSAGE,
  SCORE_NOT_FOUND_ERROR_MESSAGE,
  DELETE_SCORE_MESSAGE,
  CAST_INCORRECT_SCOREID_ERROR_MESSAGE,
  VIDEO_NOT_FOUND_ERROR_MESSAGE,
  DELETE_VIDEO_MESSAGE,
  CAST_INCORRECT_VIDEOID_ERROR_MESSAGE,
  dateRegex,
  urlRegEx,
};