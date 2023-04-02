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

##docker-build-run: docker-compose run sharuco --build
docker-build-up:
	docker-compose up --build

##docker-build-run: docker-compose run sharuco
docker-run:
	docker-compose run sharuco

##help: show help
help : Makefile
	@sed -n 's/^##//p' $<


.PHONY: start build dev install preview lint docker-build docker-build-run docker-run
