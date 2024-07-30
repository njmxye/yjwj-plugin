import fs from 'node:fs'
import{ execSync } from 'child_process';

const files = fs.readdirSync('./plugins/yjwj-plugin/apps').filter(file => file.endsWith('.js'))

logger.info(`--------yjwj-plugin插件初始化~--------`)
logger.info(`--------劫批你终于来了，我tm等你很久了~--------`)
logger.info(`--------感谢使用劫批专用脚本，请勿乱用！~--------`)
logger.info(`--------现在就打开b站，狠狠关注b站冰可儿！交流群：966160338！~--------`)
logger.info(`--------现在就打开b站，狠狠点赞b站冰可儿！交流群：966160338！~--------`)
logger.info(`--------现在就打开b站，狠狠投币b站冰可儿！交流群：966160338！~--------`)
let ret = []
files.forEach((file) => {
    ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
    let name = files[i].replace('.js', '')

    if (ret[i].status != 'fulfilled') {
        logger.error(`载入插件错误：${logger.red(name)}`)
        logger.error(ret[i].reason)
        continue
    }
    apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

export { apps }


