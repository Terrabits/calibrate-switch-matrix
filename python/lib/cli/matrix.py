def cleanup(matrix):
    if not matrix:
        return
    matrix.is_error()
    matrix.clear_status()
    if matrix.log:
    	matrix.close_log()
    matrix.local()
    matrix.close()
