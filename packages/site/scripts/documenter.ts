import { execSync } from 'child_process';
import fs from 'fs';

const input = './temp';
const output = 'docs';

/**
 * <zh> 构建 G6
 *
 * <en> Build G6
 */
function build() {
  execSync('cd ../my-ts-lib && npm run build');
}

/**
 * <zh> 抽取文档
 *
 * <en> Extract document
 */
function prepare() {
  // create etc folder
  if (!fs.existsSync('etc')) {
    fs.mkdirSync('etc');
  }
  // extract
  execSync('api-extractor run --local --verbose');
  // generate markdown
  execSync(`api-documenter markdown -i ${input} -o ${output}`);
}

/**
 * <zh> 清理文档
 *
 * <en> Clear document
 */
function clear() {
  execSync(`rm -rf ${input}`);
  // execSync(`rm -rf ${output}`);
  execSync(`rm -rf etc`);
  execSync(`rm -rf tsdoc-metadata.json`);
}

const fns: Record<string, () => void> = {
  build,
  prepare,
  clear,
};

const argv = process.argv.slice(2);

if (argv.length === 0) {
  console.log(`Options: ${Object.keys(fns).join(', ')}`);
} else {
  argv.forEach((arg) => {
    console.log(`Running: ${arg}`);
    if (arg in fns) fns[arg]();
    else console.warn(`Unknown option: ${arg}`);
  });
}
