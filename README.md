R&S Switch Matrix Path
===========================

R&S Switch Matrix Path is a utility for commanding a R&S switch matrix rack solution to a particular path.

Installation
------------

### Windows

This application requires Windows 7 or newer.

To install, double-click the `R&S Switch Matrix Path x.y.z.exe` installation executable and follow the instructions. A shortcut is created on the desktop and in the start menu.

### Mac

Double-click the `Switch Matrix Path-x.y.z.dmg` file. A `Finder` window opens. Drag the application into the `Applications` folder.

### Linux

This application is written in `Node`, `Python` and cross-platform libraries. Therefore, it can be built for Linux. If you need a Linux version of the application please file a [feature request on Github](https://github.com/Terrabits/calibrate-switch-matrix/issues), contact a Rohde & Schwarz application engineer for assistance or see the build instructions section.

Build Instructions
------------------

This application requires `node` 6.x, `yarn` or `npm`, `python` 3.5.x and `pip`. To install dependencies, run `yarn` or `npm install`. Python dependencies are installed in this step as well.

For more information, see the build document: [BUILD.md](https://github.com/Terrabits/calibrate-switch-matrix/blob/switch-path/BUILD.md).

User-created Content
--------------------

This application relies on user-generated procedures and definition files for characterizing a specific switch matrix. These files can be located anywhere as long as they are accessible to the end-user and this application. That said, the suggested location for user-generated content is as follows.

For Windows:

`C:\Users\Public\Documents\Rohde-Schwarz\Switch Matrix Path`

For MacOS:

`/Users/Shared/Rohde-Schwarz/Switch Matrix Path`

How to Use
----------

Start the application. On Windows this can be done from the start menu. On MacOS from the app launcher or the `Applications` folder.

Enter the IP address of the switch matrix and choose a path file (of type `yaml`). The path file should conform to the format and directory structure described by [`R&S Calibrate Switch Matrix`](https://github.com/Terrabits/calibrate-switch-matrix)

Reporting Bugs
--------------

Please provide reproducible steps and supporting procedure/files, if possible.

In addition, the application generates a few log files that should be included with a bug report. All io to the VNA and Switch Matrix is captured in these logs, including SCPI command errors. Oftentimes a bug can be tracked down just from these logs.

The log files are located at:

Windows  
`C:\Users\<username>\AppData\Roaming\R&S Switch Matrix Path`

MacOS  
`~/Library/Application Support/R&S Switch Matrix Path`

There are three log files:

- `ui log.txt`
- `vna scpi log.txt`
- `matrix scpi log.txt`

Please include all the logs with the bug report.
