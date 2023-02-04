import * as vscode from "vscode";

// 获取光标框选的内容  传入光标事件回传数据 select
export const getSelectText = (select: vscode.TextEditorSelectionChangeEvent) => {
	const range = new vscode.Range(select.selections[0].start, select.selections[0].end);
	return select.textEditor.document.getText(range);
};
// 回去web页面内容拼装
export const getDocumentHtml = (content: string) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta http-equiv="Content-Security-Policy" content="default-src 'none';">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Cat Coding</title>
</head>
<body>
    ${content}
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
        document.getElementById('content').innerHTML =
        marked.parse(${content});
    </script>
</body>
</html>`;
};
