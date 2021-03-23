import * as vscode from 'vscode';
import meta from '../utils/meta';
import config from '../utils/config';

export class Annotation {
    private isAnalyse: boolean = false;
    private decorationType = vscode.window.createTextEditorDecorationType({ 
        backgroundColor: '#FF8C00',
        color: '#fff'
    });

    insert() {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            return ;
        }
        const { document, selection } = activeTextEditor;
        activeTextEditor.edit(editBuilder => {
            const selectionPosition = selection.active;
            const endCharacter =  document.lineAt(selectionPosition).range.end.character;
            editBuilder.insert(new vscode.Position(selectionPosition.line, endCharacter), ` ${config.annotationConfig.content}`);
        });
    }

    insertXML() {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            return ;
        }
        const { document, selection } = activeTextEditor;
        activeTextEditor.edit(editBuilder => {
            const selectionPosition = selection.active;
            const line = document.lineAt(selectionPosition);
            // const startCharacterIndex = line.firstNonWhitespaceCharacterIndex;
            const endCharacter =  line.range.end.character;
            editBuilder.insert(new vscode.Position(selectionPosition.line, endCharacter), ` ${config.annotationConfig.xmlContent}`);
        });
    }

    analyse() {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            return ;
        }
        const { document } = activeTextEditor;
        const text = document.getText();

        const reg = /\(need I18N\)/g;

        if (!this.isAnalyse) {
            const matches = [];
            let regexMatch;
            while ((regexMatch = reg.exec(text)) !== null) {
                matches.push(regexMatch);
            }
            
            if (matches.length !== 0) {
                const rangeArray = matches.map(match => {
                    const startPos = activeTextEditor.document.positionAt(match.index);
                    const endPos = activeTextEditor.document.positionAt(match.index + match[0].length);
                    return {
                        range: new vscode.Range(startPos, endPos),
                    };
                });
    
                activeTextEditor.setDecorations(this.decorationType, rangeArray);
                
            }
            this.isAnalyse = true;
        } else {
            activeTextEditor.setDecorations(this.decorationType, []);
            this.isAnalyse = false;
            
        }
        
    }

}

const annotation = new Annotation();

export const insertAnnotationCommandHandler = () => {
    return vscode.commands.registerCommand(meta.COMMANDS.insertAnnotation, () => {
        annotation.insert();
    });
};

export const insertXMLAnnotationCommandHandler = () => {
    return vscode.commands.registerCommand(meta.COMMANDS.insertXMLAnnotation, () => {
        annotation.insertXML();
    });
};

export const analyseCommandHandler = () => {
    return vscode.commands.registerCommand(meta.COMMANDS.analyse, () => {
        annotation.analyse();
    });
};