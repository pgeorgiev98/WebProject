# Групово редактиране на таблица

## Инсталация и настройки
Open a terminal and navigate to the project:
```
composer install
php WebSocketServer.php
```

Open another terminal and run:
```
php -S 0.0.0.0:8000
```

In a browser open [http://localhost:8000/static/index.html](http://localhost:8000/static/index.html)

## Кратко ръководство за потребителя:
![login](/static/img/login.png)
![register](/static/img/register.png)


![main](/static/img/main.png)
От главната страница потребителят може да създава нов документ или да качва документ в csv формат. Във формата може да се види таблица с документите на текущия потребител.
Има бутони, които водят към сайтовете съответно на “Moodle”, “Susi”, “Puffin”.

![main](/static/img/document.png)
Има бутони за “bold” ,”Italic” , “underline” и “s̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶”; различно подравняване и два color picker-a.
Има възможност за теглене на документа в csv формат.
