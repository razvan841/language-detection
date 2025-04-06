import os
import shutil
import random
import time

# Path
def get_src_path():
    return os.path.dirname(__file__)

# Folder management
def clear_folder(path):
    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print("Failed to clear folder %s. Reason: %s" % (file_path, e))

def require_folder(path, empty = True):
    if not os.path.exists(path):
        os.makedirs(path)
    elif empty:
        clear_folder(path)

# Unique numbers
USED_NUMBERS = set()
TIMEDOUT_NUMBERS = {}

def use_number():
    global USED_NUMBERS

    # Numbers have a 10 sec timeout time
    current_time = time.time()
    for j in list(TIMEDOUT_NUMBERS):
        if current_time - TIMEDOUT_NUMBERS[j] < 10:
            continue

        TIMEDOUT_NUMBERS.pop(j, 0)

    i = random.randint(0, max(USED_NUMBERS, default=0) + 100)
    while (i in USED_NUMBERS or i in TIMEDOUT_NUMBERS):
        i = random.randint(0, max(USED_NUMBERS, default=0) + 100)
    
    USED_NUMBERS.add(i)
    return i

def free_number(i):
    global USED_NUMBERS

    TIMEDOUT_NUMBERS[i] = time.time()
    USED_NUMBERS.remove(i)

