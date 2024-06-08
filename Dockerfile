FROM node

WORKDIR /server

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "db"]