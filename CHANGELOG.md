R&S Calibrate Switch Matrix Change Log
======================================

2017-09-12 Version 0.9.0
------------------------

* Existing cal group bug(s) fixed. User choice persists despite back/next.
* Procedure dialog opens `yaml` files only, starts in documented default location
* Alerts are persistent and dismissible
* Restart button added
* Invalid vna set files are detected and a user-friendly error messsage provided

2017-08-06 Version 0.8.3
------------------------

* Fixed a bug when choosing existing cal group
* Added application log file (`ui log.txt`)
* Updated documentation

2017-07-30 Version 0.8.2
------------------------

* Fixed an issue with timing of measurements on the ZVA which caused touchstone file generation to fail.
* Added more specific error messages
* Added vna, switch matrix scpi command logs
* improved documentation

2017-07-25 Version 0.80, 0.81
-----------------------------

Initial version.

* `Calibrate` option does not work.
* Calibration: `None` option does not work with the R&S ZVA because of bugs with the R&S ZVA.
