# ---- 开发阶段 ----
FROM node:26.7.0-alpine3.24 AS development

WORKDIR /app

# ✅ 使用 apt-get 安装 git
RUN apk add --no-cache git

# 复制依赖文件并安装
COPY package*.json .
RUN npm install

# 挂载不需要复制所有源代码
# COPY . .

# 暴露Vitepress默认的开发端口
EXPOSE 5173

# 启动开发服务器
CMD ["npm", "run", "docs:dev"]

# ---- 构建阶段 ----
FROM node:26.7.0-alpine3.24 AS builder

WORKDIR /app

# 安装git（Vitepress需要）
RUN apk add --no-cache git

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run docs:build

# ---- 生产阶段（Nginx） ----

FROM nginx:alpine AS production

# 创建普通用户（与之前一致，但注意 nginx:alpine 本身已有 nginx 用户，此处为了演示自定义）
RUN addgroup --gid 1001 appgroup && \
    adduser -D -u 1001 --ingroup appgroup -s /bin/sh -h /home/app appuser

# 创建 Nginx 需要写入的目录（缓存、日志、运行）
RUN mkdir -p /var/cache/nginx /var/log/nginx /run/nginx && \
    chown -R appuser:appgroup /var/cache/nginx /var/log/nginx /run/nginx

# 修改 nginx.conf，将 pid 路径指向 /run/nginx/nginx.pid
RUN sed -i 's|^pid .*;|pid /run/nginx/nginx.pid;|' /etc/nginx/nginx.conf

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

USER appuser

EXPOSE 80

# 健康检查通常写在这里
HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --start-period=5s \
  --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
