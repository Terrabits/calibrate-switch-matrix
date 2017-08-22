from   pathlib import Path
import os

def find_driver(root_path):
    for current_dir in Path(root_path).parents:
        for filename in os.listdir(str(current_dir)):
            if filename.lower() == 'switches.yaml':
                return str(current_dir / filename)
    return None
