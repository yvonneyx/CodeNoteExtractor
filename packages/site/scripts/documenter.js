"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const input = './temp';
const output = 'markdown';
/**
 * <zh> 构建 G6
 *
 * <en> Build G6
 */
function build() {
    (0, child_process_1.execSync)('cd ../g6 && npm run build:cjs');
}
/**
 * <zh> 抽取文档
 *
 * <en> Extract document
 */
function prepare() {
    // create etc folder
    if (!fs_1.default.existsSync('etc')) {
        fs_1.default.mkdirSync('etc');
    }
    // extract
    (0, child_process_1.execSync)('api-extractor run --local --verbose');
    // generate markdown
    (0, child_process_1.execSync)(`api-documenter markdown -i ${input} -o ${output}`);
}
/**
 * <zh> 清理文档
 *
 * <en> Clear document
 */
function clear() {
    (0, child_process_1.execSync)(`rm -rf ${input}`);
    (0, child_process_1.execSync)(`rm -rf ${output}`);
    (0, child_process_1.execSync)(`rm -rf etc`);
    (0, child_process_1.execSync)(`rm -rf tsdoc-metadata.json`);
}
const fns = {
    build,
    prepare,
    clear,
};
const argv = process.argv.slice(2);
if (argv.length === 0) {
    console.log(`Options: ${Object.keys(fns).join(', ')}`);
}
else {
    argv.forEach((arg) => {
        console.log(`Running: ${arg}`);
        if (arg in fns)
            fns[arg]();
        else
            console.warn(`Unknown option: ${arg}`);
    });
}
