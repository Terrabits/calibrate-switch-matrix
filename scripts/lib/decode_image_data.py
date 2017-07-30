import base64
from   pathlib import Path
import re

def image_to_src(filename):
    extension = Path(filename).suffix.lower()
    if extension and extension[0] == '.':
        extension = extension[1:]
    data      = ''
    with open(filename, 'rb') as f:
        data = base64.b64encode(f.read()).decode()
        src = 'data:image/{0};base64,{1}'
        return src.format(extension, data)
    raise RuntimeError('Could not decode image')

def src_filename(line):
    regex = r'(?:.*)(?:\<img src=")(?P<filename>[^\"]+)(?:\")'
    result = re.match(regex, line, flags=re.IGNORECASE)
    if not result:
        return None
    else:
        filename = result.group('filename')
        print("found: '{0}'".format(filename))
        return filename
