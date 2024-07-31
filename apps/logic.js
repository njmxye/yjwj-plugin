import plugin from '../../../lib/plugins/plugin.js'
import{ execSync } from 'child_process';
import fs from 'fs';
import path from 'path'
import fetch from 'node-fetch'
import os from 'os'
// 检查是否有data/ys-dio-pic文件夹，没有则创建

let imgfol = './data/yjwjimg'
let queue1 = './plugins/yjwj-plugin/sundry/queue1.json'
let queue2 = './plugins/yjwj-plugin/sundry/queue2.json'
let queue3 = './plugins/yjwj-plugin/sundry/queue3.json'
let queue4 = './plugins/yjwj-plugin/sundry/queue4.json'
let singleRow = [];
let doubleRow = [];
let tripleRow = [];
let quadrupleRow = [];
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
                    reg: '^海报.*$',
                    fnc: 'imgmanual'
                },       
                {
                    reg: '^永劫无间帮助$',
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
                    reg: '^#(单排|双排|三排|四排).*$',
                    fnc:'queue'
                },
                {
                    reg: '^#取消$',
                    fnc: 'queueout'
                },
                {
                    reg: '^#排队列表$',
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
        try {
            queuelist_total(e)
            let reg = new RegExp('^#(单排|双排|三排).*$')
            let regRet = reg.exec(e.msg)
            // 发送正在写入数据库的消息
            e.reply('正在写入数据库……');
            user_idadd = e.at;
            let a = 'http://q2.qlogo.cn/headimg_dl?dst_uin=' + user_idadd + '&spec=5';
            if (!regRet) return false;
            switch (regRet[1]) {
                case '单排':
                    singleRow.push({ user_idadd });
                    fs.writeFileSync(queue1, JSON.stringify(singleRow));
                    break;
                case '双排':
                    doubleRow.push({ user_idadd });
                    fs.writeFileSync(queue2, JSON.stringify(doubleRow));
                    break;
                case '三排':
                    tripleRow.push({ user_idadd });
                    fs.writeFileSync(queue3, JSON.stringify(tripleRow));
                    break;
                case '四排':
                    quadrupleRow.push({ user_idadd });
                    fs.writeFileSync(queue4, JSON.stringify(quadrupleRow));
                    break;
            }

            // 构建祝贺消息
            let msg = ['排队成功，他想打劫了，当前排队人数请看#排队列表……', segment.image(a), e.nickname, '(' + String(user_idadd) + ')' + '已计入' + regRet[1] + '队列'];

            // 发送排队成功的消息
            e.reply('排队成功');
            e.reply(msg);

        } catch (error) {
            throw new Error('获取成员信息失败或者在构建排队信息时出错');
        }
    }

    async queuelist_total(e) {

        fs.readFile(queue1, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        singleRow = JSON.parse(data);
        });

        fs.readFile(queue2, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        doubleRow = JSON.parse(data);
        });

        fs.readFile(queue3, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        tripleRow = JSON.parse(data);
        });

        fs.readFile(queue4, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        quadrupleRow = JSON.parse(data);
        });

        // 打印数组长度和内容示例


        e.reply('当前排队人数：\n' + '单排：' + singleRow.length + '人\n' + '双排：' + doubleRow.length + '人\n' + '三排：' + tripleRow.length + '人'+'\n'+'四排：' + quadrupleRow.length + '人');
        e.reply('单排：' + singleRow.toString());
        e.reply('双排：' + doubleRow.toString());
        e.reply('三排：' + tripleRow.toString());
        e.reply('四排：' + quadrupleRow.toString());

    }

    async queueout(e) {
        e.reply('功能没写完')
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
            const buffer = await response.buffer();
            fs.writeFileSync(downloadPath, buffer);
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
            '1. 输入#永劫无间全部图源\n  可以获取全部图源\n',
            '2. 输入图\n  可以获取随机图源\n',
            '3. 输入永劫更新数据\n  可以更新图源\n',
            '4. 输入永劫无间帮助\n  可以查看帮助信息\n',
            '5. 输入#(单排|双排|三排|四排)\n  可以排队\n',
            '6. 输入#排队列表\n  可以查看排队列表\n',
            '我身无拘  武道无穷\n'
        ])
        return true
    }
    async update_config(e) {
        await e.reply('正在更新配置文件……')
        try {
            // 使用 execSync 确保命令执行完再继续后面的步骤。
            let output1 = execSync('python ./plugins/yjwj-plugin/apps/imgv1.2.py');
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
