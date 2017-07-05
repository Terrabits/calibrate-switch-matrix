from   rohdeschwarz.instruments.genericinstrument import GenericInstrument
from   ruamel import yaml
from   enum   import IntEnum
import re


class Spdt(IntEnum):
    nc = 0,
    no = 1
    def __str__(self):
        return str(self.value)

class Sp6t(IntEnum):
    t1 = 1,
    t2 = 2,
    t3 = 3,
    t4 = 4,
    t5 = 5,
    t6 = 6
    def __str__(self):
        return str(self.value)

class SwitchMatrix(GenericInstrument):
    def __init__(self, filename):
        GenericInstrument.__init__(self)
        self.switches = {}
        with open(filename, 'r') as f:
            self.switches = yaml.safe_load(f.read())

    def __getattr__(self, name):
        if _is_switch_name(name):
            address = self.switches[name.lower()]
            return self.switch_state(address)
        else:
            return super().__getattribute__(name)

    def __setattr__(self, name, value):
        if _is_switch_name(name):
            address = self.switches[name.lower()]
            if self.is_switch_state(address, value):
                return
            self.close_switch(address, value)
        else:
            super().__setattr__(name, value)

    def close_switch(self, address, state):
        instr   = address['instrument']
        module  = address['module']
        switch  = address['switch']
        state = _interpret_switch_state(state)
        scpi = _close_switch_scpi(instr, module, switch, state)
        self.write(scpi)

    def switch_state(self, address):
        state = 0
        while not self.is_switch_state(address, state):
            state += 1
        return state

    def is_switch_state(self, address, state):
        instr   = address['instrument']
        module  = address['module']
        switch  = address['switch']
        state = _interpret_switch_state(state)
        scpi = _query_switch_scpi(instr, module, switch, state)
        result = self.query(scpi).strip()
        if result == '1':
            return True
        else:
            return False

    def set_switches(self, switch_states):
    	for switch, state in switch_states.items():
    		self.__setattr__(switch, state)
    	self.pause()

def _close_switch_scpi(instr, module, switch, state):
    scpi = 'ROUT:CLOS (@F{0:02d}A{1:02d}({2:02d}{3:02d}))'
    scpi = scpi.format(instr, module, state, switch)
    return scpi

def _query_switch_scpi(instr, module, switch, state):
    scpi = 'ROUT:CLOS? (@F{0:02d}A{1:02d}({2:02d}{3:02d}))'
    scpi = scpi.format(instr, module, state, switch)
    return scpi

def _is_switch_name(name):
    return re.match('^k\d+', name, flags=re.IGNORECASE)

def _interpret_switch_state(state):
    if isinstance(state, str):
        state = state.lower()
        if state == 'nc':
            state = Spdt.nc
        elif state == 'no':
            state = Spdt.no
    return int(state)
