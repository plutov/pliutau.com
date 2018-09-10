build:
	docker build -t blog --no-cache .
	docker tag blog pltvs/blog

run:
	docker run -p 1313:80 blog

push:
	docker push pltvs/blog