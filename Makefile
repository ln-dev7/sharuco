##install: npm install
install:
	npm install

##dev: next dev
dev:
	npm run dev

##build: next build
build:
	npm run build

##start: next start
start:
	npm run start

##lint: next lint
lint:
	npm run lint

##preview: next build && next start
preview:
	npm run preview

##docker-build: docker build sharuco
docker-build:
	docker build --rm -t ln-dev7/sharuco:latest -f ./Dockerfile .

##docker-build-up: docker-compose up --build
docker-build-up:
	docker-compose up --build -d

##docker-up: docker-compose up
docker-up:
	docker-compose up

##docker-stop: docker stop sharuco_sharuco_1 sharuco_firebase_1
docker-stop:
	docker stop sharuco_sharuco_1 sharuco_firebase_1

##firebase-login: exec into the sharuco_firebase_1 and login first then import datas
firebase-login:
	docker exec -ti sharuco_firebase_1 firebase login:ci --no-localhost

##import-db: exec into the sharuco_firebase_1 and login first then import datas
import-db:
	docker exec -ti sharuco_firebase_1 firebase emulators:start --import=./data --export-on-exit=all

##docker-build-run: docker-compose run sharuco
docker-run:
	docker-compose run sharuco

##help: show help
help : Makefile
	@sed -n 's/^##//p' $<


.PHONY: start build dev install preview lint docker-build docker-build-up docker-run
