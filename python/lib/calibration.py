import pdb

def make_step(vnaPorts):
    result = []
    for i in range(0, len(vnaPorts)):
        result.append([vnaPorts[i], i+1])
    return result

def create_steps(ports, cal_unit_ports):
    if cal_unit_ports <= 1:
        return []
    if not ports:
        return []

    ports = ports.copy()

    if len(ports) == 1:
        return [[[*ports, 1]]]

    ports.sort()
    common_port = ports.pop(0)
    steps = []
    while ports:
        if len(ports) > cal_unit_ports - 1:
            vnaPorts = ports[0 : cal_unit_ports-1]
            vnaPorts.insert(0, common_port)
            steps.append(make_step(vnaPorts))
            ports = ports[cal_unit_ports-1:]
        else:
            vnaPorts = ports.copy()
            vnaPorts.insert(0, common_port)
            steps.append(make_step(vnaPorts))
            ports.clear()
    return steps
