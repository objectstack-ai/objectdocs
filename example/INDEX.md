# Example Folder - Complete Guide

欢迎查看 ObjectDocs 示例项目！这是一个完整的、独立的文档项目，展示了如何使用 ObjectDocs CLI 创建和部署文档站点。

Welcome to the ObjectDocs example project! This is a complete, standalone documentation project that demonstrates how to create and deploy documentation sites using the ObjectDocs CLI.

## 🎯 Purpose / 目的

这个示例项目的主要目的：

This example project serves these key purposes:

1. **Vercel 部署测试** / **Vercel Deployment Testing**
   - 验证使用 CLI 创建的项目可以成功部署到 Vercel
   - Validate that CLI-created projects can successfully deploy to Vercel
   - 测试 `@objectdocs/site` 包引用方式是否正确
   - Test that the `@objectdocs/site` package reference approach works correctly

2. **独立项目示例** / **Standalone Project Example**
   - 展示真实用户如何创建文档项目
   - Show how real users would create documentation projects
   - 使用发布到 npm 的包，而不是 workspace 引用
   - Use published npm packages instead of workspace references

3. **文档和测试参考** / **Documentation and Testing Reference**
   - 提供完整的设置说明和最佳实践
   - Provide complete setup instructions and best practices
   - 包含验证脚本确保配置正确
   - Include validation scripts to ensure correct configuration

## 📚 Documentation Files / 文档文件

The example includes comprehensive documentation:

### README.md
主要文档，包括：
- Project overview and purpose
- Quick start guide
- Deployment instructions
- Troubleshooting guide

### ARCHITECTURE.md
架构文档，解释：
- How `@objectdocs/site` is referenced by the CLI
- Why the current approach works
- Alternative approaches considered
- Vercel deployment considerations
- Technical details for maintainers

### VERCEL.md
Vercel 部署指南，包括：
- Step-by-step deployment instructions
- Configuration options
- Troubleshooting common issues
- Production optimization tips

### TESTING.md
测试指南，说明如何：
- Test outside the monorepo context
- Validate standalone installations
- Use automated testing scripts
- Ensure correct behavior before deployment

## 🏗️ Project Structure / 项目结构

```
example/
├── README.md              # Main documentation
├── ARCHITECTURE.md        # Technical architecture details
├── VERCEL.md             # Vercel deployment guide
├── TESTING.md            # Testing guide
├── validate.sh           # Validation script
├── package.json          # Uses @objectdocs/cli from npm
├── vercel.json           # Vercel configuration
├── .gitignore           # Git ignore rules
├── content/
│   ├── docs.site.json    # Global site configuration
│   └── docs/
│       ├── meta.json     # Sidebar navigation
│       ├── index.mdx     # Home page
│       ├── getting-started.mdx
│       └── configuration.mdx
└── public/
    └── README.md         # Static assets instructions
```

## 🚀 Quick Start / 快速开始

### 1. 安装依赖 / Install Dependencies

```bash
cd example
pnpm install
```

### 2. 验证配置 / Validate Setup

```bash
bash validate.sh
```

### 3. 启动开发服务器 / Start Development Server

```bash
pnpm dev
```

访问 http://localhost:7777

### 4. 构建生产版本 / Build for Production

```bash
pnpm build
```

### 5. 部署到 Vercel / Deploy to Vercel

查看 VERCEL.md 获取详细说明 / See VERCEL.md for detailed instructions

## ✅ Validation Checklist / 验证清单

使用这个清单确保项目设置正确：

Use this checklist to ensure the project is set up correctly:

- [ ] `pnpm install` 成功完成 / completes without errors
- [ ] `bash validate.sh` 所有检查通过 / all checks pass
- [ ] `pnpm dev` 启动开发服务器 / starts development server
- [ ] 所有页面在浏览器中正常加载 / all pages load correctly in browser
- [ ] 导航功能正常（侧边栏、头部链接）/ navigation works (sidebar, header links)
- [ ] `pnpm build` 构建成功 / build completes successfully
- [ ] `pnpm start` 启动生产服务器 / starts production server
- [ ] 部署到 Vercel 成功 / deployment to Vercel succeeds
- [ ] 部署后的网站完全正常 / deployed site is fully functional

## 🔑 Key Differences from `examples/starter` / 与 `examples/starter` 的主要区别

| Aspect | examples/starter | example |
|--------|-----------------|---------|
| Purpose | Quick start template | Full deployment testing |
| Dependencies | `workspace:*` | Published npm packages |
| Documentation | Basic README | Comprehensive guides |
| Validation | None | Automated script |
| Context | Part of monorepo | Standalone project |
| Target | Quick prototyping | Production deployment |

## 🐛 Troubleshooting / 故障排除

### 问题：在 monorepo 中测试
### Issue: Testing in Monorepo

由于这个示例在 monorepo 中，pnpm 可能会解析到 workspace 包。要正确测试：

Since this example is in a monorepo, pnpm might resolve to workspace packages. To test correctly:

```bash
# 复制到 monorepo 外部
# Copy outside monorepo
cp -r example /tmp/objectdocs-test
cd /tmp/objectdocs-test
pnpm install
```

参考 TESTING.md 获取更多测试方法。
See TESTING.md for more testing methods.

### 问题：Vercel 部署失败
### Issue: Vercel Deployment Fails

1. 检查 `@objectdocs/cli` 是否使用正确的版本号
   Check that `@objectdocs/cli` uses correct version number
2. 确认所有内容文件已提交到 Git
   Confirm all content files are committed to Git
3. 查看 VERCEL.md 中的故障排除部分
   See troubleshooting section in VERCEL.md

## 🤝 Contributing / 贡献

如果发现问题或有改进建议：

If you find issues or have improvements:

1. 在此示例中测试更改
   Test changes in this example first
2. 确保部署仍然正常
   Ensure deployment still works
3. 提交清晰的 PR 说明
   Submit PR with clear description

## 📄 License / 许可证

MIT - Same as the main ObjectDocs project

---

## For Maintainers / 维护者须知

### Publishing Checklist

在发布新版本前，使用此示例验证：

Before publishing new versions, use this example to validate:

1. ✅ Update version in packages/cli/package.json and packages/site/package.json
2. ✅ Build packages: `pnpm build`
3. ✅ Test in example: `cd example && pnpm install && bash validate.sh`
4. ✅ Test build: `pnpm build` in example
5. ✅ Publish packages: `pnpm changeset publish`
6. ✅ Test with published versions (see TESTING.md)
7. ✅ Deploy to Vercel to verify production deployment

### Updating the Example

When updating example content:

1. Keep it simple and focused
2. Ensure all pages have proper frontmatter
3. Update meta.json if adding/removing pages
4. Run validation script
5. Test both dev and build

### Common Maintenance Tasks

- **Update dependencies**: `pnpm up -r @objectdocs/cli`
- **Add new page**: Create MDX + update meta.json
- **Change config**: Edit docs.site.json
- **Test deployment**: Follow VERCEL.md instructions
