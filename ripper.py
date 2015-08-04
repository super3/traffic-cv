import time
import shutil
import requests
import threading


# config
base_url = "http://traffic.sandyspringsga.org/CameraImage.ashx?cameraId={0}"
camera_list = [16]


def worker(camera_id):
    """thread worker function"""
    loop = True
    timestamp = time.time()

    try:
        # loop
        while loop:
            print("delay" + str(camera_id) + ":" + str(time.time() - timestamp))
            timestamp = time.time()
            img_file = 'C://CV/cam{0}/{1}.png'.format(str(camera_id), str(timestamp))

            response = requests.get(base_url.format(camera_id), stream=True)
            with open(img_file, 'wb') as out_file:
                shutil.copyfileobj(response.raw, out_file)
            del response

            print("Requesting " + img_file)
            print("Saved " + img_file + "\n")

            time.sleep(0.1)
    except KeyboardInterrupt:
        loop = False
    return


threads = []
for camera in camera_list:
    t = threading.Thread(target=worker, args=(camera,))
    threads.append(t)
    t.start()
