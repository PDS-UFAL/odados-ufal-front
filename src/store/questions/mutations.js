import TYPES from '../types';

export default {
  [TYPES.SET_QUESTIONS](state, questions) {
    state.questions = [...questions];
  },
  [TYPES.RESET_QUESTIONS](state) {
    state.questions = [
      JSON.parse(
        JSON.stringify({
          id: 0,
          title: null,
          response: null,
          required: true,
          type: 'short-text',
          max_char: 250,
          min_value: null,
          max_value: null,
          options: [''],
          file: { name: '', size: '' },
          fileError: false,
        }),
      ),
    ];
  },
  [TYPES.ADD_QUESTION](state, section) {
    let newQuestion = {
      ...{
        id: 0,
        title: null,
        response: null,
        required: true,
        type: 'short-text',
        max_char: 250,
        min_value: null,
        max_value: null,
        options: [''],
        file: { name: '', size: '' },
        fileError: false,
      },
      id: state.questions.at(-1).id + 1,
    };

    state.questions.push(newQuestion);
    section.questions_attributes.push(newQuestion);
  },
  [TYPES.REMOVE_QUESTION](state, { id }) {
    if (state.questions.length === 1) return;

    state.questions = [
      ...state.questions.filter((question) => question.id !== id),
    ];
  },
  [TYPES.DUPLICATE_QUESTION](state, question) {
    state.questions.push({ ...question, id: state.questions.at(-1).id + 1 });
  },
  [TYPES.ADD_SECTION](state) {
    let newQuestion = {
      ...{
        title: null,
        response: null,
        required: true,
        type: 'short-text',
        max_char: 250,
        min_value: null,
        max_value: null,
        options: [''],
        file: { name: '', size: '' },
        fileError: false,
      },
      id: state.questions.at(-1).id + 1,
    };
    let newSection = {
      ...{
        name: 'Seção ' + (state.sections.at(-1).id + 2),
        questions_attributes: [],
      },
      id: state.sections.at(-1).id + 1,
    };
    newSection.questions_attributes.push(newQuestion);

    state.questions.push(newQuestion);
    state.sections.push(newSection);
  },

  [TYPES.RESET_SECTIONS](state) {
    let newQuestion = {
      ...{
        id: 0,
        title: null,
        response: null,
        required: true,
        type: 'short-text',
        max_char: 250,
        min_value: null,
        max_value: null,
        options: [''],
        file: { name: '', size: '' },
        fileError: false,
      },
    };
    let newSection = {
      ...{
        id: 0,
        name: 'Seção 1',
        questions_attributes: [],
      },
    };
    newSection.questions_attributes.push(newQuestion);

    state.questions = [newQuestion];
    state.sections = [newSection];
  },

  // [TYPES.REMOVE_QUESTION](state, { id }) {
  //   if (state.questions.length === 1) return;

  //   state.questions = [
  //     ...state.questions.filter((question) => question.id !== id),
  //   ];
  // },
};
