module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('usuarios', 'prestador', Sequelize.BOOLEAN);
	},

	down: (queryInterface) => {
		return queryInterface.removeColumn('usuarios', 'prestador');
	},
};
