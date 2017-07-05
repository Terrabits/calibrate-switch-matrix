R&S Measure TS-RFU2 Path
========================

This application measures the S-parameters of a specific path through the TS-RFU2 switch matrix using ports 1 and 2 of an R&S ZVA40 Vector Network Analyzer.

Installation
------------

Note:

This application works both on- and off-instrument with appropriate TCP (ethernet, WiFi) connections to the TS-RFU2 and ZVA.

### Windows

To install, double-click the `R&S Measure TS-RFU2 Path.exe` installation executable and follow the instructions. The utility can be found in the Start Menu.

### Mac, Linux

Versions of this application can be generated for other platforms. If this is helpful, please contact your local R&S application engineer for help.

Instructions
------------

### IP Addresses

Provide the IP address for both the R&S ZVA40 (VNA) and the TS-RFU2 (Switch Matrix). If the application is installed on the ZVA itself, the VNA IP address is `127.0.0.1` (localhost).

### VNA Calibration

Provide the name of the `cal group`, saved to the `cal pool` on-instrument, that you would like applied to your measurement.

### Measurement Definition

The measurement definition includes the settings that need to be applied for the measurement, including:

- VNA set file
- VNA ports (ports 1, 2 are default)
- Switch matrix state

The following directory structure is assumed:

`Project Root`
- `measurements`
- `results`
- `sets`

#### Sets

The `sets` folder should contain any relevant ZVA set files (`.zvx`), which are files that include a VNA configuration to be applied before the measurement.

#### Results

The `results` folder, appropriately enough, is the location where the measurement result (`.s2p` file) will be saved.

#### Measurements

The `measurements` folder contains the measurement definition files. The files are in a simple YAML format. YAML is a simple format that is intuitive to use.

#### Measurement definition example

Let's start with an example measurement definition file:

Filename: `Rx_IFH_Out1.yaml`
```yaml
vna set file:   'all'
vna ports used:
    - 1
    - 2
switch states:
  K10: nc
  K11: nc
  K14: nc
  K16: nc
  K46:  2
  K47: nc
```

##### VNA setup

This measurement definition requires the `sets/all.zvx` VNA set file to be applied before measurement. It also specifies the use of VNA ports 1 and 2 for measurement. The ports parameter is optional; if no parameter is applied ports 1 and 2 will be used by default.

##### Switch matrix switch states

It also requires a list of switch matrix switches to be set before measurement.

##### Result

Using the VNA IP address, calibration, and switch matrix IP address specified in the user interface (see above), the measurement is performed.

The results are saved as `results/Rx_IFH_out1.s2p`. The touchstone filename is derived from the measurement definition filename.
