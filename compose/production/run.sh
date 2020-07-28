#!/bin/zsh

cd scraper_etsy &&
docker-compose -f sentry.yml up -d &&
docker-compose -f production.yml up -d &&
