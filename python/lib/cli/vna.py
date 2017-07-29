from   rohdeschwarz.instruments.vna import Vna

def is_vna(args):
    return process(args) != None

def cal_groups(args):
    vna = process(args)
    if not vna:
        return False
    print(",".join(vna.cal_groups))
    return True

def is_cal_unit(args):
    if not is_vna(args):
        return False
    vna = process(args)
    if not vna.cal_units:
        print('No VNA cal unit found', flush=True)
        return False
    else:
        return True

def cal_unit_ports(args):
    if not is_vna(args):
        return False
    if not is_cal_unit(args):
        return False
    vna = process(args)
    ports = vna.cal_unit().ports
    if not ports:
        print('Could not retrieve cal unit ports')
        return False
    else:
        print(ports)
        return True

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
    		return None
    # All good
    return vna
