# AGENTS

## 项目目的
这是一个面向新手的打字训练网页项目。

## 修改规则
1. 保持 lib/types.ts 作为类型中心。
2. 关卡数据统一放在 data/lessons.ts。
3. 所有打字计算写入 lib/typing.ts。
4. 所有本地存储逻辑写入 lib/storage.ts。
5. UI 尽量拆到 components 中，不把过多逻辑堆在 page.tsx。
6. 新增功能优先模块化，例如：
   - KeyboardVisual
   - TrainerPanel
   - StatsOverview
7. 不随意修改页面路由结构。
8. 保持中文界面文案一致。

## 推荐新增任务
- 增加错误键位热力图
- 增加排行榜
- 增加每日签到
- 增加打字打怪模式
- 增加账户系统
