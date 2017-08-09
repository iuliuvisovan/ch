var users = {};

var handler = {
    init: function (io) {
        io.on('connection', function (socket) {
            socket.on('check-in', function (msg) {
                if (!msg)
                    return;
                users[socket.id] = {};
                users[socket.id].name = msg;
                var message = {
                    name: msg,
                    isFemale: isFemaleName(msg),
                    messageText: isFemaleName(msg) ?
                        " ni s-a alăturat! Ce faci drăguțo? 😏" :
                        " a venit la distracție. Salut bos! 😎"
                };
                io.emit('join', JSON.stringify(message));
            });
            socket.on('chat message', function (msg) {
                var message = {
                    socketId: socket.id.slice(2),
                    name: users[socket.id].name,
                    messageText: correctSentence(msg.trim())
                };
                io.emit('chat message', JSON.stringify(message));
            });
            socket.on('disconnect', function () {
                var msg = users[socket.id] || ''.name;
                if (!msg || !msg.length)
                    return;
                var message = {
                    name: msg,
                    isFemale: isFemaleName(msg),
                    messageText: isFemaleName(msg) ? " a ieșit afară. Era o curvă proastă oricum." : " a ieșit in pizda mă-sii afară."
                };
                io.emit('leave', JSON.stringify(message));
            });
        });
    }
};


function isFemaleName(name) {
    var isFemale;
    var hardcoded = ['Demi', 'Paula', 'Lady', 'Megan', 'Ada', 'Bianca', 'Camelia', 'Daciana', 'Adina', 'Bogdana', 'Casiana', 'Dana',
        'Adriana', 'Brandusa', 'Catinca', 'Daria', 'Agata', 'Catrinel', 'Delia', 'Alida', 'Catalina', 'Doina', 'Alina', 'Celia',
        'Dora', 'Amelia', 'Cezara', 'Dumitra', 'Ana', 'Clarisa', 'Anca', 'Codrina', 'Codruta', 'Anda', 'Corina', 'Andreea',
        'Crenguta', 'Anemona', 'Cristina', 'Anica', 'Anuta', 'Aura', 'Roxana', 'Carmen', 'Cora', 'Lari'
    ];
    if (hardcoded.indexOf(name) >= 0)
        isFemale = true;
    if (name[name.length - 1] == 'a' || name[name.length - 1] == 'ă')
        isFemale = true;
    return isFemale;
}

function correctSentence(sentence) {
    sentence[0] = sentence[0].toUpperCase();
    sentence = sentence[0].toUpperCase() + sentence.substr(1);
    var validFinishCharacters = ['.', '!', '?'];
    if (validFinishCharacters.indexOf(sentence[sentence.length - 1]) < 0) {
        sentence += ".";
    }
    return sentence;
}

module.exports = handler;