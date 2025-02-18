## Базовая ссылка: `https://prof25.onrender.com`

## Эндпоинты аутентификации

### 1. Регистрация пользователя

- **Метод:** `POST`
- **URL:** `/auth/register`
- **Тело запроса (JSON):**
  ```json
  {
    "username": "имя_пользователя",
    "password": "пароль"
  }
  ```
- **Описание:** Регистрирует нового пользователя. Если поля `username` или `password` отсутствуют, вернется ошибка.

---

### 2. Вход (логин)

- **Метод:** `POST`
- **URL:** `/auth/login`
- **Тело запроса (JSON):**
  ```json
  {
    "username": "имя_пользователя",
    "password": "пароль"
  }
  ```
- **Описание:** Выполняет вход и возвращает JWT-токен, если данные пользователя корректны.

---

### 3. Получение данных текущего пользователя

- **Метод:** `GET`
- **URL:** `/auth/me`
- **Заголовки:**
  - `Authorization: Bearer <токен>`
- **Описание:** Возвращает информацию о пользователе, ассоциированную с переданным JWT-токеном.

---

## Эндпоинты работы с файлами

### 4. Загрузка файла

- **Метод:** `POST`
- **URL:** `/files/upload`
- **Заголовки:**
  - `Authorization: Bearer <токен>`
- **Тело запроса:** `multipart/form-data`
  - Поле формы: `file` (выбрать файл)
- **Описание:** Загружает файл и сохраняет его метаданные (имя файла, оригинальное имя, владелец, список пользователей с доступом).

---

### 5. Получение списка файлов пользователя

- **Метод:** `GET`
- **URL:** `/files`
- **Заголовки:**
  - `Authorization: Bearer <токен>`
- **Описание:** Возвращает список файлов, загруженных текущим пользователем (где он является владельцем).

---

### 6. Получение списка файлов, к которым предоставлен доступ

- **Метод:** `GET`
- **URL:** `/files/shared`
- **Заголовки:**
  - `Authorization: Bearer <токен>`
- **Описание:** Возвращает список файлов, доступ к которым предоставлен пользователю (но он не является их владельцем).

---

### 7. Получение информации о файле

- **Метод:** `GET`
- **URL:** `/files/:id`
- **Заголовки:**
  - `Authorization: Bearer <токен>`
- **URL-параметры:**
  - `:id` — идентификатор файла
- **Описание:** Возвращает метаданные файла, если пользователь является владельцем или ему предоставлен доступ.

---

### 8. Редактирование файла (замена файла)

- **Метод:** `PUT`
- **URL:** `/files/:id`
- **Заголовки:**
  - `Authorization: Bearer <токен>`
- **Тело запроса:** `multipart/form-data`
  - Поле формы: `file` (новый файл)
- **URL-параметры:**
  - `:id` — идентификатор файла, который требуется заменить
- **Описание:** Позволяет владельцу файла заменить его новым файлом. Старый файл удаляется.

---

### 9. Предоставление доступа к файлу другому пользователю

- **Метод:** `POST`
- **URL:** `/files/:id/share`
- **Заголовки:**
  - `Authorization: Bearer <токен>`
- **Тело запроса (JSON):**
  ```json
  {
    "userId": "идентификатор_пользователя"
  }
  ```
- **URL-параметры:**
  - `:id` — идентификатор файла
- **Описание:** Позволяет владельцу файла предоставить доступ другому пользователю, указав его `userId` в теле запроса.

---

### 10. Удаление доступа к файлу

- **Метод:** `DELETE`
- **URL:** `/files/:id/share/:userId`
- **Заголовки:**
  - `Authorization: Bearer <токен>`
- **URL-параметры:**
  - `:id` — идентификатор файла
  - `:userId` — идентификатор пользователя, у которого снимается доступ
- **Описание:** Позволяет владельцу файла удалить ранее предоставленный доступ у указанного пользователя.