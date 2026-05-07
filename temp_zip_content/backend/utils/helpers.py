import os
from datetime import datetime
import string
import random

def generate_random_filename(extension="mp4"):
    chars = string.ascii_lowercase + string.digits
    random_str = ''.join(random.choice(chars) for _ in range(8))
    return f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{random_str}.{extension}"

def clean_filename(filename):
    valid_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
    return ''.join(c for c in filename if c in valid_chars).replace(' ','_')
