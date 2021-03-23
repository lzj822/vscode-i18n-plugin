import * as vscode from 'vscode';
import meta from '../utils/meta';
import config from '../utils/config';

export class Annotation {

    insert() {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            return ;
        }

        const { document, selection } = activeTextEditor;
        
        console.log(selection);

        activeTextEditor.edit(editBuilder => {
            const selectionPosition = selection.active;
            const endCharacter =  document.lineAt(selectionPosition).range.end.character;
            editBuilder.insert(new vscode.Position(selectionPosition.line, endCharacter), config.annotationConfig.content);
        });
    }

}

const annotation = new Annotation();

export const insertAnnotationCommandHandler = () => {
    return vscode.commands.registerCommand(meta.COMMANDS.insertAnnotation, () => {
        annotation.insert();
    });
};