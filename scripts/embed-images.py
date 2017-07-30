from lib import image_to_src
from lib import src_filename

from   glob import glob
import os
import re

# print(os.getcwd())

def process(line):
    filename = src_filename(line)
    if not filename:
        return line
    else:
        return line.replace(filename, image_to_src(filename))
    # 1. look for (and parse) <img src="<filename>"
    # 2. if filename:
    # 3.   src = image_to_src(filename)
    # 4.   re.sub(r'<filename>', 'src')

html_files = glob('*.html')
for i in html_files:
    print("Processing '{0}'".format(i))
    content = ''
    with open(i, 'r') as f:
        for line in f.readlines():
            content += process(line)
    with open(i, 'w') as f:
        f.write(content)
