import plugin from '../../../lib/plugins/plugin.js'
import '../../../lib/plugins/loader.js'
import{ execSync } from 'child_process';
import fs from 'fs';
import _ from 'lodash'
import path from 'path'
import fetch from 'node-fetch'
const axios = require('axios');
const puppeteer = require('puppeteer') 
const { JSDOM } = require('jsdom');
const cheerio = require('cheerio');
var imgurls = [];
import common from'../../../lib/common/common.js'
import os from 'os'
import { segment } from 'icqq';
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
                    reg: '^新闻$',
                    fnc: 'news'
                },
                {
                    reg: '^海报.*$',
                    fnc: 'imgmanual'
                },
                {
                    reg: '^fufu$',
                    fnc: 'fufu'
                },
                {
                    reg: '^fufuupdate$',
                    fnc: 'fufuupdate'
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
    async fufu(e) {  
    const data = await fs.promises.readFile('./plugins/yjwj-plugin/sundry/fufu/fufu.json', 'utf-8');  
    const jsonData = JSON.parse(data);  
    
    while (jsonData.length === 0) {  
        e.reply("暂无表情包，正在获取图片数据...")
        await this.fufu_update(e);  
        const updatedData = await fs.promises.readFile('./plugins/yjwj-plugin/sundry/fufu/fufu.json', 'utf-8');  
        jsonData = JSON.parse(updatedData);  
    }  
    
    const randomIndex = Math.floor(Math.random() * jsonData.length);  
    const randomValue = jsonData[randomIndex];  
    e.reply(segment.image(randomValue));  
    e.reply("上帝说要有未来= =、");  
    }


    async fufu_update(e){
        async function sendRequest(url) {
            const headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "max-age=0",
            "priority": "u=0, i",
            "referer": "https://cn.bing.com/",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "cross-site",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0"
          }
          
            const response = await axios.get(url, { headers }); // 发送GET请求
            //fs.writeFileSync(filenames, response.data, 'utf-8');
            const htmldata=response.data;
            const dom = new JSDOM(htmldata).window.document;
            const imagestags = dom.getElementsByTagName('img');
            for (let i=0;i<imagestags.length;i++){
                const datasrc = imagestags[i].getAttribute('data-src');
                if (datasrc){
                    imgurls.push(datasrc);
                }
            }
            return imgurls;
          
          }
          async function writetojsons(imgurls){
            fs.writeFileSync("./plugins/yjwj-plugin/sundry/fufu/fufu.json", JSON.stringify(imgurls, null, '\n'), 'utf-8');
            return 1;
          }
          
          const imgurl1 = sendRequest('https://www.bilibili.com/read/cv18799777/');
          const imgurl2 = sendRequest('https://www.bilibili.com/read/cv19884404/');
          Promise.all([imgurl1, imgurl2])
           .then(results => {
              const finalImgUrls = results.reduce((acc, result) => acc.concat(result), []);
              imgurls = finalImgUrls;
              console.log(imgurls);
              writetojsons(imgurls);
              e.reply('表情包文件更新成功！');
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
            '11. 输入新闻\n返回今日新闻图片\n',
            '12. 输入fufu\n随机返回一个fufu表情包\n',
            '13. 输入(胡桃|季季莹|迦南|顾清寒|沈妙|水娘|妖刀|紫萍|狐狸)\n获取角色语音\n',
            '14. 戳一下机器人\n成功被机器人复仇16下！\n',
            '我身无拘  武道无穷！\n',
            '咱们群里上过修罗的，记得和群主要修罗头衔！'
            
        ])
        return true
    }
    async update_config(e) {
        const finalList = [];
        const headersTongyong = {
        "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "priority": "i",
        "referer": "https://www.yjwujian.cn/media/",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "image",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
        "x-requested-with": "XMLHttpRequest"
        };

        async function downloadImages(url, folderName) {
        try {
            const response = await axios.get(url, { headers: headersTongyong });
            const $ = cheerio.load(response.data);
            const imgTags = $('img');

            if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName, { recursive: true });
            }

            let i = 0;
            imgTags.each((index, element) => {
            i++;
            const imgSrc = $(element).attr('src');
            finalList.push(imgSrc);
            });

            console.log(`成功获取 ${i} 张图片的URL列表。`);

        } catch (error) {
            console.error(`An error occurred: ${error}`);
        } finally {
            console.log("获取的图片链接列表成功");
        }
        }

        async function downloadImages2(url, folderName) {
        try {
            const response = await axios.get(url, { headers: headersTongyong });
            const $ = cheerio.load(response.data);
            const imgTags = $('.item');

            if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName, { recursive: true });
            }

            let i = 0;
            imgTags.each((index, element) => {
            i++;
            const imgSrc = $(element).attr('data-thumb');
            finalList.push(imgSrc);
            });

            console.log(`成功获取 ${i} 张图片的URL列表。`);

        } catch (error) {
            console.error(`An error occurred: ${error}`);
        } finally {
            console.log("获取的图片链接列表成功");
        }
        }

        async function main() {
        // 下载海报
        const haibaoUrl = "https://www.yjwujian.cn/media/#/pic";
        const haibaoFolderName = "yjwujian_images/haibao";
        await downloadImages(haibaoUrl, haibaoFolderName);

        // 下载截图
        const jietuUrl = "https://www.yjwujian.cn/media/#/screenshot";
        const jietuFolderName = "yjwujian_images/jietu";
        await downloadImages(jietuUrl, jietuFolderName);

        let num = 2;
        for (let i = 1; i < 20; i++) {
            // 下载更多海报
            const haibaoUrl = `https://www.yjwujian.cn/inline/20v2/wallpaper/pic_index_${num}.html`;
            await downloadImages2(haibaoUrl, haibaoFolderName);
            num += 1;
        }

        num = 2;
        for (let i = 1; i < 20; i++) {
            // 下载更多截图
            const jietuUrl = `https://www.yjwujian.cn/inline/20v1/printscreen/pic_index_${num}.html`;
            await downloadImages2(jietuUrl, jietuFolderName);
            num += 1;
        }

        const newFinalList = finalList.filter(url => url.length >= 83);
        console.log("本次爬取到url数量如下:", newFinalList.length);
        console.log("最终的图片链接列表如下：");
        newFinalList.forEach(url => console.log(url));
        return newFinalList;
        }

        async function downWithJson(list) {
        const data = list.join('\n');
        fs.writeFileSync('./plugins/yjwj-plugin/sundry/pic/urlconfig.json', data);
        }

        async function run() {
        const list = await main();
        await downWithJson(list);
        console.log('json文件生成成功！');
        }

        run();
    }

    async news(e) {
        function news() {
            let url = 'https://readhub.cn/daily'
            const browser = puppeteer.launch({
                headless: true,
            })  
            const page = browser.newPage()
            page.setViewport({
                width: 800,
                height: 600,
            })
            page.goto(url, { waitUntil: 'domcontentloaded' })
            page.screenshot({ path: './plugins/yjwj-plugin/sundry/news/news.png', fullPage: true })
            browser.close()
        }
        news();
        e.reply(segment.image('./plugins/yjwj-plugin/sundry/news/news.png'));
        e.reply('今天的新闻获取成功了。你真是个爱看新闻的好孩子。');
    } 

}



