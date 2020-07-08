module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('encomendas', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            produto: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            id_destinatario: {
                type: Sequelize.INTEGER,
                references: { model: 'destinatarios', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: false,
            },
            id_entregador: {
                type: Sequelize.INTEGER,
                references: { model: 'entregadores', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: false,
            },
            id_assinatura: {
                type: Sequelize.INTEGER,
                references: { model: 'arquivos', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: true,
            },
            cancelado_em: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            data_inicio: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            data_fim: {
                type: Sequelize.DATE,
                allowNull: true,
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
        return queryInterface.dropTable('encomendas');
    },
};
