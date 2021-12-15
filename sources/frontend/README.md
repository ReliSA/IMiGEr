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
- `.env` - contains path to deployed backend. **EDIT** this after deploying your backend server to target `YOUR_PATH/imiger/api`

## Deployment
This section describes deployment of the fronend for development purposes.

### Prerequisites

 - Yarn - `1.22.15`

### Development deployment
- install all dependencies:
```
yarn install
```
- execute the following command that starts up a local instance of the client and allows for hot reloads:
```
yarn serve
```

### Lints and fixes files
- to view lints execute the following command:
```
yarn lint
```
