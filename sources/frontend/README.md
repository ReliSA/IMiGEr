# IMiGEr Frontend Client
A web application that communicates with the IMiGEr backend, created using the VueJS framework and the Vuex library.

## Sources description
- `public/` - contains static HTML files and assets
- `src/App.vue` - root Vue component of the application
- `src/assets/` - other application assets
- `src/components/` - Vue UI components such as the SVG canvas or the initial screen
- `src/main.js` - main JS file that initializes the application
- `src/store/index.js` - main Vuex store
- `src/utils/` - utility scripts

## Development setup
- install all dependencies:
```
yarn install
```

### Running the applicaiton
- execute the following command that starts up a local instance of the client and allows for hot reloads:
```
yarn serve
```

### Compilation and minification for production
- edit `vue.config.js` if going to test locally without starting up a server
- following command produces `dist` folder containing static HTML and bundled JS of the application:
```
yarn build
```

### Lints and fixes files
- to view lints execute the following command:
```
yarn lint
```

