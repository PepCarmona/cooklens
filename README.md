# Cooklens

The idea behind this project was to create an easy way to save recipes from the internet into my own personal recipe book. With that base concept in mind, a few more features were added such as integration with Edamam API, meal plans and authentication.

## Technologies

This project repository implements a JAMstack architecture, where the backend is composed by lambda functions that works as independent microservices which work together over the same database to provide the user with all the functionality.

- The frontend part of the application is written with Vue3 in Typescript, focusing on a custom state management system that relies on several composable states divided by domain.
  The layout is formed by several Singe File Components that split the markup, styles and logic into smaller bits that represent visual sections on the web application. The components use the new Composition API provided by Vue 3 in order to reuse functionality over the app, and the styles use the Sass preprocessor so it's easier from a developer perspective to organize, nest and reuse styles.

- The backend is compromised in several lambda functions written in Typescript that request and modify data from a cloud MongoDB database using the free tier of Atlas. These functions act as endpoints through a Netlify Functions integration, and also take care of integrations with 3rd party APIs such as Edamam for recipe information.
  In addition, there's a custom authentication system set up using JWT tokens and one way hashed passwords, trying to keep a decent level of security.

- The whole project is integrated with Netlify through a repository synchronization. Any change pushed into main gets automatically deployed, including both the frontend code and the backend lambda functions.
