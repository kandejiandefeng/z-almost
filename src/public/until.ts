import * as vscode from 'vscode';

// 获取光标框选的内容  传入光标事件回传数据 select
export const getSelectText = (select: vscode.TextEditorSelectionChangeEvent) => {
    const range = new vscode.Range(select.selections[0].start, select.selections[0].end);
    return select.textEditor.document.getText(range);
}; 