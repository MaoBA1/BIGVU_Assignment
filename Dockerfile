FROM node:9-slim
WORKDIR /application
COPY . /client /application
COPY . /server /application
RUN npm install
COPY . /application
CMD ["npm", "start"]


# docker build -t [ any-name-to-image ] 
# docker run -it -p [ any-free-port ]:5000 [ image-name ]