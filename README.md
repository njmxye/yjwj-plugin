# 🌌 永劫无间插件 —— yjwj-Plugin 🌠

### 🎉 欢迎来到永劫无间插件的世界，这里充满了无限可能与惊喜！

### 🚀 探索永劫无间，让 yjwj-Plugin 成为你的冒险伙伴！

## 🎨 功能特色

## （很遗憾的是，笔者需要上学背八股【高考】，整个插件的大项目会咕咕一段时间【可能是一坤年？】。但是能承诺的是，笔者再回来会更新一个不输修仙游戏的Galgame文游系统，会接入kimi做高度自由的开放世界！）
# 装之前一定要看注意事项和现有BUG标注！！！

1. **美图画廊 —— 随机美图展示** 🖼️
   - 永劫无间官方影画廊图库！

2. **英雄档案馆 —— 人物详情介绍** 📚
   - 世界观资料站与cv信息。

3. **网易大神战绩榜 —— 战绩查询系统与全服排行榜** 🏹
   - 实时更新顶尖玩家的战绩，让你随时学习他们的战斗策略。
   - 同步自己的战绩，魂玉伤害排名系统全追踪！

4. **逆天语录宝典 —— 劫圈语录** 📖
   - 贴吧的逆天语录，乐子人启动！（克烈怎么和营销号吵起来的………）

5. **B站视频精选 —— 视频链接获取** 📺
   - 随机推荐B站上的永劫无间精彩视频。

6. **表情包大集合 —— 表情包** 😎
   - 海量的永劫无间表情包，让你的聊天更加有趣和个性化。

7. **群管智能助手 —— 群管功能** 🤖
   - 智能化管理游戏社群，提升群组的活跃度和秩序。

8. **群友互动系统 —— 聊天互动** 💬
   - 实时更新群友的预约需求，便于统计开黑需求。

9. **每日新闻早报 —— 60秒读懂世界** 📰
  - 每日新闻早报，让你了解世界的最新动态。

10. **ai大模型 —— 接入kimi智能体** 🤖
  - 智能对话，直接享受最新科技成果！

## 🛠️ 技术亮点

- **AI智能推荐**：采用先进的人工智能算法，为你推荐最感兴趣的内容。
- **跨平台支持**：完美适配PC和移动设备，无论何时何地都能享受服务。
- **社区互动增强**：通过插件加强玩家间的交流，打造更加紧密的游戏社区。

## 🌈 快速入门

**安装Python环境**: 不用我教吧。
**选择Yunzai 插件目录 📁**: 
```bash
cd Miao-Yunzai/plugins
```
**克隆本仓库 📦**:
```bash
git clone https://github.com/njmxye/yjwj-plugin.git
```  
**安装依赖项 📦**:
```bash
cd yjwj-plugin
pip install -r requirements.txt
cd sundry
cd intelligence
pip install -r requirements.txt
```
**配置插件 ⚙️**:
编辑 yjwj-plugin/sundry/intelligence/config.json 文件，配置你的插件参数。
格式为{"token": "12345678", "auth_token": "Bearer ", "refresh_token": "Bearer "}
修改后两项为Bearer空格后填你的kimitoken，具体token获取方法见kimi官网或者百度！

**启动插件 🚀**:
输入“永劫帮助”，查看插件的功能。

## 注意⚠️
- 请确保你的 Python 环境已经安装并配置正确。
- **切记！**  时雨星空trss.me的脚本tsab版崽子如果环境用的arch linux，需要自行配置虚拟python环境，并在tsab前actived你的虚拟python环境！
- **切记！**  时雨星空trss.me的脚本tsab版崽子如果环境用的arch linux，需要自行配置虚拟python环境，并在tsab前actived你的虚拟python环境！
- **切记！**  时雨星空trss.me的脚本tsab版崽子如果环境用的arch linux，需要自行配置虚拟python环境，并在tsab前actived你的虚拟python环境！
- 如果pip install速度慢或报错，请自行更换清华大学镜像源！

- **切记！**  有能力者欢迎来改bug！
# 现有BUG！
- **bug1！**  现在先不要用kimi相关功能，因为作者刚写完！有bug,具体愿意是作者写了kimiapi的py文件，挂在后台无法结束，结果是会导致云崽无法继续运行，只能重启！没有时间填坑，所以在bug修复前请不要使用kimi相关功能！
- **bug2！**  每日新闻早报的数据源是每天9点多一点更新，所以在每天的0点至9点获取新闻早报会显示页面已丢失！作者还没写每日时间戳判断9点以前用昨天的数据，所以请算好时间，或者等待有能力的开发者或者作者的修复！
- **bug3（算不上大bug）！**  永劫影画廊的爬虫逻辑没有考虑到js动态加载和缩略图的事情，导致现在获取的图源是缩略图，部分画质很差，一半的海报还是比较清晰。如果介意，请来帮助修复爬虫逻辑或者等待有能力的开发者和作者的修复！

### 👏 贡献者邀请

- 如果你有创意或发现问题，欢迎提交 issue 或 pull request，一起让 yjwj-Plugin 更加完善！
- 如果你有能力开发或者热爱永劫无间相关事宜，欢迎提供开发帮助与修复bug！（作者qq群966160338，入群答案填好就可以。）
- 如果你喜欢 yjwj-Plugin，请给个 star，让我们一起分享和进步！

### 📌 未来展望

- **更多英雄故事** 🦸‍♂️：不断增加新英雄的详细介绍和语音，丰富你的英雄档案馆。
- **社区活动集成** 🎉：加入更多社区活动功能，提升玩家的参与度和归属感。
- **个性化推荐系统** 🤖：根据你的喜好，提供更加精准的个性化内容推荐。

### 🎉 加入我们

- **准备好了吗？** 让我们一起在永劫无间中探索未知，yjwj-Plugin 将是你最佳的伙伴！

---

🌠 **永劫无间，无限可能，yjwj-Plugin 与你同在，照亮你的冒险之路！** 🌠

### 📜 **联系我们**

- **我的博客**：[楠寻的小窝](https://njmxye.github.io/)
- **官方QQ群**：[永劫无间萌新交流群](https://qm.qq.com/cgi-bin/qm/qr?k=n_QYIPhlqu8n2U4i-Sp9YgF8i0TzqFAJ&jump_from=webapi&authKey=c4Lb1WlIGz6H1GKQpjEcrbcXYZR7IQQRmoRl9GallaCVrWySQGSY09gzwHmY/ZLP)
<a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=n_QYIPhlqu8n2U4i-Sp9YgF8i0TzqFAJ&jump_from=webapi&authKey=c4Lb1WlIGz6H1GKQpjEcrbcXYZR7IQQRmoRl9GallaCVrWySQGSY09gzwHmY/ZLP"><img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="永劫无间萌新交流群" title="永劫无间萌新交流群"></a>
- **github仓库**：[永劫无间插件](https://github.com/njmxye/yjwj-plugin)
- **官方论坛**：[永劫无间官方论坛](https://mbox.gm.163.com/games/faq.html?paper_id=4557)
- **客服支持**：[联系客服](https://help.steampowered.com/zh-cn/wizard/HelpWithGame/?appid=1203220&transid=5975764013445813478)
- **社交媒体**：[永劫无间社交媒体](https://www.yjwujian.cn/)

