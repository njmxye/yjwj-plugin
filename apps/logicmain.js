import plugin from '../../../lib/plugins/plugin.js'
import{ execSync } from 'child_process';
import fs from 'fs';
import path from 'path'
import fetch from 'node-fetch'
import os from 'os'
// 检查是否有data/ys-dio-pic文件夹，没有则创建
let imgfol = './data/yjwjimg'
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
                    reg: '^图.*$',
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
                    reg: '^表情$',
                    fnc: 'meme'
                },
            ]
        })
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
            '1. 输入#永劫无间全部图源\n可以获取全部图源（仅主人可用）\n',
            '2. 输入图\n可以获取随机图源\n',
            '3. 输入永劫更新数据\n可以更新图源\n',
            '4. 输入永劫无间帮助\n可以查看帮助信息\n',
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
