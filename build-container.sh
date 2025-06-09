#!/usr/bin/env bash

# Image tag (version) defaults to `latest` if not provided
if [ -z "$1" ]; then
  TAG="latest"
else
  TAG="$1"
fi


# Repository name
REPO=$(basename "$(pwd)")

# Repository label
LABEL="org.opencontainers.image.source=https://github.com/wajih-awad/${REPO}"


# Repository name in lowercase
REPO_LC=${REPO,,}

# Image name
IMAGE="ghcr.io/wajih-awad/${REPO_LC}:${TAG}"

# build image
docker build -f Containerfile --label "${LABEL}" -t "${IMAGE}" .

# print out image name
echo "${IMAGE}"