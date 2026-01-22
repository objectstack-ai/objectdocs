# ObjectDocs 测试指南

本文档介绍如何在不同场景和环境中测试 ObjectDocs。

## 测试脚本概述

ObjectDocs 提供了多个测试脚本来验证文档站点创建的完整生命周期，从初始化到生产部署。

### 可用的测试脚本

#### 1. `test-site.sh` - 完整生命周期测试

**用途**：全面的端到端测试，涵盖整个 ObjectDocs 工作流程。

**测试内容**：
- ✅ 项目初始化 (`pnpm init`)
- ✅ CLI 安装 (`@objectdocs/cli`)
- ✅ ObjectDocs 初始化 (`objectdocs init`)
- ✅ 内容创建（MDX 文件、配置）
- ✅ 开发服务器启动和可访问性
- ✅ 生产构建编译
- ✅ 生产服务器启动和可访问性

**使用方法**：
```bash
./test-site.sh
```

**运行时间**：约 2-5 分钟（包括服务器启动测试）

**系统要求**：
- Node.js
- pnpm
- curl（用于 HTTP 测试）
- 可用端口 7777
- `timeout` 命令（Linux）或 `gtimeout`（macOS 通过 homebrew 安装：`brew install coreutils`）
  - 注意：如果命令不可用，测试将在没有超时保护的情况下运行

**输出**：详细的分步进度，带有彩色成功/失败指示器。

#### 2. `test-quick.sh` - 快速构建测试

**用途**：适合 CI/CD 的快速测试，验证构建过程而无需运行服务器。

**测试内容**：
- ✅ 项目初始化
- ✅ CLI 安装
- ✅ ObjectDocs 初始化
- ✅ 内容创建
- ✅ 构建编译
- ✅ 构建输出验证

**使用方法**：
```bash
./test-quick.sh
```

**运行时间**：约 1-2 分钟

**系统要求**：
- Node.js
- pnpm

**输出**：专注于构建成功的最小化输出。

#### 3. `examples/starter/validate.sh` - 启动模板验证

**用途**：验证示例启动模板的结构和配置。

**测试内容**：
- ✅ package.json 配置
- ✅ 内容目录结构
- ✅ 配置文件（docs.site.json、meta.json）
- ✅ MDX frontmatter 有效性
- ✅ 依赖项安装
- ✅ Vercel 配置
- ✅ .gitignore 设置

**使用方法**：
```bash
cd examples/starter
./validate.sh
```

**运行时间**：< 10 秒

**系统要求**：无（仅静态文件验证）

## 测试场景

### 1. 本地开发测试

在开发 ObjectDocs 本身时：

```bash
# 在 monorepo 根目录
pnpm install
pnpm build

# 运行全面测试
./test-site.sh
```

### 2. CI/CD 测试

用于 CI/CD 流水线中的自动化测试：

```bash
# 快速测试（推荐用于 CI）
./test-quick.sh

# 或者如果时间允许，运行完整测试
./test-site.sh
```

添加到 CI 配置：
```yaml
# .github/workflows/test.yml
- name: 运行 ObjectDocs 测试
  run: |
    chmod +x ./test-quick.sh
    ./test-quick.sh
```

### 3. 测试独立安装

以最终用户的方式测试（在 monorepo 外）：

```bash
# 创建临时目录
mkdir /tmp/objectdocs-standalone-test
cd /tmp/objectdocs-standalone-test

# 初始化项目
pnpm init -y

# 从 npm 安装 CLI（或本地 tarball）
pnpm add -D @objectdocs/cli

# 配置脚本
cat > package.json << 'EOF'
{
  "name": "test-site",
  "scripts": {
    "dev": "objectdocs dev",
    "build": "objectdocs build",
    "start": "objectdocs start"
  },
  "devDependencies": {
    "@objectdocs/cli": "latest"
  }
}
EOF

# 初始化 ObjectDocs
pnpm objectdocs init

# 创建内容
mkdir -p content/docs
# ... 添加内容文件

# 测试
pnpm build
pnpm start
```

### 4. 使用 npm pack 测试

用于预发布测试：

```bash
# 在 monorepo 中
cd packages/cli
pnpm pack
# 创建 objectdocs-cli-X.X.X.tgz

# 在测试目录中
mkdir /tmp/test-tarball
cd /tmp/test-tarball
pnpm init -y
pnpm add -D ../../packages/cli/objectdocs-cli-X.X.X.tgz

# 继续正常设置
```

## 手动测试清单

准备发布时，手动验证：

### 开发工作流
- [ ] `pnpm objectdocs init` 创建 `.objectdocs` 目录
- [ ] `pnpm dev` 在端口 7777 启动开发服务器
- [ ] 编辑 MDX 文件时热重载工作
- [ ] 编辑 `meta.json` 时热重载工作
- [ ] 编辑 `docs.site.json` 时热重载工作

### 构建过程
- [ ] `pnpm build` 无错误完成
- [ ] 构建输出在 `content/.objectdocs/.next` 中创建
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 错误（如果配置）

### 生产服务器
- [ ] `pnpm start` 运行生产构建
- [ ] 所有页面可访问
- [ ] 导航正确工作
- [ ] 搜索功能工作（如果启用）
- [ ] 深色模式切换工作

### 内容特性
- [ ] MDX frontmatter 正确解析
- [ ] 代码块使用语法高亮渲染
- [ ] 标注和自定义组件渲染
- [ ] 内部链接工作
- [ ] 外部链接工作
- [ ] 图片正确加载

### 配置
- [ ] 品牌（名称、logo）正确显示
- [ ] 导航链接出现在标题中
- [ ] 侧边栏结构匹配 `meta.json`
- [ ] SEO meta 标签生成

## 故障排除

### 常见测试失败

#### "端口 7777 已被占用"

**解决方案**：
```bash
# 终止使用端口 7777 的进程
lsof -ti:7777 | xargs kill -9

# 或使用不同端口
PORT=8888 ./test-site.sh
```

#### "构建超时"

**原因**：构建时间超过 5 分钟。

**解决方案**：增加测试脚本中的 `BUILD_TIMEOUT` 或检查构建错误：
```bash
cd /tmp/objectdocs-test-*
pnpm build
```

#### "找不到模块 '@objectdocs/site'"

**原因**：CLI 找不到 site 包。

**解决方案**：确保先构建了 monorepo：
```bash
cd /home/runner/work/objectdocs/objectdocs
pnpm install
pnpm build
```

#### "开发服务器启动失败"

**原因**：端口冲突或构建错误。

**解决方案**：检查服务器日志：
```bash
cat /tmp/dev-server.log
```

### 调试模式

使用详细输出运行测试：

```bash
# 启用 bash 调试模式
bash -x ./test-site.sh

# 或临时在脚本中添加 set -x
```

## 测试覆盖范围

### 已测试的内容
- ✅ CLI 安装和初始化
- ✅ 内容创建工作流
- ✅ 开发服务器功能
- ✅ 生产构建过程
- ✅ 生产服务器功能
- ✅ 配置文件验证
- ✅ MDX 文件解析

### 尚未测试的内容
- ⚠️ 翻译功能（`objectdocs translate`）
- ⚠️ 交互式 UI 组件
- ⚠️ 搜索功能
- ⚠️ 基于浏览器的 E2E 测试
- ⚠️ 多语言支持
- ⚠️ 主题自定义

## 便捷命令

使用 Makefile 运行常见任务：

```bash
# 显示所有可用命令
make help

# 运行快速测试
make test-quick

# 运行完整测试
make test-full

# 运行所有测试
make test
```

或使用 pnpm：

```bash
# 运行快速测试
pnpm test:quick

# 运行完整测试
pnpm test:site
```

## 贡献测试改进

向 ObjectDocs 添加新功能时，请：

1. **更新测试脚本**（如果功能影响核心工作流）
2. **添加手动测试步骤**到本文档
3. **记录应验证的新配置**
4. **添加边界案例**到测试套件

### 添加新测试脚本

1. 在根目录创建脚本
2. 使其可执行：`chmod +x test-name.sh`
3. 在本文件中记录
4. 如果合适，添加到 CI 配置

### 测试脚本标准

所有测试脚本应该：
- 使用 `set -e` 在错误时退出
- 包含彩色输出
- 退出时清理临时文件
- 提供清晰的成功/失败消息
- 包含摘要部分
- 是幂等的（可以安全地多次运行）

## 参考

- [examples/starter/TESTING.md](./examples/starter/TESTING.md) - 独立测试指南
- [examples/starter/validate.sh](./examples/starter/validate.sh) - 模板验证脚本
- [README.md](./README.md) - 主项目文档
- [TESTING.md](./TESTING.md) - 英文测试文档
