# Backend deployment instructions
This document describes the deoployment options that can be used to run the backend using three different ways.

## Docker-Compose
- run `mvn clean install` to build a WAR archive of the backend application
    - the archive is then found in the `./imiger-core/target/` folder
- after building the WAR archive run `docker-compose up` to start up the following containers:
    - `db` container, that contains the MySQL database (see `docker-compose.yml` for credentials) that is available from host at `localhost:3306`
    - `web` container, that starts up a Tomcat container running the backend server from the WAR archive (available from host at `localhost:8082`)
## Local installation

### Prerequisities:

 - Java 15
 - Maven
 - Tomcat
 - MySql server
    - there must be a schema with name `visualization_tool` available in the database
    - the database must be initialized with `sources/backend/imiger-core/src/main/resources/create_table.sql`
    - correct name and password must be set in `sources/backend/imiger-core/src/main/resources/mybatis-config.xml`

### Option A: IntelliJ configuration

 1. Open project using `sources/backend/pom.xml`
 2. Open `Run -> Edit Configurations`
 3. Add new configuration using `+`
 4. Choose `Tomcat Server - Local`
 5. Configure the `Server` tab based on the picture below:
    -  Under `Before launch` remove `Build Goal`
    -  Under `Before launch` add a new option using `+`. Select `Run maven goal -> Command Line` and specify target `Install`
      ![image](https://user-images.githubusercontent.com/43699472/145678681-6e8de092-4ed9-466f-974b-43b41fdc188b.png)
 6. Configure the `Deployment` tab based on the picture below:
    - Add `imiger.war` to `Deploy at server startup`
    - Set `Application context` to `/imiger`
      ![image](https://user-images.githubusercontent.com/43699472/145678769-821ba4f4-f273-4d51-8631-458266897423.png)
 7. Press `Apply` and run the application using the configured run config


### Option B: Command Line

1. `cd` to `IMiGEr/sources/backend`
2. run `mvn clean install` to build a WAR archive of the backend application
    - the archive is then found in the `./imiger-core/target/` folder
3. consult your distro wiki for instructions about setting-up a tomcat manager user
    - for example, in Arch, the configuration file can be found at `/etc/tomcat8` under the name `tomcat-users.xml`
4. change the contents of this file to 
```
<?xml version='1.0' encoding='utf-8'?>
<tomcat-users>
  <role rolename="tomcat"/>
  <role rolename="manager-gui"/>
  <role rolename="manager-script"/>
  <role rolename="manager-jmx"/>
  <role rolename="manager-status"/>
  <role rolename="admin-gui"/>
  <role rolename="admin-script"/>
  <user username="tomcat" password="[CHANGE_ME]" roles="tomcat"/>
  <user username="manager" password="[CHANGE_ME]" roles="manager-gui,manager-script,manager-jmx,manager-status"/>
  <user username="admin" password="[CHANGE_ME]" roles="admin-gui"/>
</tomcat-users>
```
while selecting a good password instead of leaving `[CHANGE_ME]` unchanged.

5. run tomcat
    - `cd` into tomcat installation directory and run `startup.sh` OR run `systemctl start tomcat8.service` (depending on your distro)
    - after this, tomcat should be running, confirm this by opening `localhost:8080` in your browser.
6. go to `localhost:8080/manager/html`
7. enter the credentials you chose for "manager" in step 4
    - you should see the tomcat manager screen
    - you can turn off unnecessary tomcat endpoints if you want here, make sure to not turn off the manager itself
8. notice the `WAR file to deploy` tab, select the `imiger.war` file you built in step 2 and press `Deploy`
    - in the `Applications` overview table, an `/imiger` row should have appeared by now
    - if the value of `Running` for `/imiger` is True, deployment to `localhost:8080/imiger` was successful. You can confirm this by opening `localhost:8080/imiger/get-processing-modules`; you should see a small JSON printed out.
    - in case of failure, consult the catalina logs under `logs` in your tomcat installation directory.
