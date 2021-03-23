import * as vscode from 'vscode';
import Config from '../config/Config';
import meta from '../utils/meta';

class InitPath {

    async manualInit() {
        const okText = "立即配置";
        const result = await vscode.window.showInformationMessage(
            `您的I18N配置文件放在那里？`,
            okText
        );

        if (result !== okText) {
            return ;
        }

        const filePath = await this.pickFile();

        if (!filePath) {
            vscode.window.showErrorMessage("文件路径地址有误");
        } else {
            Config.updateI18nPaths(filePath);
            this.success();
        }
    }

    async pickFile() {
        let file = await vscode.window.showOpenDialog();
        if (file && Array.isArray(file)) {
            return  file && file[0].path;
        }
        return null;
    }

    success() {
        vscode.window.showInformationMessage("配置成功");
    }
}

const initPath = new InitPath();

export const manualInitCommandHandler = () => {
    return vscode.commands.registerCommand(meta.COMMANDS.manualInitPath, () => {
        initPath.manualInit();
    });
};