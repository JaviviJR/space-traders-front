# ARG global: antes del primer FROM, solo se puede usar en las líneas FROM
ARG UV_VERSION=0.13.7

# Etapa de la que solo se copian los binarios de uv (no llega a la imagen final)
FROM ghcr.io/astral-sh/uv:${UV_VERSION} AS uv

FROM ubuntu:26.04

ARG NODE_MAJOR=24
ARG PLAYWRIGHT_VERSION=1.63.0

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends ca-certificates git curl nano sudo \
    && rm -rf /var/lib/apt/lists/*

# Node.js desde el repositorio apt de NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash - \
    && apt-get install -y --no-install-recommends nodejs

RUN npm install -g npm

RUN echo 'ubuntu ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/ubuntu && \
    chmod 0440 /etc/sudoers.d/ubuntu

# Dependencias del sistema para los navegadores de Playwright.
RUN npx -y playwright@${PLAYWRIGHT_VERSION} install-deps \
    && rm -rf /var/lib/apt/lists/* /root/.npm

# Navegadores de Playwright en la home de ubuntu, que es donde los busca al ejecutar los tests
USER ubuntu
RUN npx -y playwright@${PLAYWRIGHT_VERSION} install \
    && rm -rf /home/ubuntu/.npm
USER root

# Para Claude
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends python3 python3-reportlab poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# uv/uvx para ejecutar el CLI de spec-kit (uvx … specify) con la versión fijada
COPY --from=uv /uv /uvx /bin/

#EXPOSE 5173
