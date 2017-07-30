Build Instructions for R&S Calibrate Switch Matrix
==================================================

Requirements
------------

* Python 3.5.x
* Node 6.11.x
* [yarn](https://yarnpkg.com/en/)

Yarn is somewhat optional, although I have had issues installing dependencies from this project with `npm`. Also, since this project is developed with `yarn`, the `yarn.lock` file will recreate the exact `node_modules` environment as is being used in development and production.

Build Instructions
------------------

### Setup project

From the command line:

* Clone this project from [the repo on Github](https://github.com/Terrabits/calibrate-switch-matrix)  
`git clone https://github.com/Terrabits/calibrate-switch-matrix.git`
* `cd` into project root directory
* Enter `yarn`

That's it. Python requirements should automatically install as well.

### Development

From the command line:

`yarn run dev`

An `electron` instance will appear, with `react` hot loading for live changes.

### Production test

`yarn run prod`

### Distribution

`yarn run package`

See `dist/` folder for packaged installer
