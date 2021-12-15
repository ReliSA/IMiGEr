#!/bin/bash

# Stop tomcat
echo "Stopping tomcat ..."
$TOMCAT_HOME/bin/catalina.sh stop

echo "Checking prerequisities..."
# Check prerequisities
# - tomcat installed and env variable set
if [[ -z "${TOMCAT_HOME}" ]]; then
  echo "ERROR: TOMCAT_HOME variable is not set! Please set it to base directory of tomcat before proceeding"
  exit -1
fi
# - yarn installed
if ! command -v yarn &> /dev/null
then
  echo "ERROR: yarn is not installed. Please install it using 'sudo apt update && sudo apt install yarn'."
  exit -1
fi
# - maven installed
if ! command -v mvn &> /dev/null
then
  echo "ERROR: maven is not installed. Please install it using 'sudo apt update && sudo apt install maven'"
fi

(
# Build and deploy frontend
echo "Building frontend ..."
cd sources/frontend
yarn install
yarn build
( cd dist && tar c . ) | ( cd deploy/src/main/webapp && tar xf -)
cd deploy && mvn clean install
cp -f target/imiger-frontend.war $TOMCAT_HOME/webapps
)

(
# Build and deploy backend
echo "Building backend ..."
cd sources/backend
mvn clean install
cp -f imiger-core/target/imiger.war $TOMCAT_HOME/webapps
)

# Start Tomcat
echo "Starting tomcat ..."
$TOMCAT_HOME/bin/catalina.sh start

echo "IMiGEr is up and running"
echo "  - http://localhost:8080/imiger-frontend/index.html"
