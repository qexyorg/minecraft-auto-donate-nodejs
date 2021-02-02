# Minecraft Auto Donate for Node.JS

# English
SPA Onepage application for minecraft server auto donate platform

Stack:
- Database: MongoDB
- Payment aggregator: Unitpay
- Give method: RCON
- Front-end: Angular
- Settings: Configuration file

### Installation
1. Install NodeJS
2. Install MongoDB
3. Open file app/config.js and configure parameters
4. Terminal: `cd /path/to/project` then `npm install`
5. Run: `npm start`

### Testing & building
1. `cd /path/to/project/client`
2. Build: `ng build --prod`
3. Run test: `ng serve`

Unitpay handler URL: `https://{YOUR_SITE}/payments/unitpay/`

# Russian
Одностраничное приложение для приема платежей с игрового сервера Minecraft

Используемые инструменты:
- База данных: MongoDB
- Платежный агрегатор: Unitpay
- Метод выдачи привилегий: RCON
- Front-end: Angular
- Метод настроек: Файл конфигурации

### Инструкция по установке
1. Установите NodeJS
2. Установите MongoDB
3. Откройте файл app/config.js и произведите необходимые настройки
4. В терминале введите команду: `cd /path/to/project` затем `npm install`
5. Команда запуска веб-сервера: `npm start`

### Сборка и тестирование
1. `cd /path/to/project/client`
2. Собрать Angular проекта: `ng build --prod`
3. Запуск тестового сервера: `ng serve`

Адрес обработчика Unitpay: `https://{YOUR_SITE}/payments/unitpay/`