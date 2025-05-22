const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const shouldUpdateAndroid = args.length === 0 || args.includes('--android');
const shouldUpdateIos = args.length === 0 || args.includes('--ios');

const dotenvPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(dotenvPath)) {
  console.error('❌ Arquivo .env não encontrado na raiz do projeto.');
  process.exit(1);
}

const envContent = fs.readFileSync(dotenvPath, 'utf8');
const versaoRegex = /^VERSAO_APP\s*=\s*(.+)$/m;
const match = envContent.match(versaoRegex);

if (!match) {
  console.error('❌ Variável VERSAO_APP não encontrada no .env.');
  process.exit(1);
}

const version = match[1].trim();
const versionCode = Math.floor(Date.now() / 1000);

console.log(`🚀 Atualizando versão para ${version}`);

// ------------------------
// ANDROID - build.gradle
// ------------------------

if (!shouldUpdateAndroid) {
  console.log('⚠️  Atualização do Android ignorada.');
}

if (shouldUpdateAndroid) {
  const androidBuildPath = path.join(
    __dirname,
    '..',
    'android',
    'app',
    'build.gradle',
  );
  let buildGradle = fs.readFileSync(androidBuildPath, 'utf8');

  // Remove linha antiga e adiciona nova
  buildGradle = buildGradle.replace(
    /versionCode\s+\d+/,
    `versionCode ${versionCode}`,
  );

  buildGradle = buildGradle.replace(
    /versionName\s+["'].*?["']/,
    `versionName ${version}`,
  );

  fs.writeFileSync(androidBuildPath, buildGradle, 'utf8');
  console.log(`✅ Android: Versão: ${version} | Buildscript: ${versionCode}`);
}

// ------------------------
// iOS - Info.plist
// ------------------------

if (!shouldUpdateIos) {
  console.log('⚠️  Atualização do iOS ignorada.');
}

if (shouldUpdateIos) {
  const iosDir = path.join(__dirname, '..', 'ios');
  const plistFolder = fs.readdirSync(iosDir).find(f => {
    const fullPath = path.join(iosDir, f);
    return (
      fs.statSync(fullPath).isDirectory() &&
      fs.existsSync(path.join(fullPath, 'Info.plist'))
    );
  });

  if (!plistFolder) {
    console.warn('⚠️  Nenhum projeto iOS encontrado com Info.plist.');
  } else {
    const versionInIos = version.replace(/[^0-9.]/g, '');
    const plistPath = path.join(iosDir, plistFolder, 'Info.plist');
    let plist = fs.readFileSync(plistPath, 'utf8');

    // Captura versões atuais
    const currentVersionMatch = plist.match(
      /<key>CFBundleShortVersionString<\/key>\s*<string>([^<]+)<\/string>/,
    );
    const currentBuildMatch = plist.match(
      /<key>CFBundleVersion<\/key>\s*<string>([^<]+)<\/string>/,
    );

    let currentVersion = currentVersionMatch?.[1] || '';
    let currentBuild = parseInt(currentBuildMatch?.[1] || '0', 10);

    let newBuildCode;

    if (currentVersion === versionInIos) {
      newBuildCode = currentBuild + 1;
    } else {
      newBuildCode = 1;
    }

    plist = plist
      .replace(
        /<key>CFBundleShortVersionString<\/key>\s*<string>[^<]+<\/string>/,
        `<key>CFBundleShortVersionString</key>\n\t<string>${versionInIos}</string>`,
      )
      .replace(
        /<key>CFBundleVersion<\/key>\s*<string>[^<]+<\/string>/,
        `<key>CFBundleVersion</key>\n\t<string>${newBuildCode}</string>`,
      );

    fs.writeFileSync(plistPath, plist, 'utf8');
    console.log(`✅ iOS: Versão: ${versionInIos} | Build: ${newBuildCode}`);
  }
}

const rawVersion = version;
const versionPackege = rawVersion?.replace(/^["']|["']$/g, ''); // Remove aspas externas

// Caminho do package.json
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Atualiza a versão
packageJson.version = versionPackege;

// Salva o package.json atualizado
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2) + '\n',
  'utf8',
);

console.log(`✅ package.json: versão ${version}`);

console.log('🎉 Versão do app atualizada com sucesso com base no .env!');
