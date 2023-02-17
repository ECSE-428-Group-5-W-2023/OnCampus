FROM node:14
RUN mkdir -p /backend
COPY ./backend ./backend
WORKDIR /backend
RUN npm install
EXPOSE ${PORT}
CMD ["npm", "start"]