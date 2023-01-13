import * as vscode from 'vscode';
import {translate} from './commands/translate';

// 激活生命周期
export function activate(context: vscode.ExtensionContext) {
	let selectRange: vscode.TextEditorSelectionChangeEvent;
	// 鼠标光标收集事件
	vscode.window.onDidChangeTextEditorSelection((select: vscode.TextEditorSelectionChangeEvent) => {
		selectRange = select;
	});

	// 测试hello
	vscode.commands.registerCommand('z-almost.almost', () => {
		vscode.window.showInformationMessage('Hello World from z-almost!');
	});
	// 翻译指令
	vscode.commands.registerCommand('z-almost.translate', () => {
		translate(context, selectRange);
	});

}

// 关闭生命周期
export function deactivate() {}
