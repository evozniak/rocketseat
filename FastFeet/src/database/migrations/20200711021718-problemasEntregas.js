module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('problemasEntregas', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            id_encomenda: {
                type: Sequelize.INTEGER,
                references: { model: 'encomendas', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: false,
            },
            descricao: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('problemasEntregas');
    },
};
