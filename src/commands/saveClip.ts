import * as vscode from "vscode";

let selectRange: vscode.TextEditorSelectionChangeEvent;
let range: vscode.Range;

// 保存代码片段的操作
export function saveClip(
	context: vscode.ExtensionContext,
	select: vscode.TextEditorSelectionChangeEvent
): any {
	// 输入关键词或者代码片段名
	vscode.window
		.showInputBox({
			// 这个对象中所有参数都是可选参数
			password: false, // 输入内容是否是密码
			ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
			placeHolder: "为你的代码片段命名？(英文)", // 在输入框内的提示信息
			prompt: "赶紧输入，不输入就赶紧滚", // 在输入框下方的提示信息
		})
		.then((msg) => {
			if (msg) {
				// 存入全局内存中
				let date: any = context.globalState.get("almost");
				if (date) {
					date = JSON.parse(date);
				} else {
					date = {};
				}
				selectRange = select;
				range = new vscode.Range(select.selections[0].start, select.selections[0].end);
				const str = select.textEditor.document.getText(range);
				date[msg] = str;
				context.globalState.update("almost", JSON.stringify(date));
			}
		});
}
// 工作区文本变化事件
export function onTextChange(context: vscode.ExtensionContext) {
	// 支持的语言类型
	const LANGUAGES = ["typescript", "javascript", "html", "vue", "json"];
	//   触发推荐的字符列表
	const triggers = [" ", ".", ">"];
	const completionProvider = vscode.languages.registerCompletionItemProvider(
		LANGUAGES,
		{
			async provideCompletionItems(
				document: vscode.TextDocument,
				position: vscode.Position,
			) {
                // 获取当前输入的字母
				const text = document.getText(
					new vscode.Range(
						position.line,
						position.character - 1,
						position.line,
						position.character
					)
				);
                // 当空格或.的时候记录替换初始点
				let startPosition: vscode.Position = new vscode.Position(0, 0);
				if (text === " " || text === ".") {
					startPosition = position;
				}
                // 全局缓存的数据拼装成CompletionItem格式
				const globalDate: string | undefined = context.globalState.get("almost");
				const option = globalDate ? JSON.parse(globalDate) : {};
				const completionList: vscode.CompletionItem[] = [];
				const range = new vscode.Range(startPosition, position);
				Object.keys(option).forEach((item: string) =>
					completionList.push({
						label: item,
						detail: option[item],
						textEdit: new vscode.TextEdit(range, option[item]),
					})
				);
				return completionList;
			},
		},
		...triggers
	);
	context.subscriptions.push(completionProvider);
}
