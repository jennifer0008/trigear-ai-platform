# 版本管理规范

## 语义化版本控制 (Semantic Versioning)

本项目遵循 [语义化版本控制 2.0.0](https://semver.org/lang/zh-CN/) 规范：

### 版本格式：MAJOR.MINOR.PATCH

- **MAJOR（主版本号）**：不兼容的 API 修改
- **MINOR（次版本号）**：向下兼容的功能性新增
- **PATCH（修订号）**：向下兼容的问题修正

### 版本示例

- `1.0.0` - 初始发布版本
- `1.0.1` - Bug修复
- `1.1.0` - 新功能添加
- `2.0.0` - 重大变更，不向下兼容

## 分支管理策略

### 分支类型

1. **main** - 主分支，稳定的生产代码
2. **develop** - 开发分支，集成最新开发功能
3. **feature/xxx** - 功能分支，开发新功能
4. **hotfix/xxx** - 热修复分支，紧急修复生产问题
5. **release/x.x.x** - 发布分支，准备发布的版本

### 工作流程

1. 从 `develop` 创建 `feature/功能名` 分支
2. 功能开发完成后，合并回 `develop`
3. 准备发布时，从 `develop` 创建 `release/x.x.x` 分支
4. 测试通过后，合并 `release` 到 `main` 并打标签
5. 紧急修复时，从 `main` 创建 `hotfix/问题描述` 分支

## 提交信息规范

### 格式：`type(scope): description`

### 类型（type）
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动

### 示例
- `feat(chat): add AI assistant integration`
- `fix(ui): resolve mobile responsive issues`
- `docs: update API documentation`

## 发布流程

1. **准备发布**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/x.x.x
   ```

2. **更新版本信息**
   - 更新 `package.json` 中的版本号
   - 更新 `CHANGELOG.md`

3. **测试验证**
   ```bash
   npm run build
   npm run test
   ```

4. **合并到主分支**
   ```bash
   git checkout main
   git merge release/x.x.x
   git tag -a vx.x.x -m "Release version x.x.x"
   git push origin main --tags
   ```

5. **同步到开发分支**
   ```bash
   git checkout develop  
   git merge main
   git push origin develop
   ```

## 标签命名规范

- 正式版本：`v1.0.0`, `v1.1.0`, `v2.0.0`
- 预发布版本：`v1.0.0-alpha.1`, `v1.0.0-beta.1`, `v1.0.0-rc.1`

## 当前版本

**最新稳定版本**: v1.0.0
**当前开发版本**: develop