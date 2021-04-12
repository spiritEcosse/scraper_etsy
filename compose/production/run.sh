#!/bin/sh

git pull &&
sudo docker-compose -f production.yml up -d

/usr/sbin/sshd -D
