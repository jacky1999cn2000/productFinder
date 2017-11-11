install:
	docker run -i --rm --name install -v `pwd`:/usr/src/app -w /usr/src/app node:8 npm install

run: install
	docker-compose down
	docker-compose up

bash:
	docker run -it --rm -v `pwd`:/usr/src/app -w /usr/src/app --entrypoint="bash" node:8
