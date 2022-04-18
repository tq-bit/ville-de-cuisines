FROM node:latest

WORKDIR /bin

RUN npm install -g appwrite-cli
RUN userdel -r node

ARG USER_ID
ARG GROUP_ID

RUN addgroup --gid $GROUP_ID user
RUN adduser --disabled-password --gecos '' --uid $USER_ID --gid $GROUP_ID user

# Set the active user and open the interactive terminal
USER user

ENTRYPOINT [ "appwrite", "login" ]