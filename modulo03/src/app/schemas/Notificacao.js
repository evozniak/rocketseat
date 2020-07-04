import mongoose from 'mongoose';

const NotificacaoSchema = new mongoose.Schema(
	{
		conteudo: {
			type: String,
			required: true,
		},
		usuario: {
			type: Number,
			required: true,
		},
		lida: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Notificacao', NotificacaoSchema);
