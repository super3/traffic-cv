import os
import time
import shutil
import requests
import threading
from datetime import datetime


# config
base_url = "http://traffic.sandyspringsga.org/CameraImage.ashx?cameraId={0}"
camera_list = [28, 30, 31]
store_path = "C://CV//"


# worker function
def worker(camera_id):
    """thread worker function"""
    loop = True
    timestamp = time.time()

    try:
        # loop
        while loop:
            # delay since last frame
            delay = round(time.time() - timestamp, 3)
            print("Delay on Camera {0} is {1} seconds.".format(camera_id, delay))
            timestamp = time.time()

            # pull from url
            print("Requesting {0}".format(base_url.format(camera_id)))
            response = requests.get(base_url.format(camera_id), stream=True)

            # save image
            today_date = datetime.now().strftime("%m-%d-%y")
            base_folder = '{0}cam{1}//'.format(store_path, camera_id)
            img_folder = '{0}{1}//'.format(base_folder, today_date)
            img_file = '{0}{1}.png'.format(img_folder, timestamp)
            if not os.path.exists(base_folder):
                os.mkdir(base_folder)
            if not os.path.exists(img_folder):
                os.mkdir(img_folder)
            with open(img_file, 'wb') as out_file:
                shutil.copyfileobj(response.raw, out_file)
            del response
            print("Saved " + img_file + "\n")

            # pause a bit
            time.sleep(0.1)
    except KeyboardInterrupt:
        loop = False
    return


# start multi-threading
threads = []
for camera in camera_list:
    t = threading.Thread(target=worker, args=(camera,))
    threads.append(t)
    t.start()
