# IMiGEr
Interactive Multimodal Graph Explorer

IMiGer is research graph exploration platform **allowing faster graph structure understanding by using advanced interctivity, unique edge hiding and grouping concepts**. Users are able to create a **mental model of complex graphs much faster** compared to traditional graph visualalization tools techniques (such as panning, zooming and moving nodes).

**Concepts:**
- Automated initial graph content reduction
- Nodes moving to side area
- Symbols intead of edges (details on demand) reducing the visual clutter
- Groups for faster structure identification

**Platform features and input:**
- handle  **multiple  types of  both  nodes  and  edge**, 
- various types of graphs,  which  is  enabled  by  generalized  [input graph  structure](https://github.com/ReliSA/IMiGEr/blob/devel/documents/IMiGEr/IMiGEr_raw_input_format.pdf).  Thus  it  can  be suitable for the visualization of any graph  data  which  could  be  converted  to the given  generalized structure (e.g. software engineering projects, intelligence  agencies  analysis,  historical  data,  computer  networks,  social networks).  

The program is deployed at http://relisa-dev.kiv.zcu.cz:8085/imiger (use Chromium-based browsers please, functionality not guaranteed in Firefox).


[![obrazek](https://github.com/ReliSA/IMiGEr/blob/devel/documents/IMiGEr/IMiGEr_11_2018.png)]()

## Deployment
This section describes a production deployment using a Tomcat

### Prerequisities:
In the following listing, we state versions of the individual dependencies. These versions are the one used for testing. However, other versions may be supported as well.

**SW Prerequisities**
 - Tomcat - `8.5.71`
 - Java - `15.0.2 2021-01-19`
 - Maven - `3.6.3`
 - Yarn - `1.22.15`

**Configuration Prerequisities**
 - `TOMCAT_HOME` environment variable pointing to a root folder of Tomcat instalation must be set
 - `VUE_APP_ROOT_API` option in `sources/frontend/.env` must be set to IMiGEr backend URL. Eg. `VUE_APP_ROOT_API=http://localhost:8080/imiger/api`
 - File `vue.config.js` must have the following content:
   ```
   module.exports = {
     publicPath: ""
   }
   ```

### Deploy the Application

#### Option A: Automatic Deployment
  1. Run `./deploy.sh`
  2. Access `http://localhost:8080/imiger-frontend/index.html` (replace `localhost`) with your the IP of the server running the deployment.
  3. Done

### Option A: Manual Deployment
  1. Deploy the backend
      1. Go to `sources/backend`
      2. Run `mvn clean install`
      3. Copy the resulting `imiger-core/target/imiger.war` to Tomcat's `$TOMCAT_HOME/webapp` dir
  2. Deploy the frontend
      1. Go to `sources/frontend`
      2. Install all dependecies using `yarn install`
      3. Build the Vue.js app using `yarn build`
      4. Copy the content of the `dist` directory to `deploy/src/main/webapp`
      5. Go to `deploy`
      6. Run `mvn clean install`
      7. Copy the `target/imiger-frontend.war` to Tomcat's `$TOMCAT_HOME/webapp` dir
  3. Start the tomcat using `$TOMCAT_HOME/bin/catalina.sh start`
  4. Access `http://localhost:8080/imiger-frontend/index.html` (replace `localhost`) with your the IP of the server running the deployment.
  5. Done
