# UI Tests

This folder contains a test suite for various UI interactions. Tests are written and run by [Robot Framework](http://robotframework.org).

## How to Run It

### 1. Install pip

pip is a Python package management system which can be used to install Robot Framework. Get it at https://pip.pypa.io/en/stable/quickstart/.

### 2. Install Robot Framework using pip

`pip install robotframework`
`pip install robotframework-seleniumlibrary`

### 3. Install browser controlling driver

Tests written in Robot Framework have Selenium under cover. Selenium uses a headless browser to automatically interact with a webpage like a normal user would. For that, browser controller must be installed.

There are basically two options:
1. [geckodriver](https://github.com/mozilla/geckodriver/releases)
2. **[chromedriver](https://sites.google.com/a/chromium.org/chromedriver/downloads)** (default)

You should put path to the driver folder to your `Path`. Obviously, you should have Firefox or Chrome installed too for geckodriver/chromedriver to work.

### 4. Run Robot Framework

Assuming you have Python's Scripts folder added to your `Path`, you should be able to run all test suits:

`robot ./`

To set a custom output folder, use option `--outputdir`:

`robot --outputdir ./output ./`

To run a single test suit, point to that file:

`robot --outputdir ./output ./graph.robot`

To run a particular test from a test suite, use option `--test`:

`robot --outputdir ./output --test "General" ./graph.robot`

### 5. Check results

In your output folder (`./` by default), there should be a HTML file called `report.html`. It contains additional details about executed test runs.
