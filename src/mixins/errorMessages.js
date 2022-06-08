const errorMessages = {
  computed: {
    errorMessages() {
      return {
        "Couldn't find User": 'Usuário não encontrado',
        'is too short (minimum is 6 characters)':
          'A senha precisa ter pelo menos 6 caracteres.',
        invalid: 'Token inválido',
        "doesn't match Password": 'As senhas infomadas não correspondem.',
        'invalid format': 'Digite um e-mail válido.',
        'has already been taken': 'Este e-mail já está cadastrado no sistema.',
      };
    },
  },
};

export default errorMessages;
