#!/bin/sh
rsync --progress -ave ssh . pi@192.168.0.52:/mnt/problem-master/
#ssh pi@192.168.0.52 sudo systemctl restart logger