import * as vscode from 'vscode';
import Config, { I18N_PATHS_KEY } from '../config/Config';
import meta from '../utils/meta';
import * as fs from 'fs';
import * as Path from 'path';

export class Generator {

    getFile() {
        const path: string | undefined = vscode.workspace.getConfiguration(Config.extensionName).get(I18N_PATHS_KEY);
        if (!path || path === "") {
            vscode.commands.executeCommand(meta.COMMANDS.manualInitPath);
        } else {
            try {
                const filePath = Path.parse(path.slice(1));
                const data = fs.readFileSync(Path.format(filePath), "utf-8");
                return data;
            } catch(e) {
                vscode.window.showErrorMessage("file open error");
                return null;
            }
        }
    }

    writeFile(dataObject: { [x: string]: string; }) {
        const path: string | undefined = vscode.workspace.getConfiguration(Config.extensionName).get(I18N_PATHS_KEY);
        if (path) {
            try {
                const filePath = Path.parse(path.slice(1));
                fs.writeFileSync(Path.format(filePath), JSON.stringify(dataObject, null, 4));
                console.log('123456');
                vscode.window.showInformationMessage("write file success");
            } catch(e) {
                vscode.window.showErrorMessage("write file error");
            }
        }
    }

    generatorI18n() {
        let data = this.getFile();
        let dataObject: { [x: string]: string; } = {};
        if (data === null) {
            return ;
        } else {
            if (data !== "") {
                try {
                    dataObject = JSON.parse(data!);
                } catch(e) {
                    vscode.window.showErrorMessage("json parse error");
                }
            }
        }

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const { selection } = editor;
        const uri = editor.document.uri;
        const filePath = uri.path.split('/').slice(-3).reduce((pre: string, cur:string) => {
            if (cur.includes(".tsx")) {
                return pre + "." + cur.split(".")[0];
            }
            return pre + "." + cur.charAt(0).toUpperCase() + cur.slice(1);
        }, "Admin");
        if (uri) {
            vscode.window.showInputBox({
                value: filePath
            }).then(value => {
                if (value) {
                    const val = `I18N.get({ key: "${value}" })`;
                    if (dataObject[value]) {
                        vscode.window.showErrorMessage("I18N key alerady exists");
                        return ;
                    }
                    dataObject[value] = editor.document.getText(selection).replace(/(^("|'))|(("|')$)/g,"");
                    editor.edit(editBuilder => {
                        editBuilder.replace(selection, val);
                    });
                    this.writeFile(dataObject);
                }
            });
        }
    }
}

const generator = new Generator();

export const generatorI18nCommandHandler = () => {
    return vscode.commands.registerCommand(meta.COMMANDS.generator, () => {
        generator.generatorI18n();
    });
};