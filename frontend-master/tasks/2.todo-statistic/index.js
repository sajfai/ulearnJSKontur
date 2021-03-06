const {getAllFilePathsWithExtension, readFile, getComments, writeComments, getImportantComments, getCommentsByUserName, sortImportantComments, sortCommentsByUser, sortCommentsByDate} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    if (command.startsWith("user ")) {
        userName = command.substring("user ".length);
        writeComments(getCommentsByUserName(files, userName));
    } else { 
        switch (command) {
            case 'exit':
                process.exit(0);
                break;
            case 'show':
                writeComments(getComments(files));
                break;
            case 'important':
                writeComments(getImportantComments(files));
                break;
            case 'sort importance':
                writeComments(sortImportantComments(files));
                break;
            case 'sort user':
                writeComments(sortCommentsByUser(files));
                break;
            case 'sort date':
                writeComments(sortCommentsByDate(files));
                break;
            default:
                console.log('wrong command');
                break;
        }
    
    }
}

// TODO you can do it!
