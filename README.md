# Items of concern

- The application is a single page application that fetches weather forecast conditions from cities throughout the world using data from the openweathermap server => (https://home.openweathermap.org/)

- To get started, an api key from openweathermap.org must be acquired and assigned to the key called "apikey" within the environment.ts file of the environments folder.
- An api key from googles' Maps Javascript API must be acquired and setup in accordance with => {https://developers.google.com/maps/documentation/javascript}

- A command of {npm install} must be performed within the the root folder of the application where the package.json file is situated.

- Comment out the "DUMMY DATA" within the weather-services.ts and uncomment the live within the two following methods => {getCurrentWeather, getSevenDayForecast}

- After installation of the respective libraries, the command {ng serve} can be executed.

- Open a web browser and input the following URL: {http://localhost:4200}

- That's it.
