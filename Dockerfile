FROM node:8

ENV APP_HOME /app

# Install requirements for yarn
RUN apt-get update && apt-get install -y --no-install-recommends apt-transport-https=1.4.8
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y --no-install-recommends yarn=1.3
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR $APP_HOME

COPY ["package.json", ".babelrc", ".eslintrc.js", ".eslintignore", "README.md", "yarn.lock", "./"]

RUN yarn install

COPY ["spec", "spec"]
COPY ["src", "src"]

# Run tests
ENV NODE_ENV test
RUN npm test

# Expose port
ENV PORT 3000
EXPOSE 3000
ENV NODE_ENV production

# Run
CMD npm run server
