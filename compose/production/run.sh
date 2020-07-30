#!/bin/sh

git pull &&
sudo docker-compose -f sentry.yml up -d &&
sudo docker-compose -f production.yml up -d

/usr/sbin/sshd -D
