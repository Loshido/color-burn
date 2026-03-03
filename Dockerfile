FROM oven/bun:alpine AS build
WORKDIR /app

COPY . .

RUN bun i && bun run build

FROM p3terx/darkhttpd
WORKDIR /www

COPY --from=build /app/dist/ /www/

EXPOSE 80
CMD [ "/www", "--header", "Cache-Control: public, max-age=604800" ]

LABEL org.opencontainers.image.source=https://github.com/loshido/color-burn
LABEL org.opencontainers.image.authors="loshido@pm.me"