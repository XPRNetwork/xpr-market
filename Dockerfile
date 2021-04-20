FROM node:14-alpine

ARG NPM_TOKEN
# COPY .npmrc .npmrc
COPY package.json .
COPY components components
COPY hooks hooks
COPY pages pages
COPY public public
COPY services services
COPY styles styles
COPY types types
COPY utils utils
COPY tsconfig.json .
COPY next.config.js .
COPY next-env.d.ts .
COPY babel.config.json .
COPY .prettierrc.js .
COPY .eslintrc.json .
RUN npm i && npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
