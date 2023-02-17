FROM node:14
RUN mkdir -p /web
COPY ./web ./web
WORKDIR /web
RUN npm install
EXPOSE 9241
CMD ["npm", "start"]