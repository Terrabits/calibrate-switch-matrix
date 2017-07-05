def create_steps(ports, cal_unit_ports):
    if cal_unit_ports <= 1:
        return []
    if not ports:
        return []

    ports = ports.copy()

    if len(ports) == 1:
        return [ports]

    ports.sort()
    common_port = ports.pop(0)
    steps = []
    while ports:
        if len(ports) > cal_unit_ports - 1:
            step = ports[0 : cal_unit_ports-1]
            step.insert(0, common_port)
            steps.append(step)
            ports = ports[cal_unit_ports-1:]
        else:
            step = ports.copy()
            step.insert(0, common_port)
            steps.append(step)
            ports.clear()
    return steps
