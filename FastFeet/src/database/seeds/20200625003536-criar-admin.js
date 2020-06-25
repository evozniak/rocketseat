const bcrypt = require('bcryptjs');

module.exports = {
    up: (QueryInterface) => {
        return QueryInterface.bulkInsert(
            'usuarios',
            [
                {
                    nome: 'Distribuidora FastFeet',
                    email: 'admin@fastfeet.com',
                    senha_hash: bcrypt.hashSync('123456', 8),
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        );
    },

    down: () => {},
};
