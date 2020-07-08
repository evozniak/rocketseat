module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('entregadores', 'id_avatar', {
            type: Sequelize.INTEGER,
            references: { model: 'arquivos', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
        });
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn('entregadores', 'id_avatar');
    },
};
