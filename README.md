# Typing Trainer

Typing Trainer 是一个面向初学者的网页打字训练项目。

## 目标
- 从零开始学习键盘
- 先提高准确率，再提高速度
- 通过游戏化提升坚持率
- 支持自定义练习内容
- 记录成长数据

## 运行
```bash
npm install
npm run dev
```

开发模式现在默认会：

- 固定使用 `3000` 端口
- 启动前自动归档旧的 `.next` 缓存，减少热更新缓存损坏导致的白页

如果你看到本地开发环境白屏、`500` 或 `Cannot find module './xxx.js'` 这类错误，可以执行：

```bash
npm run dev:reset
npm run dev
```

如果你只是想要不清缓存的快速启动，可以执行：

```bash
npm run dev:fast
```

## 云端同步（Supabase）

项目现在支持把以下内容同步到 Supabase：

- 训练记录
- 个人资料
- 好友关系
- 云端排行榜
- 好友对战

### 1. 配置环境变量

复制 `.env.example` 为 `.env.local`，然后填入：

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_URL=你的 Supabase Project URL
SUPABASE_SERVICE_ROLE_KEY=你的 Supabase Service Role Key
```

### 2. 初始化数据库

把 `supabase/schema.sql` 里的 SQL 粘到 Supabase SQL Editor 执行。

### 3. 行为说明

- 没配 Supabase 时，项目仍然按本地模式运行
- 配好后，好友页会同步邀请关系
- 训练完成后会自动把记录推到云端
- 挑战页会优先读取云端排行榜

## 部署设置

部署到 Vercel 时，至少要确认以下环境变量：

```bash
NEXT_PUBLIC_APP_URL=https://你的线上域名
SUPABASE_URL=你的 Supabase Project URL
SUPABASE_SERVICE_ROLE_KEY=你的 Supabase Service Role Key
```

说明：

- `NEXT_PUBLIC_APP_URL` 必须指向真实线上地址，否则分享页和站点元数据可能回退到 `http://localhost:3000`
- 如果暂时不用云端同步，可以先只配置 `NEXT_PUBLIC_APP_URL`

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS

## 核心页面

- 首页
- 课程页
- 训练页
- 自定义练习页
- 成长统计页
