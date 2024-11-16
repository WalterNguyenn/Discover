#!/usr/bin/env python3
import csv
import datetime
import serial
import time
import os


# Define your thresholds
pm25_threshold = 30
pm10_threshold = 50
location = "Bathroom #1"


# Initialize serial connection (Adjust to the correct USB port)
ser = serial.Serial('/dev/ttyUSB0', baudrate=9600, timeout=1)


def log_data_to_csv(current_time, location, status):
    # Directory path of the mounted Samba share
    directory_path = '/mnt/laolu'  # Update this path to the actual mount point on your Pi


    if not os.path.exists(directory_path):
        os.makedirs(directory_path)


    file_path = os.path.join(directory_path, 'vape_detection_log.csv')
    file_exists = os.path.isfile(file_path)


    with open(file_path, mode='a', newline='') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(["Time", "Location", "Status"])
        writer.writerow([current_time, location, status])


def read_from_sensor():
    ser.flushInput()
    data = ser.read(10)
    pm25 = pm10 = 0  # Initialize variables
    if len(data) == 10 and data[0] == 0xAA and data[1] == 0xC0:
        pm25 = int.from_bytes(data[2:4], byteorder='little') / 10
        pm10 = int.from_bytes(data[4:6], byteorder='little') / 10
       
        print(f"PM2.5: {pm25} μg/m³, PM10: {pm10} μg/m³")  # Display the current readings
        if pm25 > pm25_threshold or pm10 > pm10_threshold:
            return True, pm25, pm10
    return False, pm25, pm10


def main():
    last_logged_time = None
   
    try:
        while True:
            threshold_exceeded, pm25, pm10 = read_from_sensor()
            if threshold_exceeded:
                print("Threshold Exceeded")
                current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                # Log the data if this is the first exceedance or if at least one minute has passed since the last log
                if last_logged_time is None or (datetime.datetime.now() - last_logged_time) >= datetime.timedelta(minutes=1):
                    log_data_to_csv(current_time, location, "Exceeded")
                    last_logged_time = datetime.datetime.now()
            time.sleep(1)  # Check sensor every second
    except KeyboardInterrupt:
        print("Program terminated")
        ser.close()


if __name__ == "__main__":
    main()








