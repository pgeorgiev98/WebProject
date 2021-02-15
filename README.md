# Групово редактиране на таблица

## Инсталация и настройки

Стартира се база данни MariaDB. Със скрипта init_db_user.sql се създава необходимия за проекта потребител и му се дават необходимите привилегии, а със скрипта init_db.sql се създава базата данни с необходимите таблици.

Инсталира се Ratchet с Composer чрез командата:
```
composer install
```

## Стартиране

WebSocket сървъра се стартира на порт 8080 с командата:
```
php WebSocketServer.php
```

Open another terminal and run:
```
php -S 0.0.0.0:8000
```

In a browser open [http://localhost:8000/static/main_page.html](http://localhost:8000/static/index.html)

## Кратко ръководство за потребителя:
![login](/static/img/login.png)
![register](/static/img/register.png)


![main](/static/img/main.png)
От главната страница потребителят може да създава нов документ или да качва документ в csv формат. Във формата може да се види таблица с документите на текущия потребител.
Има бутони, които водят към сайтовете съответно на “Moodle”, “Susi”, “Puffin”.

![main](/static/img/document.png)
Има бутони за “bold” ,”Italic” , “underline” и “s̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶”; различно подравняване и два color picker-a.
Има възможност за теглене на документа в csv формат.
