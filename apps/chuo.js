import plugin from'../../../lib/plugins/plugin.js'
import cfg from'../../../lib/config/config.js'
import common from'../../../lib/common/common.js'
export class chuo extends plugin{
    constructor(){
    super({
        name: '戳一戳',
        dsc: '戳一戳机器人触发效果',
        event: 'notice.group.poke',
        priority: 1,
        rule: [
            {
                fnc: 'chuoyichuo'
                }
            ]
        }
    )
}
async chuoyichuo (e){
    e.reply("戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳你戳")
    if(e.target_id == cfg.qq){
        for (let i = 0; i < 10; i++) {
            await common.sleep(100)
            await e.group.pokeMember(e.operator_id)}
        }
}
    
}
