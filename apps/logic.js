import plugin from '../../../lib/plugins/plugin.js'
import '../../../lib/plugins/loader.js'
import{ execSync } from 'child_process';
import fs from 'fs';
import _ from 'lodash'
import path from 'path'
import fetch from 'node-fetch'
import common from'../../../lib/common/common.js'
import ffmpeg from 'fluent-ffmpeg';
import os from 'os'
// 检查是否有data/ys-dio-pic文件夹，没有则创建
let queueDict = {};
let prom = 'kimi'
let vj='战绩'
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
                    reg: '^今日早报$',
                    fnc: 'news'
                },
                {
                    reg: '^#早报更新$',
                    fnc: 'newsupdate'
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
                    reg: '^#预约$',
                    fnc:'queue'
                },
                {
                    reg: '^(胡桃|季季莹|迦南|顾清寒|沈妙|水娘|妖刀|紫萍|狐狸).*$',
                    fnc: 'audio'
                },
                {
                    reg: '^#取消$',
                    fnc: 'queueout'
                },
                {
                    reg: '^#预约清空$',
                    fnc: 'queuelist_refresh',
                    permission:'master'
                },
                {
                    reg: '^#预约列表$',
                    fnc: 'queuelist_total'
                }
            ]
        })
    }
    async audio(e) {
        let reg = new RegExp('^(胡桃|季季莹|迦南|顾清寒|沈妙|水娘|妖刀|紫萍|狐狸|大厅).*$')
        let regRet = reg.exec(e.msg)
        if (!regRet) return false;
        let hero = null
        function randomaud() {
            const path = process.cwd() + '/plugins/yjwj-plugin/sundry/audio/' + hero;
            const files = fs.readdirSync(path);
            const audFiles = files.filter(file => file.endsWith('.mp3'));
            const randomIndex = Math.floor(Math.random() * audFiles.length);
            const audPath = `${path}/${audFiles[randomIndex]}`;
            const zaudPath = './plugins/yjwj-plugin/sundry/audio/zero.mp3';
            e.reply(segment.record(audPath));
        }

        switch (regRet[1]) {
            case '胡桃':
                hero = 'kurumi'
                randomaud()
                randomaud()
                randomaud()
                randomaud()
                randomaud()
                break
            case '季季莹':
                hero = 'zaiji'
                randomaud()
                randomaud()
                randomaud()
                break
            case '迦南':
                hero = 'matari'
                randomaud()
                randomaud()
                randomaud()
                break
            case '顾清寒':
                hero = 'justinagu'
                randomaud()
                randomaud()
                randomaud()
                break
            case '沈妙':
                hero = 'feriashen'
                randomaud()
                randomaud()
                randomaud()
                break
            case '水娘':
                hero = 'valdacui'
                randomaud()
                randomaud()
                randomaud()
                break
            case '妖刀':
                hero = 'yotohime'
                randomaud()
                randomaud()
                randomaud()
                break
            case '紫萍':
                hero = 'zipingyin'
                randomaud()
                randomaud()
                randomaud()
                break
            case '狐狸':
                hero = 'tessa'
                randomaud()
                randomaud()
                randomaud()
                break
            case '大厅':
                hero = 'hall'
                randomaud()
                break
        }
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

        let userExists = existingQueueData.some(entry => entry.user_id === queueData.user_id);
        if (!userExists) {
            existingQueueData.push(queueData);
            fs.writeFileSync(queue1, JSON.stringify(existingQueueData));
        } else {
            e.reply('该用户已在队列中，请勿重复预约！');
        }

        let msg = ['预约成功！\n他想打劫了，当前预约人数请发送\n#预约列表', segment.image(a),segment.at(e.user_id)];
        e.reply(msg);
        this.queuelist_total(e)
        
    }  
    

    async queuelist_total(e) {
    try {
        // 读取固定的 JSON 文件
        let queueData = await fs.promises.readFile(queue1, 'utf8');
        queueData = JSON.parse(queueData);

        let queueCount = {};
        queueData.forEach((entry) => {
        if (!queueCount[entry.user_id]) {
            queueCount[entry.user_id] = 1;
        } else {
            queueCount[entry.user_id]++;
        }
        });

        let reply = "当前排队人数：\n";
        let totalCount = 0;
        Object.keys(queueCount).forEach((user_id) => {
        totalCount += queueCount[user_id];
        });
        reply += `总人数：${totalCount}人\n`;

        reply += "详细列表：\n";
        queueData.forEach((entry) => {
        reply += `${entry.user_id}\n`;
        });

        e.reply(reply);
    } catch (error) {
        console.error(error);
        e.reply("发生错误，请稍后再试");
    }
    }

    async queuelist_refresh(e) {
        fs.writeFileSync(queue1, JSON.stringify([]));
        e.reply('预约列表已清空！')
    }

    async queueout(e) {   
            let queueData = await fs.promises.readFile(queue1, 'utf8');
            queueData = JSON.parse(queueData);
            const user_id = e.user_id;
            if (!queueData.find(item => item.user_id === user_id)) return e.reply('该用户没有在队列中，取消失败');
            queueData = queueData.filter(item => item.user_id!== user_id);
            fs.writeFileSync(queue1, JSON.stringify(queueData));
            e.reply('取消成功！');
            this.queuelist_total(e)
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
        await e.reply('数据获取失败，请使用[永劫更新数据]更新配置文件'); 
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
            await e.reply('数据获取失败，请使用[永劫更新数据]更新配置文件'); 
        }
    }

    
    async help(e) {
        await e.reply([
            '帮助：\n',
            '1. 输入#永劫无间全部图源\n获取全部图源\n',
            '2. 输入海报\n获取随机海报大图\n',
            '3. 输入表情包\n获取随机表情包\n',
            '4. 输入永劫更新数据\n更新图源\n',
            '5. 输入永劫帮助\n查看帮助信息\n',
            '6. 输入#预约\n预约和群友打劫！\n',
            '7. 输入#预约列表\n查看预约列表\n',
            '8. 输入#取消\n取消排队\n',
            '9. 输入#yj更新\n更新永劫插件\n',
            '10. 输入#预约清空\n清空预约列表\n',
            '11. 输入今日早报\n获取每天60秒新闻\n',
            '12. 输入#早报更新\n更新新闻文件\n',
            '13. 输入(胡桃|季季莹|迦南|顾清寒|沈妙|水娘|妖刀|紫萍|狐狸)\n获取角色语音\n',
            '14. 戳一戳机器人\n成功被机器人复仇！\n',
            '我身无拘  武道无穷！\n',
            '咱们群里上过修罗的，记得和群主要修罗头衔！'
            
        ])
        return true
    }
    async update_config(e) {
        await e.reply('正在更新配置文件……')
        try {
            // 使用 execSync 确保命令执行完再继续后面的步骤。
            execSync('python ./plugins/yjwj-plugin/apps/imgv1.2.py');
            e.reply("图源更新成功");
        } catch (err) {
            console.error("图源更新出错：", err);
            e.reply("图源更新出错");
            // 如果需要，你可以选择在这里输出错误信息
            e.reply(err.toString());
        }
    }
    async newsupdate(e) {
        await e.reply('正在更新新闻文件……')
        try {
            // 使用 execSync 确保命令执行完再继续后面的步骤。
            execSync('python ./plugins/yjwj-plugin/apps/news.py');
            e.reply("新闻更新成功");
        } catch (err) {
            console.error("新闻更新出错：", err);
            e.reply("新闻更新出错");
            // 如果需要，你可以选择在这里输出错误信息
            e.reply(err.toString());
        }
    }

    async news(e) {
        if (fs.existsSync('news.json')) {  
            try {
                const fileContent = fs.readFileSync('news.json', 'utf8');
                console.log('数据获取成功');
                const jsonData = JSON.parse(fileContent);
                jsonData.forEach(item => {
                    if (item!== "") {
                        e.reply(item);
                    }
                });
            } catch (err) {
                console.error("读取文件内出错：", err);
                e.reply('数据读取失败，请检查配置文件');
                e.reply(err.toString());
            }
        } else {
            await e.reply('数据获取失败，请使用[#早报更新]更新配置文件');
        }
    } 

}



