const fs = require('fs');
const path = require('path');

// Lista expandida de directorios y archivos a excluir
const defaultExclusions = [
    // Directorios de dependencias y paquetes
    'node_modules',
    'packages',
    'vendor',
    'bower_components',

    // Directorios de compilación y distribución
    'dist',
    'build',
    'out',
    'output',

    // Directorios de cache
    '.cache',
    '.npm',
    '.yarn',

    // Directorios de control de versiones
    '.git',
    '.svn',
    '.hg',

    // Directorios de IDE y editores
    '.idea',
    '.vscode',
    '.vs',

    // Directorios temporales
    'tmp',
    'temp',

    // Directorios de logs
    'logs',
    'log',

    // Directorios de coverage y testing
    'coverage',
    '.nyc_output',

    // Archivos específicos a excluir (por extensión)
    '.exe',
    '.dll',
    '.so',
    '.dylib',
    '.log',
    '.env',
    '.DS_Store',
    'thumbs.db',
    '.lock',

    // Directorios de assets compilados
    'public/assets',
    'public/dist',

    // Otros directorios comunes para excluir
    '.docker',
    '.terraform',
    '.next',
    '.nuxt'
];

function isExcluded(path, exclusions) {
    return exclusions.some(exc => {
        // Maneja tanto archivos como directorios
        if (exc.startsWith('.')) {
            // Para extensiones de archivo
            if (path.endsWith(exc)) return true;
        }
        return path.includes(exc);
    });
}

function getAllFiles(dirPath, arrayOfFiles = [], exclude = defaultExclusions) {
    if (!fs.existsSync(dirPath)) {
        console.error(`Directory does not exist: ${dirPath}`);
        return arrayOfFiles;
    }

    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);

        // Verificar exclusiones
        if (isExcluded(fullPath, exclude)) {
            return;
        }

        try {
            if (fs.statSync(fullPath).isDirectory()) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles, exclude);
            } else {
                // Verificar tamaño del archivo antes de incluirlo
                const stats = fs.statSync(fullPath);
                const fileSizeInMB = stats.size / (1024 * 1024);

                if (fileSizeInMB > 10) { // Excluir archivos mayores a 10MB
                    console.warn(`Skipping large file (${fileSizeInMB.toFixed(2)}MB): ${fullPath}`);
                    return;
                }

                arrayOfFiles.push(fullPath);
            }
        } catch (err) {
            console.error(`Error accessing ${fullPath}:`, err.message);
        }
    });

    return arrayOfFiles;
}

function compileFiles(directoryPath, outputFile = 'compiled_files.txt') {
    try {
        console.log('Starting compilation...');
        console.log('Scanning directory:', directoryPath);

        // Obtener todos los archivos
        const allFiles = getAllFiles(directoryPath);

        if (allFiles.length === 0) {
            console.log('No files found to compile!');
            return;
        }

        // Crear/sobrescribir el archivo de salida
        fs.writeFileSync(outputFile, '');

        // Agregar información del tiempo y sistema
        const header = `Compilation Date: ${new Date().toISOString()}\n` +
                      `Base Directory: ${directoryPath}\n` +
                      `Total Files: ${allFiles.length}\n\n`;
        fs.appendFileSync(outputFile, header);

        // Procesar cada archivo
        let processedCount = 0;
        allFiles.forEach(filePath => {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(directoryPath, filePath);
                const separator = '\n' + '='.repeat(80) + '\n';

                // Agregar la ruta y contenido al archivo
                fs.appendFileSync(outputFile, 
                    `${separator}File: ${relativePath}${separator}${content}\n`
                );

                processedCount++;
                if (processedCount % 10 === 0) {
                    console.log(`Progress: ${processedCount}/${allFiles.length} files processed`);
                }
            } catch (err) {
                console.error(`Error processing file ${filePath}:`, err.message);
            }
        });

        // Agregar resumen al final del archivo
        const summary = `\n${'-'.repeat(80)}\nCompilation Summary:\n` +
                       `Total files processed: ${processedCount}\n` +
                       `Compilation completed at: ${new Date().toISOString()}\n`;
        fs.appendFileSync(outputFile, summary);

        console.log('\nCompilation complete!');
        console.log(`Output saved to: ${outputFile}`);
        console.log(`Successfully processed: ${processedCount}/${allFiles.length} files`);

    } catch (err) {
        console.error('Error during compilation:', err.message);
    }
}

// Uso del script
const directoryToScan = process.argv[2] || '.';
compileFiles(directoryToScan);