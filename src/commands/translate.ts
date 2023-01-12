import * as vscode from 'vscode';
const https = require('https');
const md5 = require('md5');

let selectRange: vscode.TextEditorSelectionChangeEvent;
let range: vscode.Range;

// 百度翻译的官网 http://api.fanyi.baidu.com/api/trans/product/desktop
const appid = 20230112001528384; // 百度翻译的appid
const salt = '1435660288'; // 随机字符串
const miyao = 'nexTARA6sb6ISYI5rW6u'; // 百度翻译秘钥

// 获取翻译字段
const getTranlate = (word: string) => {
const sign = md5(appid + word + salt + miyao); // md5转码
    const str = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${word}&from=auto&to=en&appid=${appid}&salt=${salt}&sign=${sign}`;
    https.get(str, (res: any) => {
        let data = '';
        res.on('data', (chunk: any) => {
            data += chunk;
        });
        res.on('end', () => {
            const option = JSON.parse(data);
            selectRange.textEditor.edit((editBuilder: vscode.TextEditorEdit) => {
                editBuilder.replace(range, option.trans_result[0].dst);
            });
        });
    });
};

export function translate(context: vscode.ExtensionContext, select: vscode.TextEditorSelectionChangeEvent): any {
    selectRange = select;
    range = new vscode.Range(select.selections[0].start, select.selections[0].end);
    const str = select.textEditor.document.getText(range);
    getTranlate(str);
}