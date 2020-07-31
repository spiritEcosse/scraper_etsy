#!/usr/bin/env bash
PORT_WEB?=8000
COMPOSE_FILE?=local.yml
PORT_DB?=5432
PROJECT?=test
COMMIT_MESSAGE?=
REPO=shevchenkoigor/scraper_etsy
REPO_TEST=shevchenkoigor/panda_test
DOCKER_FILE=compose/local/django/Dockerfile
DOCKER_PROD_FILE=compose/production/django/Dockerfile
DOCKER_FILE_TEST=compose/test/django/Dockerfile
APP?=

makemessages:
	docker-compose -f ${COMPOSE_FILE} exec django ./manage.py makemessages -a

compilemessages:
	export COMPOSE_FILE=${COMPOSE_FILE} \
	&& docker-compose exec django ./manage.py compilemessages

deploy:
	docker build -t ${REPO}:django -f ${DOCKER_PROD_FILE} .
	docker push ${REPO}:django
	docker build -t ${REPO}:node -f compose/production/node/Dockerfile frontend
	docker push ${REPO}:node
	ssh igor@192.168.1.182 "\
		cd scraper_etsy && \
		sudo docker-compose -f production.yml run --rm django rm -f celerybeat.pid && \
		sudo docker-compose -f production.yml stop && \
		sudo docker pull shevchenkoigor/scraper_etsy:node && \
		sudo docker pull shevchenkoigor/scraper_etsy:django && \
		git pull && \
		sudo docker-compose -f production.yml up -d"

migrate:
	export COMPOSE_FILE=${COMPOSE_FILE} \
	&& docker-compose run --rm django ./manage.py makemigrations \
	&& docker-compose run --rm django ./manage.py migrate

shell:
	docker-compose -f ${COMPOSE_FILE} run --rm django ./manage.py shell

pytest:
	docker-compose -f ${COMPOSE_FILE} run --rm django pytest

db_connection:
	ocker-compose -f ${COMPOSE_FILE} exec postgres watch 'psql -U debug -d scraper_etsy -c "SELECT client_addr, client_port, state FROM pg_stat_activity"'

tests:
	docker-compose -f ${COMPOSE_FILE} run --rm django tests

stop_rm_up:
	export COMPOSE_FILE=${COMPOSE_FILE} \
	&& docker-compose stop \
	&& docker-compose rm -f \
	&& docker-compose up --build --remove-orphans

up:
	export COMPOSE_FILE=${COMPOSE_FILE} \
	&& docker-compose down \
	&& docker-compose up

up_node:
	export COMPOSE_FILE=${COMPOSE_FILE} \
	&& docker-compose stop node \
	&& docker-compose rm -f node \
	&& docker-compose up node

up_build:
	export COMPOSE_FILE=${COMPOSE_FILE} \
	&& docker-compose rm -f node \
	&& docker-compose stop \
	&& docker-compose up --build

deploy_hard:
	export COMPOSE_FILE=${COMPOSE_FILE} \
	&& docker-compose stop \
	&& docker-compose rm -f \
	&& docker-compose up --build --remove-orphans --scale initial-data=0

tagged_django_image:
	sed -i "s%panda:.*%panda:`git rev-parse --abbrev-ref HEAD`%g" ${COMPOSE_FILE}
	sed -i "s%panda:.*%panda:`git rev-parse --abbrev-ref HEAD`_test%g" test.yml

build_django:
	docker build -t ${REPO}:`git rev-parse --abbrev-ref HEAD` -f ${DOCKER_FILE} .

commit: tagged_django_image
	git add .
	git commit -m '${COMMIT_MESSAGE}'
	git branch --set-upstream-to=origin/`git rev-parse --abbrev-ref HEAD` `git rev-parse --abbrev-ref HEAD`
	git push
	docker build -t ${REPO}:`git rev-parse --abbrev-ref HEAD` -f ${DOCKER_FILE} .
	docker push ${REPO}:`git rev-parse --abbrev-ref HEAD`
	docker build -t ${REPO}:`git rev-parse --abbrev-ref HEAD`_test -f ${DOCKER_FILE_TEST} .
	docker push ${REPO}:`git rev-parse --abbrev-ref HEAD`_test

docker_build_push:
	docker build -t ${REPO}:`git rev-parse --abbrev-ref HEAD` -f ${DOCKER_FILE} .
	docker push ${REPO}:`git rev-parse --abbrev-ref HEAD`
	docker build -t ${REPO}:`git rev-parse --abbrev-ref HEAD`_test -f ${DOCKER_FILE_TEST} .
	docker push ${REPO}:`git rev-parse --abbrev-ref HEAD`_test

docker_pull:
	docker pull ${REPO}:`git rev-parse --abbrev-ref HEAD`

deploy_hard:
	export COMPOSE_FILE=${COMPOSE_FILE} && docker-compose stop && docker-compose rm -f && docker-compose up --build --remove-orphans --scale initial-data=0

stop_rm:
	export COMPOSE_FILE=${COMPOSE_FILE} && docker-compose stop && docker-compose rm -f

rm_volumes:
	docker volume rm -f panda_local_postgres_data panda_local_postgres_data_backups
	#panda_local_solr_data

rm_hard: stop_rm rm_volumes

rm_image_test:
	docker image rm -f ${REPO}:`git rev-parse --abbrev-ref HEAD`_test

build_local:
	docker build -t panda:`git rev-parse --abbrev-ref HEAD` -f compose/local/django/Dockerfile .

build_test:
	docker build -t ${REPO}:`git rev-parse --abbrev-ref HEAD`_test -f ${DOCKER_FILE_TEST} .

build_test_hard: rm_image_test
	docker build -t ${REPO}:`git rev-parse --abbrev-ref HEAD`_test -f ${DOCKER_FILE_TEST} .

deploy_build:
	docker-compose -f ${COMPOSE_FILE} up --build --scale initial-data=0

logs:
	docker-compose -f ${COMPOSE_FILE} logs -f

initial-data_bash:
	docker-compose -f ${COMPOSE_FILE} run initial-data bash

initial-data:
	docker-compose -f ${COMPOSE_FILE} up initial-data

initial-data_logs:
	docker-compose -f ${COMPOSE_FILE} logs initial-data

django_stop_rm:
	docker-compose -f ${COMPOSE_FILE} stop django
	docker-compose -f ${COMPOSE_FILE} rm -f django

django-logs:
	docker-compose -f ${COMPOSE_FILE} logs django

kibana-logs:
	docker-compose -f ${COMPOSE_FILE} logs kibana

elasticsearch_logs:
	docker-compose -f ${COMPOSE_FILE} logs elasticsearch

django_reupd: django_stop_rm
	docker-compose -f ${COMPOSE_FILE} up -d django

initial_data_stop_rm:
	docker-compose -f ${COMPOSE_FILE} stop initial-data
	docker-compose -f ${COMPOSE_FILE} rm -f initial-data

initial_data_reupd: initial_data_stop_rm
	docker-compose -f ${COMPOSE_FILE} up -d initial-data

#install: initial-data deploy_build

collectstatic:
	docker-compose -f ${COMPOSE_FILE} run --rm django ./manage.py collectstatic --noinput

freeze:
	docker-compose -f ${COMPOSE_FILE} exec django pip freeze

restart_django:
	export COMPOSE_FILE=${COMPOSE_FILE} && docker-compose stop django && docker-compose start django

restart_django_hard:
	docker-compose rm django && docker-compose stop django && docker-compose start django

clear_db:
	docker-compose exec django python manage.py flush --noinput

pass_change_admin:
	docker-compose -f ${COMPOSE_FILE} run --rm django python manage.py changepassword admin

create_superuser:
	docker-compose -f ${COMPOSE_FILE} run --rm django python manage.py createsuperuser

startapp:
	docker-compose -f ${COMPOSE_FILE} run --rm django python manage.py startapp ${APP}
	sudo chown igor:users -R ${APP}
	mv ${APP} panda

ipython:
	docker-compose -f ${COMPOSE_FILE} run --rm django ipython

bash:
	docker-compose -f ${COMPOSE_FILE} run --rm django sh

node_npm_install:
	docker-compose -f ${COMPOSE_FILE} run --rm node npm i --save $(PKG)

bash_test:
	docker-compose -f test.yml -p test run --rm django sh

sh:
	docker-compose -f ${COMPOSE_FILE} run --rm django sh

rebuild_index:
	docker-compose -f ${COMPOSE_FILE} run --rm django python manage.py rebuild_index --noinput

update_index:
	docker-compose -f ${COMPOSE_FILE} run --rm django python manage.py update_index

django_populate_countries:
	docker-compose -f ${COMPOSE_FILE} run --rm django python manage.py oscar_populate_countries

PYTEST = py.test

##################
# Install commands
##################


##################
# Tests and checks
##################
stop_rm:
	export COMPOSE_FILE=test.yml && docker-compose stop && docker-compose rm -f

tox:
	docker-compose -f test.yml -p test run --rm django tox

tox_parallel:
	docker-compose -f test.yml -p test run --rm django tox -p all

build_tox: build_test
	docker-compose -f test.yml -p test run --rm django tox

#test: venv ## Run tests
test:
	docker-compose -f test.yml -p test run --rm django tox -e py36-oscar201

retest: venv ## Run failed tests only
	docker-compose -f test.yml -p test run --rm django $(PYTEST) --lf

tests_unit:
	docker-compose -f test.yml -p test run --rm django $(PYTEST) --cov=panda -m unit tests/panda/

tests_integration:
	docker-compose -f test.yml -p test run --rm django $(PYTEST) -m integration tests/panda/

tests_unit_coverage_html:
	$(PYTEST) --cov=panda --cov-report=html -m unit tests/panda/

tests_all_coverage:
	docker-compose -f test.yml -p test run --rm django $(PYTEST) --cov=panda tests/panda/

lint: ## Run flake8 and isort checks
	flake8 src/oscar/
	flake8 tests/
	isort -q --recursive --diff src/
	isort -q --recursive --diff tests/

test_migrations: ## Tests migrations
	./test_migrations.sh


# Solr
# locally

solr-install:
	wget http://archive.apache.org/dist/lucene/solr/4.7.2/solr-4.7.2.tgz
	tar xzf solr-4.7.2.tgz
	./manage.py build_solr_schema > solr-4.7.2/example/solr/collection1/conf/schema.xml
	cd solr-4.7.2/example
	java -jar start.jar

rm_volume_solr:
	docker volume rm -f panda_local_solr_data

solr-bash:
	docker-compose -f ${COMPOSE_FILE} run solr bash

solr-logs:
	docker-compose -f ${COMPOSE_FILE} logs solr

solr_stop_rm:
	export COMPOSE_FILE=${COMPOSE_FILE} && docker-compose stop solr && docker-compose rm -f solr

solr-reupd: solr_stop_rm
	docker-compose -f ${COMPOSE_FILE} up -d --build solr

solr-create-collection: solr_stop_rm rm_volume_solr
	export COMPOSE_FILE=${COMPOSE_FILE} && docker-compose up -d --build solr && docker-compose exec solr solr create -c panda

build_solr_schema:
	rm -fr schema.xml
	export COMPOSE_FILE=${COMPOSE_FILE} && docker-compose build django && docker-compose run --rm django python manage.py build_solr_schema > schema.xml

clean: ## Remove files not in source control
	find . -type f -name "*.pyc" -delete
	rm -rf nosetests.xml coverage.xml htmlcov *.egg-info *.pdf dist violations.txt

run_tests:
	rm -fr tests/public/media/products/
	$(PYTEST)

deploy_prod:
	java -jar jenkins-cli.jar -s http://127.0.0.1:8094/ build panda
