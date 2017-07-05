class MockArgs:
    def __init__(self):
        # actions
        self.is_vna         = None
        self.is_matrix      = None
        self.is_procedure   = None
        self.is_cal_group   = None
        self.is_cal_unit    = None
        self.cal_unit_ports = None
        self.start_calibration = None
        self.perform_calibration_step = None
        self.apply_calibration = None
        self.save_calibraiton  = None
        self.measure        = None
        # settings
        self.vna_address      = None
        self.vna_log_filename = None
        self.cal_group        = None
        self.matrix_address   = None
        self.matrix_log_filename = None
        self.procedure_filename  = None
        self.step             = None
