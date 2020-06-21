# SpaceY

В задании будем делать серверную часть и клиенсткие запросы для приложения SpaceY.
Приложение представляет собой SPA (Single Page Application), 
которое умеет работать без перезагрузки страниц браузером.
В SPA серверу достаточно возвращать единственную html страницу, 
на которой подключаются скрипты и стили приложения.
Эти скрипты определят, какой контент нужно показать пользователю,
сделают запросы к серверу, получат данные и сформируют страницу "на лету".
Все запросы на сервер приложение будет посылать через файл `/public/static/client.mjs`

0. Поставь зависимости и запусти сервер.
Для этого перейди в директорию задачи и выполни команду `npm install`.
После установки зависимостей, выполни команду `npm run start`.
После запуска, перейди по адресу [localhost:3000](http://localhost:3000)

1. Сделай так, чтобы сервер смог отдавать статические файлы из директории `/public`. 
В express для этого есть middleware `express.static`.
Подробнее можно прочитать [здесь](https://expressjs.com/en/starter/static-files.html)

2. Сделай так, чтобы при заходе на любой неизвестный адрес, сервер возвращал содержимое `index.html`.
В этом помогут специальные символы [в путях](https://expressjs.com/en/guide/routing.html#route-paths)

3. Сделай так, чтобы наш сайт работал по https.
В этом поможет [этот небольшой пост](https://timonweb.com/posts/running-expressjs-server-over-https/).
Сертификат уже сгенерирован и лежит в папке `/certs`.
Внимание, придётся разрешить Chrome работать с само-подписанными сертификатами для localhost.
Это можно сделать включив флаг `chrome://flags/#allow-insecure-localhost`.

4. Изучи файл `/public/static/client.mjs`. В нём лежит заготовка клиента, который будет делать запросы на сервер.
Сделай так, чтобы работали методы, работы с пользователем (`.getUser()`, `.loginUser()`, `.logoutUser()`).
На этом этапе имя пользователя можно хранить на сервере.
Все адреса, по которым этот клиент будет слать запросы лучше начинать с `/api/...`, 
чтобы показать, что они являются частью API, к которому делают AJAX запросы.
Если в методе `.loginUser()` будешь посылать имя пользователя в теле запроса, то не забудь подключить `express.json` [middleware](https://expressjs.com/en/4x/api.html#express.json) или  `body-parser` [middleware](https://expressjs.com/en/resources/middleware/body-parser.html).
Отправлять ответ можно с помощью [res.json](https://expressjs.com/en/4x/api.html#res.json).

5. Сохрани имя пользователя в [cookie](https://expressjs.com/en/4x/api.html#req.cookies) (не забудь подключить `cookie-parser` [middleware](https://expressjs.com/en/resources/middleware/cookie-parser.html)). 
Сделай так, чтобы методы `.getUser()`, `.loginUser()`, `.logoutUser()` работали с cookie

6. Сделай так, чтобы cookie с именем пользователя была httpOnly, secure, и имела sameSite политику Strict. 
В этом помогут дополнительные опции [res.cookie](https://expressjs.com/en/4x/api.html#res.cookie).

7. Сделай так, чтобы при заходе на любой роут, кроме статики и `/login` без cookie происходил на страницу `/login`.
Для этого придётся написать `middleware` и проверять наличие cookie в запросе.
Как написать узнай [здесь](https://expressjs.com/en/guide/writing-middleware.html).
Сделай так, чтобы middleware применялось только для путей, которые непосредственно отдают `index.html`

8. Оживи остальные страницы кроме `/sendToMars`. А именно About, History, Rockets, Roadster.
В качестве источника данных используй [публичное API](https://docs.spacexdata.com/).
Методы в нём названы похожим образом.
Посылать с сервера запросы к публичному API можно с помощью
[https.request](https://nodejs.org/api/https.html#https_https_request_url_options_callback)
или, как в браузере, с помощью fetch.
Так этот это браузерный стандарт, его нет в стандартной библиотеке node.js,
но существует реализация [node-fetch](https://github.com/bitinn/node-fetch),
которая уже подключена в качестве зависимости в `package.json`.
По возможности, не запрашивай лишних данных из API и не возвращай лишних данных на клиент.
Формат данных, который ожидает клиент описан в файле `/public/static/client.mjs` в виде JSDoc.

9. \* Оживи страницу `/sendToMars`. Объект каждого предмета посылай в теле запроса в формате json.
Для того, чтобы прочитать и распарсить тело запроса придётся подключить `express.json` [middleware](https://expressjs.com/en/4x/api.html#express.json).
Храни данные в памяти на сервере, придумай как гарантировать уникальность полей `id` для каждого предмета.

