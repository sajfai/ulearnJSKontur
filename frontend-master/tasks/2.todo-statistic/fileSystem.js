// TODO aba Добавить функцию getFileName, которая по пути файла будет возвращать его имя. Воспользоваться модулем path из Node.js
const fs = require('fs');

// TODO PE; 2018-08-20; переименовать?
function getAllFilePathsWithExtension(directoryPath, extension, filePaths) {
    filePaths = filePaths || [];
    // TODO Anonymous Developer; 2016-03-17; Необходимо переписать этот код и использовать асинхронные версии функций для чтения из файла
    const fileNames = fs.readdirSync(directoryPath);
    for (const fileName of fileNames) {
        const filePath = directoryPath + '/' + fileName;
        if (fs.statSync(filePath).isDirectory()) {
            getAllFilePathsWithExtension(filePath, filePaths);
        } else if (filePath.endsWith(`.${extension}`)) {
            filePaths.push(filePath);
        }
    }
    return filePaths;
}

function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf8'); // TODO Veronika; 2018-08-16; сделать кодировку настраиваемой
}

function getComments(files) {
    let comments = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let state = "code";
        let startOfComment;
        for (let j = 0; j < file.length; j++) {
            const char = file[j];
            if (state === "code") {
                if (char === "/")
                    state = "/";
                else if (char === "'")
                    state = "'";
                else if (char === '"')
                    state = '"';
            } else if (state === "/") {
                if (char === "/") {
                    state = "comm";
                    startOfComment = j;
                } else
                    throw new Error("Regexp literal not supported");
            } else if (state === "comm") {
                if (char === "\n") {
                    state = "code";
                    comments.push(file.substring(startOfComment + 1, j).toLowerCase());
                }
            } else if (state === "'") {
                if (char === "\\")
                    state = "esc'";
                else if (char === "'")
                    state = "code";
            } else if (state === '"') {
                if (char === "\\")
                    state = 'esc"';
                else if (char === '"')
                    state = "code";
            } else if (state === 'esc"') {
                state = '"';
            } else if (state === "esc'") {
                state = "'";
            } else
                throw new Error("unknown state " + state);
        };
    };
    return comments;
}

function getCommentsWithToDo(comments) {
    let commentsWithToDo = [];
    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        if (comment.startsWith(" todo")) {
            commentsWithToDo.push(comment.substring(" todo ".length));
        };
    };
    return commentsWithToDo;
}

function parseComment(comment) {
    const splitedComment = comment.split(";", 3);
    let [todoAndUserName, dateStr, commentText] = comment.split(";", 3)
    if (splitedComment.length < 3) {
        return {
            userName: null,
            dateStr: null,
            commentText: comment,
            date: null,
        }
    } else {
        const userName = todoAndUserName;
        return {
            userName,
            dateStr,
            commentText,
            date: new Date(Date.parse(dateStr)),
        }
    }
}

function writeComments(comments) {
    console.log(comments);
}

function getImportantComments(files) {
    const comments = getCommentsWithToDo(getComments(files));
    let importantComments = [];
    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        if (comment.includes("!")) {
            importantComments.push(comment);
        };
    };
    return importantComments;
}


function getCommentsByUserName(files, userName) {
    const comments = getCommentsWithToDo(getComments(files));
    let commentsByUserName = [];
    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        if (parseComment(comment).userName === userName) {
            commentsByUserName.push(comment);
        };
    };
    return commentsByUserName;
}

function getImportance(comment) {
    return comment.split("").filter(x => x === "!").length;
}
function sortImportantComments(files) {
    const comments = getCommentsWithToDo(getComments(files));
    comments.sort((comment1, comment2) => getImportance(comment2) - getImportance(comment1));
    return comments;
}

function sortCommentsByUser(files) {
    const comments = getCommentsWithToDo(getComments(files));
    comments.sort(function (comment1, comment2) {
        const parsed1 = parseComment(comment1);
        const parsed2 = parseComment(comment2);
        if (parsed1.userName === null) {
            return 1;
        }
        if (parsed2.userName === null) {
            return -1;
        }
        if (parsed1.userName > parsed2.userName) {
            return 1;
          }
          if (parsed1.userName < parsed2.userName ) {
            return -1;
          }
          return 0;
    });
    return comments;
}

function sortCommentsByDate(files) {
    const comments = getCommentsWithToDo(getComments(files));
    comments.sort(function (comment1, comment2) {
        const parsed1 = parseComment(comment1);
        const parsed2 = parseComment(comment2);
        if (parsed1.date === null) {
            return 1;
        }
        if (parsed2.date === null) {
            return -1;
        }
        if (parsed1.date > parsed2.date) {
            return -1;
          }
          if (parsed1.date < parsed2.date ) {
            return 1;
          }
          return 0;
    });
    return comments;
}

// TODO Digi; 2018-09-21; Добавить функцию getFileName, которая по пути файла будет возвращать его имя. Воспользоваться модулем path из Node.js
// TODO aa Добавить функцию getFileName, которая по пути файла будет возвращать его имя. Воспользоваться модулем path из Node.js

module.exports = {
    getAllFilePathsWithExtension,
    readFile,
    getComments,
    writeComments,
    getImportantComments,
    getCommentsByUserName,
    sortImportantComments,
    getCommentsWithToDo,
    sortCommentsByUser,
    sortCommentsByDate
};
