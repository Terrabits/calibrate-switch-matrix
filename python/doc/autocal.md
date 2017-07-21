Potential ZVA, ZNB compatible solution
--------------------------------------

- Start calibration: `[SENSe<Ch>:]CORRection:COLLect:AUTO:CONFigure FNP, ''`
- For a particular step:
  * Query port connections: `SENS:CORR:COLL:AUTO:PORT:CONN?`
  * If not VNA ports connected, sys.exit(1)
  * Create current step: `[SENSe<Ch>:]CORRection:COLLect:AUTO:ASSignment<asg>:DEFine <VnaPort1>, <TestPort1>, <VnaPort2>, <TestPort2>, ...`
  * Perform step: `[SENSe<Ch>:]CORRection:COLLect:AUTO:ASSignment<Asg>:ACQuire`
- When all steps are done, save: `[SENSe<Ch>:]CORRection:COLLect:AUTO:SAVE`

If ZNx
------

Multi-port assignment auto calibration:

- `[SENSe<Ch>:]CORRection:COLLect:AUTO:CONFigure FNP, ''`
- `[SENSe<Ch>:]CORRection:COLLect:AUTO:ASSignment<step>:DEFine:TPORt <TestPort1>, <TestPort2>...`
- VNA ports connected? vna.cal_unit().vna_ports_connected
- `[SENSe<Ch>:]CORRection:COLLect:AUTO:ASSignment<step>:ACQuire`
- `[SENSe<Ch>:]CORRection:COLLect:AUTO:SAVE`

ZVx Routine
-----------

There is no automatic port detection version of the multi-step auto cal. Need to make specific, (pre?)defined port connections

- `[SENSe<Ch>:]CORRection:COLLect:AUTO:CONFigure FNP, ''`
- `[SENSe<Ch>:]CORRection:COLLect:AUTO:ASSignment<asg>:DEFine <VnaPort1>, <TestPort1>, <VnaPort2>, <TestPort2>, ...`
- `[SENSe<Ch>:]CORRection:COLLect:AUTO:ASSignment:COUNt?` (Not on ZVA?)
- `[SENSe<Ch>:]CORRection:COLLect:AUTO:ASSignment<Asg>:ACQuire`
- `[SENSe<Ch>:]CORRection:COLLect:AUTO:SAVE`

Query port connections for step? `[SENSe<Ch>:]CORRection:COLLect:AUTO:ASSignment<Asg>:DEFine?`
