import plugin from '../../../lib/plugins/plugin.js'
import '../../../lib/plugins/loader.js'
import{ execSync } from 'child_process';
import fs from 'fs';
import path from 'path'
import fetch from 'node-fetch'
import os from 'os'
// 检查是否有data/ys-dio-pic文件夹，没有则创建
let queueDict = {};
let imgfol = './data/yjwjimg'
let queue1 = './plugins/yjwj-plugin/sundry/queue1.json'
if (!fs.existsSync(queue1)) {
    fs.closeSync(fs.openSync(queue1, 'w'));
  }
let memeDir = './plugins/yjwj-plugin/sundry/meme'
if (!fs.existsSync(imgfol)) {
  fs.mkdirSync(imgfol)
}
export class setting extends plugin {
    constructor() {
        super({
            name: '[yjwj-plugin] 设置',
            dsc: '[yjwj-plugin] 设置',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: '^#永劫无间全部图源.*$',
                    fnc: 'allurlsource',
                    permission: 'master'
                },
                {
                    reg: '^今日早报.*$',
                    fnc: 'news'
                },
                {
                    reg: '^海报.*$',
                    fnc: 'imgmanual'
                },       
                {
                    reg: '^永劫帮助$',
                    fnc: 'help'
                },
                {
                    reg: '^永劫更新数据.*$',
                    fnc: 'update_config'
                },
                {
                    reg: '^表情包$',
                    fnc: 'meme'
                },
                {
                    reg: '^#预约.*$',
                    fnc:'queue'
                },
                {
                    reg: '^#取消$',
                    fnc: 'queueout'
                },
                {
                    reg: '^#预约列表$',
                    fnc: 'queuelist_total'
                },
                {
                    reg: '^#手游列表$',
                    fnc: 'queuelist_mobile'
                },
                {
                    reg: '^#端游列表$',
                    fnc: 'queuelist_pc'
                },
                {
                    reg: '^#自定义房间列表$',
                    fnc: 'custom_room_list'
                },
                {
                    reg: '^#自定义房间添加$',
                    fnc: 'custom_room_add'
                },
                {
                    reg: '^#自定义房间删除$',
                    fnc: 'custom_room_del'
                },
                {
                    reg: '^#排行榜列表$',
                    fnc: 'chart_list'
                },
                {
                    reg: '^#排行榜添加$',
                    fnc: 'chart_add'
                },
                {
                    reg: '^#排行榜删除$',
                    fnc: 'chart_del'
                },
                {
                    reg: '^逆天.*$',
                    fnc: 'tieba_sb'
                },
                {
                    reg: '^劫批.*$',
                    fnc: 'tieba_jb'
                }
            ]
        })
    }


    async queue(e) {   
        let a = 'http://q2.qlogo.cn/headimg_dl?dst_uin=' + e.user_id + '&spec=5';
        let queueData = {
                user_id: e.user_id
        };
        let existingQueueData = [];
        if (fs.existsSync(queue1)) {
            existingQueueData = JSON.parse(fs.readFileSync(queue1));
        }
        existingQueueData.push(queueData);
        fs.writeFileSync(queue1, JSON.stringify(existingQueueData));

        let msg = ['预约成功！\n他想打劫了，当前预约人数请发送\n#预约列表', segment.image(a),segment.at(e.user_id)];
        e.reply(msg);
        this.queuelist_total(e)
    }




    async queuelist_total(e) {
        try {
            if (fs.existsSync(queue1)) {
                let queueData = await fs.promises.readFile(queue1, 'utf8');
                queueData = JSON.parse(queueData);
                let queueCount = {};
                queueData.forEach((entry) => {
                    if (!queueCount[entry.rank_type]) {
                        queueCount[entry.rank_type] = 1;
                    } else {
                        queueCount[entry.rank_type]++;
                    }
                });
                let reply = "当前排队人数：\n";
                Object.keys(queueCount).forEach((rankType) => {
                    reply += `${rankType}：${queueCount[rankType]}人\n`;
                });
                reply += "详细列表：\n";
                queueData.forEach((entry) => {
                    reply += `${entry.nickname}（${entry.user_idadd}）- ${entry.rank_type}\n`;
                });
                e.reply(reply);
            } else {
                e.reply("排队列表为空");
            }
        } catch (error) {
            console.error(error);
            e.reply("发生错误，请稍后再试");
        }
    }


    async news(e) {


    }



    async queueout(e) {
        e.reply('功能没写完，去催楠寻赶紧写！')
        e.reply('功能没写完，去催楠寻赶紧写！')
    }
    async meme(e) {
        // 随机从表情包中选择一张图片发送
        let metu = fs.readdirSync(memeDir)
        let metuPath = path.join(memeDir, metu[Math.floor(Math.random() * metu.length)])
        e.reply(segment.image(metuPath))
      }

    async imgmanual(e) {
    if (fs.existsSync('urlconfig.json')) {  
        try {
        const fileContent = fs.readFileSync('urlconfig.json', 'utf8');  
        console.log('数据获取成功');
        const urls = fileContent.split('\n');
        let strurl;

        // 创建一个存储所有 URL 的新数组
        const allUrls = [];

        // 用一个循环遍历 URL 列表
        urls.forEach((url, index) => {
            strurl=`URL ${index + 1}: ${url.trim()}`.toString()
            allUrls.push(url); 
        });

        // 使用 Math.random() 返回一个随机 URL
        const randomIndex = Math.floor(Math.random() * allUrls.length);
        const randomUrl = allUrls[randomIndex];
        const downloadPath = './data/yjwjimg/random-image.jpg';
        try {
            const response = await fetch(randomUrl);
            if (!response.ok) {
              throw new Error(`下载失败，状态码: ${response.status}`);
            }
            const buffer = await response.arrayBuffer();
            fs.writeFileSync(downloadPath, Buffer.from(buffer));
            console.log(`图片成功下载到: ${downloadPath}`);
          } catch (error) {
            console.error('下载出错:', error);
            throw error;
          }
        e.reply(segment.image(downloadPath))
        allUrls = [];

        } catch (err) {
        }
    } else {
        await e.reply('数据获取失败，请使用[#劫更新数据]更新配置文件'); 
    }
    }

    async allurlsource(e) {
        if (fs.existsSync('urlconfig.json')) {  
        try {
            const fileContent = fs.readFileSync('urlconfig.json', 'utf8');  
            await e.reply('数据获取成功');
            const urls = fileContent.split('\n');
            let strurl;
            // 遍历URL列表并打印每个URL
            urls.forEach((url, index) => {
                strurl=`URL ${index + 1}: ${url.trim()}`.toString()
                e.reply(strurl); // 使用trim()移除可能的空白字符
            });
        } catch (err) {
            console.error("Error parsing JSON:", err); 
            await e.reply('数据读取失败，请检查配置文件');
        }
        } else {
            await e.reply('数据获取失败，请使用[#劫更新数据]更新配置文件'); 
        }
    }

    
    async help(e) {
        await e.reply([
            '帮助：\n',
            '1. 输入#永劫无间全部图源\n可以获取全部图源\n',
            '2. 输入海报\n可以获取随机海报大图\n',
            '3. 输入表情包\n可以获取随机表情包\n',
            '4. 输入永劫更新数据\n可以更新图源\n',
            '5. 输入永劫帮助\n可以查看帮助信息\n',
            '6. 输入#预约\n可以预约和群友打劫！\n',
            '7. 输入#预约列表\n可以查看排队列表\n',
            '8. 输入#取消\n可以取消排队\n',
            '9. 输入#yj更新\n可以更新永劫插件\n',
            '我身无拘  武道无穷\n'
        ])
        return true
    }
    async update_config(e) {
        await e.reply('正在更新配置文件……')
        try {
            // 使用 execSync 确保命令执行完再继续后面的步骤。
            let output1 = execSync('python./plugins/yjwj-plugin/apps/imgv1.2.py');
            let output2 = execSync('ls');
            e.reply("图源更新成功");
        } catch (err) {
            console.error("图源更新出错：", err);
            e.reply("图源更新出错");
            // 如果需要，你可以选择在这里输出错误信息
            e.reply(err.toString());
        }
    }
    
}

