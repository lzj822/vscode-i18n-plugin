import * as vscode from 'vscode';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export function activate(context: vscode.ExtensionContext) {

	let workspacePath = vscode.workspace.workspaceFolders;

	vscode.window.showOpenDialog().then(result => {
		console.log(result);
	});
	
	console.log('Congratulations, your extension "i18n-plugin" is now active!');

	let enPath = vscode.workspace.getConfiguration().get("i18n-plugin.enPath");

	console.log(enPath);

	const showInputBoxConfig = {
		placeHolder: '第一次运行，请配置en.json路径',
		value: workspacePath && workspacePath[0].uri.path
	}
	
	if (!enPath || enPath === "") {
		vscode.window.showInputBox(showInputBoxConfig).then(value => {
			if (!value) {
				vscode.window.showInformationMessage("必须配置data.en.json的路径");
			} else {
				vscode.workspace.getConfiguration().update("i18n-plugin.enPath", value);
			}
		})
	} 
	
	let disposable = vscode.commands.registerCommand('i18n-plugin.i18n-generator', (uri) => {
		
		vscode.window.showInformationMessage('Hello World from I18N-Plugin!');


		vscode.workspace.openTextDocument(uri).then(doc => {
			const a = parse(doc.getText(), {sourceType: "module", plugins: ['jsx', 'typescript']});

			traverse(a, {
				enter(path) {

					if (path.isStringLiteral()) {
						console.log(path.node.value);
					}
				}
			})

			console.log(a);
		})
		
		const editor = vscode.window.activeTextEditor;
		editor?.setDecorations

		if (editor) {
			let decorationType = vscode.window.createTextEditorDecorationType({ backgroundColor: '#fff' });
			// editor.setDecorations(decorationType, [new vscode.Range])
		}

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the word within the selection
			const word = document.getText(selection);

			console.log(word);
			const filePath = uri.path.split('/').slice(-3).reduce((pre: string, cur:string) => {
				if (cur.includes(".tsx")) {
					return pre + "." + cur.split(".")[0];
				}
				return pre + "." + cur.charAt(0).toUpperCase() + cur.slice(1);
			}, "Admin") 
			console.log(filePath);
			if (uri) {
				vscode.window.showInputBox({
					value: filePath
				}).then(value => {
					const val = `I18N.get({ key: "${value}" })`
					editor.edit(editBuilder => {
						editBuilder.replace(selection, val);
					});
				})
			}
			
		}
	});


	context.subscriptions.push(disposable);

	// let a = vscode.commands.registerCommand('i18n-plugin.analyse-i18n', (uri) => {
	// 	console.log(uri.fsPath());
	// 	vscode.workspace.openTextDocument(uri.path).then(doc => {
	// 		console.log(doc);
	// 	})
		
	// })

	

	// context.subscriptions.push(a)
}

export function deactivate() {}
