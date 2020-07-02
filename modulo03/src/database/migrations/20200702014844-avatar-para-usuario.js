module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('usuarios', 'id_avatar', {
			type: Sequelize.INTEGER,
			references: { model: 'arquivos', key: 'id' },
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
			allowNull: true,
		});
	},

	down: (queryInterface) => {
		return queryInterface.removeColumn('usuarios', 'id_avatar');
	},
};
