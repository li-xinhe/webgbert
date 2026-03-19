---
title: Manifesto Model Demo
sdk: docker
app_port: 7860
---

# Manifesto Model Web Demo

这个项目现在已经补上了一个可直接启动的网站版本，访问者可以：

- 输入一段政策文本
- 选择国家和年份
- 由系统自动从 `add/` 目录读取 6 个宏观变量
- 调用训练好的 `causal_nam_best.pt` 模型返回 Top-5 预测类别

## 新增文件

- `app.py`: Flask 网站入口
- `inference_service.py`: 推理服务，负责读取 `preprocess_meta.joblib`、`add/` 和模型
- `templates/index.html`: 页面模板
- `static/style.css`: 页面样式
- `static/app.js`: 前端交互
- `render.yaml`: Render 部署配置
- `Procfile`: Railway / 通用 PaaS 启动命令
- `.env.example`: 环境变量模板

## 启动方式

建议先准备一个可正常运行 `torch` 和 `transformers` 的 Python 环境，再执行：

```bash
pip install -r requirements.txt
python app.py
```

启动后访问：

```text
http://127.0.0.1:8000
```

本地环境变量可以参考 `.env.example`。

## 让其他用户访问

现在最直接的做法是把这个项目部署到一个公开 URL。这个仓库已经补了 `Dockerfile`，适合直接部署到支持 Docker 的平台。

## GitHub Pages 前端 + 独立后端 API

现在项目已经拆成了两层：

1. `docs/` 目录下是纯静态前端，可以直接发布到 GitHub Pages
2. Flask 只负责独立后端 API，主要接口是 `/api/health`、`/api/options`、`/api/predict`

前端不会依赖 Flask 模板，也不会依赖同域部署。访问者第一次打开 GitHub Pages 页面时，只需要填写一次后端地址，浏览器会自动保存。

### GitHub Pages 部署

1. 把代码推到 GitHub 仓库
2. 在仓库设置里打开 Pages
3. 选择从 `main` 分支的 `/docs` 目录发布
4. 等 GitHub 生成公开网址

### 后端 API 部署

后端继续部署到 Render、Railway 或 Hugging Face Spaces 都可以。由于前端是跨域调用，后端已经默认加好了 CORS。

如果你想限制只允许自己的 GitHub Pages 域名访问，可以配置：

```text
CORS_ALLOW_ORIGINS=https://your-name.github.io
```

如果不配置，当前默认允许公开前端调用。

## 上线前必须注意

`causal_nam_best.pt` 现在大约 683MB。GitHub 官方对普通仓库单文件有 100MB 限制，所以它不能作为普通文件直接推送到 GitHub。

现在代码支持两种上线方式：

1. 使用 Git LFS 管理模型文件
2. 更推荐：把网站代码和模型文件分开，代码仓库只放网站，模型放到 Hugging Face 模型仓库，部署时通过环境变量自动下载

如果你选择“模型仓库分离”方案，需要配置：

```text
MODEL_REPO_ID=your-username/your-model-repo
MODEL_FILENAME=causal_nam_best.pt
HF_TOKEN=
TEXT_MODEL_NAME_OR_PATH=bert-base-multilingual-cased
```

如果模型文件就在部署机器本地，只需要：

```text
MODEL_PATH=./causal_nam_best.pt
```

### 方案 1：Hugging Face Spaces（更适合模型演示）

- 官方说明：Hugging Face 支持 Docker Spaces，可以直接运行自定义 `Dockerfile`
- 本项目已经按这种方式准备好了，默认暴露端口 `7860`
- 适合做公开 demo，后续如果 CPU 不够，也可以升级硬件

基本流程：

1. 新建一个 Hugging Face Space
2. 选择 `Docker` 作为 SDK
3. 把当前项目代码推上去
4. 在 Space 里配置环境变量；如果模型不在代码仓库中，就配置 `MODEL_REPO_ID` 和 `MODEL_FILENAME`
5. 等待构建完成后，平台会给你一个公开链接

### 方案 2：Render / Railway（更像常规网站部署）

- 两个平台都支持从 GitHub 仓库直接部署 Python/Flask 应用
- Render 官方要求服务监听 `0.0.0.0` 和平台端口
- Railway 官方的 Flask 指南建议使用 `gunicorn`
- 这些要求我已经在代码里处理好了

如果你走这条路，通常只需要：

1. 把项目推到 GitHub
2. 在平台里选择该仓库
3. 配置环境变量，例如：

```text
MODEL_REPO_ID=your-username/your-model-repo
MODEL_FILENAME=causal_nam_best.pt
TEXT_MODEL_NAME_OR_PATH=bert-base-multilingual-cased
```

4. 使用 Docker 部署，或直接使用：

```text
Build: pip install -r requirements.txt
Start: gunicorn --bind 0.0.0.0:$PORT app:app
```

### 当前更推荐哪个

- 如果你的目标是“让别人在线试这个模型”，我更推荐 Hugging Face Spaces
- 如果你的目标是“做成普通网站，后面还想加账号、数据库、API 管理”，我更推荐 Render 或 Railway

## 推荐上线结构

建议按下面的结构上线：

1. GitHub 仓库：只放网站代码
2. Hugging Face 模型仓库：只放 `causal_nam_best.pt`
3. 部署平台：Hugging Face Spaces 或 Render

这样能避开 GitHub 大文件限制，也更方便后续更新模型。

## 说明

- 页面不会让用户手填宏观变量，推理时会自动从 `add/` 的 World Bank CSV 中按 `国家 + 年份` 读取。
- 少数国家名称和 World Bank 的命名不完全一致，代码里已经做了别名映射，例如：
  - `South Korea -> Korea, Rep.`
  - `Turkey -> Turkiye`
  - `Czech Republic -> Czechia`
- 如果某个国家年份在 `add/` 里该指标缺失，当前实现会按训练阶段的做法补 `0`，然后再按 `preprocess_meta.joblib` 里的均值和标准差做标准化。

## 当前环境提醒

我在这台机器上检查时，当前 Anaconda 环境里的 `torch` 启动就报了底层 OpenMP 错误，因此还不能在这里完成真实推理验证。

网页和服务代码已经接好；只要换到一个可正常运行 `torch` 的环境，或者修复当前 Python 环境后，就可以直接启动并调用模型。

## 参考资料

- [Hugging Face Spaces 概览](https://huggingface.co/docs/hub/en/spaces)
- [Hugging Face Docker Spaces](https://huggingface.co/docs/hub/spaces-sdks-docker)
- [Hugging Face Hub 文件下载](https://huggingface.co/docs/huggingface_hub/v0.30.2/en/guides/download)
- [GitHub 大文件限制](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)
- [Render Web Services 文档](https://render.com/docs/web-services)
- [Render Blueprints / render.yaml](https://render.com/docs/infrastructure-as-code)
- [Railway Flask 部署指南](https://docs.railway.com/guides/flask)
