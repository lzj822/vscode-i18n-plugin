/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(2), exports);


/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.manualInitCommandHandler = void 0;
const vscode = __webpack_require__(3);
const Config_1 = __webpack_require__(4);
const meta_1 = __webpack_require__(5);
class InitPath {
    manualInit() {
        return __awaiter(this, void 0, void 0, function* () {
            const okText = "立即配置";
            const result = yield vscode.window.showInformationMessage(`您的I18N配置文件放在那里？`, okText);
            if (result !== okText) {
                return;
            }
            const filePath = yield this.pickFile();
            if (!filePath) {
                vscode.window.showErrorMessage("文件路径地址有误");
            }
            else {
                Config_1.default.updateI18nPaths(filePath);
                this.success();
            }
        });
    }
    pickFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let file = yield vscode.window.showOpenDialog();
            if (file && Array.isArray(file)) {
                return file && file[0].path;
            }
            return null;
        });
    }
    success() {
        vscode.window.showInformationMessage("配置成功");
    }
}
const initPath = new InitPath();
const manualInitCommandHandler = () => {
    return vscode.commands.registerCommand(meta_1.default.COMMANDS.manualInitPath, () => {
        initPath.manualInit();
    });
};
exports.manualInitCommandHandler = manualInitCommandHandler;


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("vscode");;

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(3);
const I18N_PATHS_KEY = 'i18nPaths';
class Config {
    static get extensionName() {
        return this.extName;
    }
    static setConfig(key, value, isGlobal = false) {
        return vscode.workspace.getConfiguration(this.extensionName).update(key, value, isGlobal);
    }
    static getConfig(key) {
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
    static updateI18nPaths(path) {
        console.log(path);
        this.setConfig(I18N_PATHS_KEY, path);
    }
}
exports.default = Config;


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    COMMANDS: {
        manualInitPath: "i18n-plugin.manualInitPath",
        insertAnnotation: "i18n-plugin.insertAnnotation",
        insertXMLAnnotation: "i18n-plugin.insertXMLAnnotation",
        analyse: "i18n-plugin.analyse",
    }
};


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.analyseCommandHandler = exports.insertXMLAnnotationCommandHandler = exports.insertAnnotationCommandHandler = exports.Annotation = void 0;
const vscode = __webpack_require__(3);
const meta_1 = __webpack_require__(5);
const config_1 = __webpack_require__(7);
class Annotation {
    constructor() {
        this.isAnalyse = false;
        this.decorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: '#FF8C00',
            color: '#fff'
        });
    }
    insert() {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            return;
        }
        const { document, selection } = activeTextEditor;
        activeTextEditor.edit(editBuilder => {
            const selectionPosition = selection.active;
            const endCharacter = document.lineAt(selectionPosition).range.end.character;
            editBuilder.insert(new vscode.Position(selectionPosition.line, endCharacter), ` ${config_1.default.annotationConfig.content}`);
        });
    }
    insertXML() {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            return;
        }
        const { document, selection } = activeTextEditor;
        activeTextEditor.edit(editBuilder => {
            const selectionPosition = selection.active;
            const line = document.lineAt(selectionPosition);
            // const startCharacterIndex = line.firstNonWhitespaceCharacterIndex;
            const endCharacter = line.range.end.character;
            editBuilder.insert(new vscode.Position(selectionPosition.line, endCharacter), ` ${config_1.default.annotationConfig.xmlContent}`);
        });
    }
    analyse() {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            return;
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
        }
        else {
            activeTextEditor.setDecorations(this.decorationType, []);
            this.isAnalyse = false;
        }
    }
}
exports.Annotation = Annotation;
const annotation = new Annotation();
const insertAnnotationCommandHandler = () => {
    return vscode.commands.registerCommand(meta_1.default.COMMANDS.insertAnnotation, () => {
        annotation.insert();
    });
};
exports.insertAnnotationCommandHandler = insertAnnotationCommandHandler;
const insertXMLAnnotationCommandHandler = () => {
    return vscode.commands.registerCommand(meta_1.default.COMMANDS.insertXMLAnnotation, () => {
        annotation.insertXML();
    });
};
exports.insertXMLAnnotationCommandHandler = insertXMLAnnotationCommandHandler;
const analyseCommandHandler = () => {
    return vscode.commands.registerCommand(meta_1.default.COMMANDS.analyse, () => {
        annotation.analyse();
    });
};
exports.analyseCommandHandler = analyseCommandHandler;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = {
    annotationConfig: {
        content: '// (need I18N)',
        xmlContent: '{/* (need I18N) */}'
    }
};


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const commands_1 = __webpack_require__(1);
const Config_1 = __webpack_require__(4);
const annotation_1 = __webpack_require__(6);
Config_1.default.extName = 'i18n-plugin';
function activate(context) {
    // 激活插件成功
    console.log('Congratulations, your extension "i18n-plugin" is now active!');
    // 加载模块
    const manualInitCommand = commands_1.manualInitCommandHandler();
    const insertAnnotationCommand = annotation_1.insertAnnotationCommandHandler();
    const insertXMLAnnotationCommand = annotation_1.insertXMLAnnotationCommandHandler();
    const analyseCommand = annotation_1.analyseCommandHandler();
    // 往context上注册事件
    context.subscriptions.push(manualInitCommand);
    context.subscriptions.push(insertAnnotationCommand);
    context.subscriptions.push(insertXMLAnnotationCommand);
    context.subscriptions.push(analyseCommand);
    // let workspacePath = vscode.workspace.workspaceFolders;
    // // vscode.window.showOpenDialog().then(result => {
    // // 	console.log(result);
    // // });
    // let enPath = vscode.workspace.getConfiguration().get("i18n-plugin.enPath");
    // console.log(enPath);
    // const showInputBoxConfig = {
    // 	placeHolder: '第一次运行，请配置en.json路径',
    // 	value: workspacePath && workspacePath[0].uri.path
    // };
    // if (!enPath || enPath === "") {
    // 	vscode.window.showInputBox(showInputBoxConfig).then(value => {
    // 		if (!value) {
    // 			vscode.window.showInformationMessage("必须配置data.en.json的路径");
    // 		} else {
    // 			vscode.workspace.getConfiguration().update("i18n-plugin.enPath", value);
    // 		}
    // 	});
    // } 
    // let disposable = vscode.commands.registerCommand('i18n-plugin.i18n-generator', (uri) => {
    // 	vscode.window.showInformationMessage('Hello World from I18N-Plugin!');
    // 	vscode.workspace.openTextDocument(uri).then(doc => {
    // 		const a = parse(doc.getText(), {sourceType: "module", plugins: ['jsx', 'typescript']});
    // 		traverse(a, {
    // 			enter(path) {
    // 				if (path.isStringLiteral()) {
    // 					console.log(path.node.value);
    // 				}
    // 			}
    // 		})
    // 		console.log(a);
    // 	})
    // 	const editor = vscode.window.activeTextEditor;
    // 	editor?.setDecorations;
    // 	if (editor) {
    // 		let decorationType = vscode.window.createTextEditorDecorationType({ backgroundColor: '#fff' });
    // 		// editor.setDecorations(decorationType, [new vscode.Range])
    // 	}
    // 	if (editor) {
    // 		const document = editor.document;
    // 		const selection = editor.selection;
    // 		// Get the word within the selection
    // 		const word = document.getText(selection);
    // 		console.log(word);
    // 		const filePath = uri.path.split('/').slice(-3).reduce((pre: string, cur:string) => {
    // 			if (cur.includes(".tsx")) {
    // 				return pre + "." + cur.split(".")[0];
    // 			}
    // 			return pre + "." + cur.charAt(0).toUpperCase() + cur.slice(1);
    // 		}, "Admin") 
    // 		console.log(filePath);
    // 		if (uri) {
    // 			vscode.window.showInputBox({
    // 				value: filePath
    // 			}).then(value => {
    // 				const val = `I18N.get({ key: "${value}" })`
    // 				editor.edit(editBuilder => {
    // 					editBuilder.replace(selection, val);
    // 				});
    // 			})
    // 		}
    // 	}
    // });
    // //访问编辑器
    // // vscode.window.activeTextEditor;
    // context.subscriptions.push(disposable);
    // // let a = vscode.commands.registerCommand('i18n-plugin.analyse-i18n', (uri) => {
    // // 	console.log(uri.fsPath());
    // // 	vscode.workspace.openTextDocument(uri.path).then(doc => {
    // // 		console.log(doc);
    // // 	})
    // // })
    // // context.subscriptions.push(a)
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map