# Backend deployment instructions
This document describes the deoployment options that can be used to run the backend using three different ways.

## Docker-Compose

## IntelliJ Idea

### Prerequisities:

 - Java 15
 - Maven
 - Tomcat
 - MySql server
    - there must be a schema with name `visualization_tool` available in the database
    - the database must be initialized with `sources/backend/imiger-core/src/main/resources/create_table.sql`
    - correct name and password must be set in `sources/backend/imiger-core/src/main/resources/mybatis-config.xml`

### Configuration of IntelliJ

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


## Command Line
