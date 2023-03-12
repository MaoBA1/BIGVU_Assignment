FROM node:9-slim
WORKDIR /application
COPY . /client /application
COPY . /server /application
RUN npm install
COPY . /application
CMD ["npm", "start"]
