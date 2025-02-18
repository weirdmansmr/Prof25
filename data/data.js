
const users = [];
let userIdCounter = 1;

const files = [];
let fileIdCounter = 1;

module.exports = {
    users,
    files,
    getNextUserId: () => userIdCounter++,
    getNextFileId: () => fileIdCounter++,
};
