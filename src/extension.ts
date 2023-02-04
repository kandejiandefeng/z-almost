import * as vscode from 'vscode';
import { translate } from './commands/translate';
import { saveClip, onTextChange } from './commands/saveClip';
import { previewInit, resetView } from './commands/preview';

// 激活生命周期
export function activate(context: vscode.ExtensionContext) {
	if(!context) {
		return;
	}
	let selectRange: vscode.TextEditorSelectionChangeEvent;
	// 鼠标光标收集事件
	vscode.window.onDidChangeTextEditorSelection((select: vscode.TextEditorSelectionChangeEvent) => {
		selectRange = select;
	});

	vscode.workspace.onDidChangeTextDocument(() => {
		resetView(context);
	});

	// 工作区输入改变代码提示
	onTextChange(context);


	// 测试hello
	vscode.commands.registerCommand('z-almost.almost', () => {
		vscode.window.showInformationMessage('Hello World from z-almost!');
		vscode.window.showInformationMessage('哈哈哈  傻逼!');
	});

	// 翻译指令
	vscode.commands.registerCommand('z-almost.translate', () => {
		translate(selectRange, "en");
	});
	vscode.commands.registerCommand('z-almost.retranslate', () => {
		translate(selectRange, "zh");
	});

	// 简便保存片段
	vscode.commands.registerCommand('z-almost.saveClip', () => {
		saveClip(context, selectRange);
	});

	// 预览视图
	vscode.commands.registerCommand('z-almost.preview', () => {
		previewInit(context);
	});
}

// 关闭生命周期
export function deactivate() {}
