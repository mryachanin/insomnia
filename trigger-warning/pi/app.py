#!/usr/bin/python3

import logging
import time
import urllib.error
import urllib.request
import urllib.parse

from gpiozero import Button

base_url = 'http://localhost:8080/'
start_url = base_url + 'start'
stop_url = base_url + 'stop'
interrupt_url = base_url + 'interrupt'

on_off_gpio = 18
interrupt_gpio = 4
switch_max_rate_in_seconds = 1

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

on_off_button = Button(on_off_gpio)
interrupt_button = Button(interrupt_gpio)

on_off_last = on_off_button.is_pressed

def exec_request(url):
    try:
        r = urllib.request.urlopen(url)
        logging.info(r.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        logging.error(e)

while True:
    on_off_state = on_off_button.is_pressed
    if on_off_state != on_off_last:
        if on_off_state:
            logging.info('Start sleep tracking')
            exec_request(start_url)
        else:
            logging.info('Stop sleep tracking')
            exec_request(stop_url)
        on_off_last = on_off_state
        time.sleep(switch_max_rate_in_seconds)

    interrupt_state = interrupt_button.is_pressed
    if not interrupt_state:
        logging.info('Interrupt sleep tracking')
        exec_request(interrupt_url)
        time.sleep(switch_max_rate_in_seconds)