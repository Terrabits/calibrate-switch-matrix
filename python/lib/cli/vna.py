from   rohdeschwarz.instruments.vna import Vna

def is_vna(args):
    return process(args) != None

def is_cal_group(args):
    vna = process(args)
    if not vna:
        return False
    if not vna.is_cal_group(args.cal_group):
        print('Cal group not found', flush=True)
        return False
    else:
        return True

def is_cal_unit(args):
    vna = process(args)
    if not vna:
        return False
    # TODO: this method does not exist
    if not vna.is_cal_unit():
        print('No VNA cal unit found', flush=True)
        return False
    else:
        return True

def cal_unit_ports(args):
    if not is_vna(args):
        return 0
    if not is_cal_unit(args):
        return 0

    vna = process(args)
    # TODO: Add to rohdeschwarz
    ports = 2 # vna.cal_unit(i).ports
    print(ports, flush=True)
    return ports

def process(args):
    if not args.vna_address:
    	print("VNA address missing", flush=True);
    	return None

    vna = Vna()
    try:
    	vna.open_tcp(args.vna_address)
    except:
    	msg = 'Could not find VNA'
    	print(msg, flush=True)
    	return None
    if args.vna_log_filename:
    	try:
    		vna.open_log(args.vna_log_filename)
    		vna.print_info()
    	except:
    		print('Problem generating VNA scpi log', flush=True)
    		vna.local()
    		return None
    # All good
    return vna
