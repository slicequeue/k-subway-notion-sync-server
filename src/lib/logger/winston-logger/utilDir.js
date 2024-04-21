/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

/**
 * 폴더를 생성하는 역할을 맡는다.
 * @param folder
 * @param newFolder
 */
exports.createFolder = function createFolder(folder, newFolder) {
    const tgFolder = path.join(folder, newFolder);
    fs.mkdir(tgFolder, 0o777, function (err) {
        if (err) {
            return false;
        }
        console.log('create newDir: ' + tgFolder);
        return true;
    });
};

/**
 * 폴더가 존재하는지 찾는다. 있다면 폴더위치를 리턴하고, 없다면 false를 리턴한다.
 * @param folder
 * @param findFolder
 * @return {boolean}
 */
exports.searchFolder = function searchFolder(folder, findFolder) {
    fs.readdir(folder, function (err, files) {
        if (err) throw err;

        files.forEach(function (file) {
            if (file === findFolder) {
                fs.stat(path.join(folder, file), function (statErr, stats) {
                    if (stats.isDirectory()) {
                        return path.join(folder, file);
                    }
                });
            }
        });
    });
    return false;
};

