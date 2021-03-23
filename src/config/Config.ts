import * as vscode from 'vscode';

const I18N_PATHS_KEY = 'i18nPaths';

export default class Config {
    static extName: string;

    static get extensionName() {
        return this.extName;
    }

    static setConfig(key: string, value: string, isGlobal = false) {
        return vscode.workspace.getConfiguration(this.extensionName).update(key, value, isGlobal);
    }

    static getConfig(key: string): any {
        return vscode.workspace.getConfiguration(this.extensionName).get(key);
    }

    static get i18nPaths() {
        // const rootPath = vscode.workspace.rootPath
        const path = this.getConfig(I18N_PATHS_KEY);
        return path;
        // const relativePaths = paths ? paths.split(',') : []
    
        // return relativePaths.map((pathItem: string) =>
        //   path.resolve(rootPath, pathItem)
        // )
      }

    static updateI18nPaths(path: string) {
        console.log(path);
        this.setConfig(I18N_PATHS_KEY, path);
    }
}