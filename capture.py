import os
import cv2
import time
import glob
import shutil
import requests
import threading
from datetime import datetime


# config
base_url = "http://traffic.sandyspringsga.org/CameraImage.ashx?cameraId={0}"
camera_list = [23, 28, 30, 31]
store_path = "C://CV//"


def worker(cam_id):
    """Thread worker function."""

    # Initialize vars
    loop = True
    timestamp = time.time()

    try:
        while loop:
            timestamp = capture(cam_id, timestamp)

    except KeyboardInterrupt:
        loop = False
    return


def capture(cam_id, timestamp):
    # find delay since last frame
    delay = round(time.time() - timestamp, 3)
    print("Delay on Camera {0} is {1} seconds.".format(cam_id, delay))
    timestamp = time.time()

    # pull from url
    print("Requesting {0}".format(base_url.format(cam_id)))
    response = requests.get(base_url.format(cam_id), stream=True)

    # generate paths
    today_date = datetime.now().strftime("%m-%d-%y")
    base_folder = '{0}cam{1}//'.format(store_path, cam_id)
    img_folder = '{0}{1}//'.format(base_folder, today_date)
    img_file = '{0}{1}.png'.format(img_folder, timestamp)

    # make sure path exists
    if not os.path.exists(base_folder):
        os.mkdir(base_folder)
    if not os.path.exists(img_folder):
        os.mkdir(img_folder)

    # save image
    with open(img_file, 'wb') as out_file:
        shutil.copyfileobj(response.raw, out_file)
    del response
    print("Saved " + img_file + "\n")

    # pause a bit
    time.sleep(0.1)

    return timestamp


def show_cams(camera_list):
    dir_path = "C:\\CV\\cam23\\10-06-15\\"

    while True:
        newest = max(glob.iglob(dir_path+'*.png'), key=os.path.getctime)
        img = cv2.imread(newest)
        cv2.imshow('image', img)
        time.sleep(0.5)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break


def start_up():
    threads = []
    for camera in camera_list:
        t = threading.Thread(target=worker, args=(camera,))
        threads.append(t)
        t.start()

    show_cams(camera_list)



if __name__ == "__main__":
    start_up()