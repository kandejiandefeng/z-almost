import * as vscode from "vscode";
import { getDocumentHtml } from "../public/until";
import { marked } from "marked";
const fs = require("fs");
const path = require("path");

let view: vscode.WebviewPanel;

export function previewInit(context: vscode.ExtensionContext) {
	view = vscode.window.createWebviewPanel("testWebview", "预览", vscode.ViewColumn.Two, {
		enableScripts: true, // 启用JS，默认禁用
		retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
	});
	changeContent(context, view);
}

export function resetView(context: vscode.ExtensionContext) {
    console.log(view.active);
    if(view) {
        changeContent(context, view);
    }
}

function changeContent(context: vscode.ExtensionContext, view: vscode.WebviewPanel) {
    const type = vscode.window.activeTextEditor?.document.fileName || "";
	const content = vscode.window.activeTextEditor?.document.getText() || "";
	if (/.md$/.test(type)) {
		setMd(content, (parseResult: string) => {
			view.webview.html = getDocumentHtml(parseResult);
        });
	} else if (/.vue$/.test(type)) {
		view.webview.html = getWebViewContent(context, './index.html');
	} else if (/.ts$|.js$/.test(type)) {
		view.webview.html = content;
	} else {
		view.webview.html = content;
	}
}

function setMd(content: string, call: Function) {
	// 采用插件 marked 转化 md 格式为 dom
	// 插件地址 https://github.com/markedjs/marked
	marked(content, (error: any, parseResult: string) => {
		if (!error && call) {
            call(parseResult);
		}
	});
}

function getWebViewContent(context: vscode.ExtensionContext, templatePath: string) {
	const resourcePath = path.join(context.extensionPath, templatePath);
	const dirPath = path.dirname(resourcePath);
	let html = fs.readFileSync(resourcePath, "utf-8");
	// vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
	html = html.replace(
		/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g,
		(m: any, $1: any, $2: any) => {
			return (
				$1 +
				vscode.Uri.file(path.resolve(dirPath, $2))
					.with({ scheme: "vscode-resource" })
					.toString() +
				'"'
			);
		}
	);
	return html;
}
