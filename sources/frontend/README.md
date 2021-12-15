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
This generates a bunch of static HTML, CSS and JS files. To pack them into a WAR file: 

1. `cd` to `dist
2. Add a `src/main/webapp` folder
3. Add all of your HTML, CSS and JS files to the `src/main/webapp` folder
4. Add an empty [web.xml](http://en.wikipedia.org/wiki/Deployment_descriptor) file to the `src/main/webapp/WEB-INF` directory. 
5. add a maven pom.xml
6. add the maven-war-plugin to your pom.xml, with the following configuration: 

        <!--  create the war -->
        <plugin>
          <artifactId>maven-war-plugin</artifactId>
          <configuration>
            <webXml>src/main/webapp/WEB-INF/web.xml</webXml>
          </configuration>
        </plugin>

7. run `mvn clean install`

The resulting `.war` file can be deployed to a Tomcat or other Java-based web server.

### Lints and fixes files
- to view lints execute the following command:
```
yarn lint
```
