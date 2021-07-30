FROM node:14.17.3-alpine
WORKDIR /App
ENV PATH /App/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3000
CMD [ -d 'node_modules' ] && npx prisma introspect && npx prisma generate && npm run devStart || npm ci && npx prisma introspect && npx prisma generate && npm run devStart 