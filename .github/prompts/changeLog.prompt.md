---
mode: edit
---

翻译并格式化更新日志

- 翻译时不要求逐字翻译，只需尽量使用目标语言的专业术语和常用表达方式，符合目标语言的语法和常见表达习惯
- 内容使用 markdown 语法编写
- 确保更新日志中存在英文及中文的翻译，如果存在中文变更项但不存在对应英文变更项，则翻译将中文翻译到英文，反之亦然
- 确保中、英文日志都类似例子中的描述方式及格式，若原始的更新日志中没有遵循类似例子中的描述方式，需改成类似的描述方式
- 各语言之间使用分隔线分隔
- 确保英文日志始终在文档的开头

参考例子：

```markdown
### Added

- Added a **"Bold lyrics font"** option in _Settings > Play Details Page Settings_. Enabled by default.

### Improved

- Improved the update notification mechanism. Now shows error messages when update checks or downloads fail ([#59](https://github.com/any-listen/any-listen/issues/59)).

### Fixed

- Fixed an issue where ambient sound effects failed to load.

### Changed

- Swapped the positions of **"Translated lyrics"** and **"Romanized lyrics"**. If you prefer the original order, you can enable the **"Swap translated lyrics and romanized lyrics"** option to revert.

---

### 新增

- 新增 **「加粗歌词字体」** 选项，位于 _设置 > 播放详情页设置_，默认开启

### 优化

- 优化版本更新提示机制，增加检查和下载更新失败时的错误信息提示（[#59](https://github.com/any-listen/any-listen/issues/59)）

### 修复

- 修复环境音效加载失败的问题

### 变更

- 调换 **「翻译歌词」** 和 **「罗马音歌词」** 的位置，若你想要恢复默认的行为，可开启 **「调换翻译歌词与罗马音歌词位置」** 选项
```
