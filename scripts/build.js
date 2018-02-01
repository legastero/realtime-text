const FS = require('fs');
const Child = require('child_process').execSync;


const BundleDir = `${__dirname}/../bundled`;


// Copy local package files
Child('npm run clean');
Child('npm run compile');
Child('mkdir -p dist/npm');
Child('cp -r dist/src/* dist/npm/');
Child('cp README.md dist/npm/');
Child(`cp ${__dirname}/../LICENSE.md dist/npm/`);

// Create package.json file
const Pkg = JSON.parse(FS.readFileSync('package.json'));
FS.writeFileSync('dist/npm/package.json', JSON.stringify(Object.assign({}, Pkg, {
    private: false,
    main: './index.js',
    typings: './index',
    'jsnext:main': './index.js',
    scripts: undefined
}), null, 2));


// Create package bundle
const BundleName = Pkg.name.replace('@', '').replace('/', '-');
Child('cd dist/npm && npm pack');
Child(`mkdir -p ${__dirname}/../bundled`);
Child(`mv dist/npm/*.tgz ${__dirname}/../bundled/${BundleName}.tgz`);

