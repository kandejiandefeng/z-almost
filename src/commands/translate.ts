import { randomBytes } from 'crypto';
import * as vscode from 'vscode';
const https = require('https');
const md5 = require('md5');

let selectRange: vscode.TextEditorSelectionChangeEvent;
let range: vscode.Range;

// 百度翻译的官网 http://api.fanyi.baidu.com/api/trans/product/desktop
// const appid = 20230112001528384; // 百度翻译的appid
// const salt = '1435660288'; // 随机字符串
// const miyao = 'nexTARA6sb6ISYI5rW6u'; // 百度翻译秘钥

// 获取翻译字段
const getTranlate = (word: string) => {
    const appid = vscode.workspace.getConfiguration().get("zalmost.baidu.appId");
    const salt = randomBytes(10).toString();
    const secret = vscode.workspace.getConfiguration().get("zalmost.baidu.secret");
    if (!appid || !secret) {
        return vscode.window.showErrorMessage("没有设置百度翻译的appId和secret");
    }

    const sign = md5(appid + word + salt + secret); // md5转码
    console.log('appid', appid);
    console.log('secret', secret);
    console.log('salt', salt);
    const str = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${word}&from=auto&to=en&appid=${appid}&salt=${salt}&sign=${sign}`;
    https.get(str, (res: any) => {
        let data = '';
        res.on('data', (chunk: any) => {
            data += chunk;
        });
        res.on('end', () => {
            const option = JSON.parse(data);
            console.log('result', option);
            if (option.hasOwnProperty('trans_result')) {
                selectRange.textEditor.edit((editBuilder: vscode.TextEditorEdit) => {
                    editBuilder.replace(range, option.trans_result[0].dst);
                });
            } else {
                vscode.window.showErrorMessage(`${option.error_code}: ${option.error_msg}`)
            }
        });
    });
};

export function translate(context: vscode.ExtensionContext, select: vscode.TextEditorSelectionChangeEvent): any {
    selectRange = select;
    range = new vscode.Range(select.selections[0].start, select.selections[0].end);
    const str = select.textEditor.document.getText(range);
    getTranlate(str);
}