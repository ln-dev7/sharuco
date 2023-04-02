FROM node:18.14.2-slim

WORKDIR /app

# We install make to read Makefile
RUN apt update -y && apt install -y make

COPY .env.example package.json package-lock.json Makefile ./

# Copy the default + install dependencies
RUN cp .env.example .env && make install

# We copy the repo
COPY . .

# build the app
RUN make build

CMD ["make", "start"]
