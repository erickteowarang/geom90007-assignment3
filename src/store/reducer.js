const Reducer = (state, action) => {
  switch (action.type) {
      case 'SET_POINTS':
          return {
              ...state,
              points: action.payload
          };
      case 'ADD_POINT':
          return {
              ...state,
              points: state.posts.concat(action.payload)
          };
      case 'REMOVE_POINT':
          return {
              ...state,
              points: state.posts.filter(post => post.id !== action.payload)
          };
      case 'SET_ERROR':
          return {
              ...state,
              error: action.payload
          };
      default:
          return state;
  }
};

export default Reducer;