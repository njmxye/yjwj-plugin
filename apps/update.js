import plugin from '../../../lib/plugins/plugin.js'
import { createRequire } from 'module'
import lodash from 'lodash'
import { Restart } from '../../other/restart.js'

const require = createRequire(import.meta.url)
const { exec, execSync } = require('child_process')

// 是否在更新中
let uping = false

/**
 * 处理插件更新
 */
export class update extends plugin {
  constructor () {
    super({
      name: 'yjwj更新插件',
      event: 'message',
      priority: 1009,
      rule: [
        {
          reg: '^#?yj更新$',
          fnc: 'update',
          permission:'master'
        }
      ]
    })
  }

  /**
   * rule - 更新yjwj
   * @returns
   */
  async update () {
    if (!this.e.isMaster) return false

    /** 检查是否正在更新中 */
    if (uping) {
      await this.reply('我都正在更新了，劫批催什么？')
      return
    }

    /** 检查git安装 */
    if (!(await this.checkGit())) return

    const isForce = this.e.msg.includes('强制')

    /** 执行更新 */
    await this.runUpdate(isForce)

    /** 是否需要重启 */
    if (this.isUp) {
      await this.reply('更新完毕，正在重启你的崽子以应用更新')
      setTimeout(() => this.restart(), 2000)
    }
  }

  restart () {
    new Restart(this.e).restart()
  }

  /**
   * 更新
   * @param {boolean} isForce 是否为强制更新
   * @returns
   */
  async runUpdate (isForce) {
    let command = 'git -C ./plugins/yjwj-plugin/ pull --no-rebase'
    if (isForce) {
      command = `git -C ./plugins/yjwj-plugin/ checkout . && ${command}`
      this.e.reply('正在执行强制更新操作，你等一会儿嗷')
    } else {
      this.e.reply('正在执行更新操作，你等一会儿嗷')
    }

    
    this.oldCommitId = await this.getcommitId('yjwj-plugin')
    uping = true
    const ret = await this.execSync(command)
    uping = false

    if (ret.error) {
      logger.mark(`${this.e.logFnc} 更新失败：yjwj-plugin`)
      this.gitErr(ret.error, ret.stdout)
      return false
    }

    /** 获取插件提交的最新时间 */
    const time = await this.getTime('yjwj-plugin')

    if (/(Already up[ -]to[ -]date|已经是最新的了狗修金)/.test(ret.stdout)) {
      await this.reply(`yjwj-plugin已经是最新版本了狗修金\n最后更新时间：${time}`)
    } else {
      await this.reply(`yjwj-plugin\n最后更新时间：${time}`)
      this.isUp = true
      /** 获取yjwj-plugin的更新日志 */
      const log = await this.getLog('yjwj-plugin')
      await this.reply(log)
    }

    logger.mark(`${this.e.logFnc} 最后更新时间：${time}`)

    return true
  }

  /**
   * 获取yjwj-plugin的更新日志
   * @param {string} plugin 插件名称
   * @returns
   */
  async getLog (plugin = '') {
    const cm = `cd ./plugins/${plugin}/ && git log  -20 --oneline --pretty=format:"%h||[%cd]  %s" --date=format:"%m-%d %H:%M"`

    let logAll
    try {
      logAll = await execSync(cm, { encoding: 'utf-8' })
    } catch (error) {
      logger.error(error.toString())
      this.reply(error.toString())
    }

    if (!logAll) return false

    logAll = logAll.split('\n')

    let log = []
    for (let str of logAll) {
      str = str.split('||')
      if (str[0] == this.oldCommitId) break
      if (str[1].includes('Merge branch')) continue
      log.push(str[1])
    }
    const line = log.length
    log = log.join('\n\n')

    if (log.length <= 0) return ''

    let end = ''
    end =
      '更多详细信息，请前往github查看\nhttps://github.com/njmxye/yjwj-plugin'

    log = await this.makeForwardMsg(`yjwj-plugin更新日志，共${line}条`, log, end)

    return log
  }

  /**
   * 获取上次提交的commitId
   * @param {string} plugin 插件名称
   * @returns
   */
  async getcommitId (plugin = '') {
    const cm = `git -C ./plugins/${plugin}/ rev-parse --short HEAD`

    let commitId = await execSync(cm, { encoding: 'utf-8' })
    commitId = lodash.trim(commitId)

    return commitId
  }

  /**
   * 获取本次更新插件的最后一次提交时间
   * @param {string} plugin 插件名称
   * @returns
   */
  async getTime (plugin = '') {
    const cm = `cd ./plugins/${plugin}/ && git log -1 --oneline --pretty=format:"%cd" --date=format:"%m-%d %H:%M"`

    let time = ''
    try {
      time = await execSync(cm, { encoding: 'utf-8' })
      time = lodash.trim(time)
    } catch (error) {
      logger.error(error.toString())
      time = '获取时间失败'
    }
    return time
  }

  /**
   * 制作转发消息
   * @param {string} title 标题 - 首条消息
   * @param {string} msg 日志信息
   * @param {string} end 最后一条信息
   * @returns
   */
  async makeForwardMsg (title, msg, end) {
    let nickname = Bot.nickname
    if (this.e.isGroup) {
      const info = await Bot.geyjwjroupMemberInfo(this.e.group_id, Bot.uin)
      nickname = info.card || info.nickname
    }
    const userInfo = {
      user_id: Bot.uin,
      nickname
    }

    let forwardMsg = [
      {
        ...userInfo,
        message: title
      },
      {
        ...userInfo,
        message: msg
      }
    ]

    if (end) {
      forwardMsg.push({
        ...userInfo,
        message: end
      })
    }

    /** 制作转发内容 */
    if (this.e.isGroup) {
      forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
    } else {
      forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
    }

    /** 处理描述 */
    forwardMsg.data = forwardMsg.data
      .replace(/\n/g, '')
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
      .replace(/___+/, `<title color="#777777" size="26">${title}</title>`)

    return forwardMsg
  }

  /**
   * 处理更新失败的相关函数
   * @param {string} err
   * @param {string} stdout
   * @returns
   */
  async gitErr (err, stdout) {
    const msg = '更新失败！'
    const errMsg = err.toString()
    stdout = stdout.toString()

    if (errMsg.includes('Timed out')) {
      const remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, '')
      await this.reply(msg + `\n连接超时：${remote}`)
      return
    }

    if (/Failed to connect|unable to access/g.test(errMsg)) {
      const remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, '')
      await this.reply(msg + `\n连接失败：${remote}`)
      return
    }

    if (errMsg.includes('be overwritten by merge')) {
      await this.reply(
        msg +
          `存在冲突：\n${errMsg}\n` +
          '请解决冲突后再更新，或者执行#强制更新，放弃本地修改'
      )
      return
    }

    if (stdout.includes('CONFLICT')) {
      await this.reply([
        msg + '存在冲突\n',
        errMsg,
        stdout,
        '\n请解决冲突后再更新，或者执行#强制更新，放弃本地修改'
      ])
      return
    }

    await this.reply([errMsg, stdout])
  }

  /**
   * 异步执行git相关命令
   * @param {string} cmd git命令
   * @returns
   */
  async execSync (cmd) {
    return new Promise(
      (resolve, reject) => 
      {
      exec(cmd, { windowsHide: true }, (error, stdout, stderr) => 
      {
        resolve({ error, stdout, stderr })
      })
      }
    )
  }

  /**
   * 检查git是否安装
   * @returns
   */
  async checkGit () {
    const ret = await execSync('git --version', { encoding: 'utf-8' })
    if (!ret || !ret.includes('git version')) {
      await this.reply('请先安装git')
      return false
    }
    return true
  }
}
