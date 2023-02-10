FROM node:14
RUN mkdir -p /web
RUN mkdir -p /shared
COPY ./shared ./shared
COPY ./web ./web
WORKDIR /web
RUN npm install
EXPOSE 9241
CMD ["npm", "start"]