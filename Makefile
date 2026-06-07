.PHONY: up down restart status logs db-shell build test clean run

up:
	docker-compose up -d

run: up
	@echo "Waiting for infrastructure..."
	@sleep 3
	set -a && . ./.env && set +a && ./mvnw spring-boot:run

down:
	docker-compose down

restart:
	docker-compose down && docker-compose up -d

status:
	docker-compose ps

logs:
	docker-compose logs -f

db-shell:
	docker exec -it orderly-postgres psql -U orderly_admin -d orderly_db

build:
	mvn clean package -DskipTests

test:
	./mvnw test

clean:
	./mvnw clean