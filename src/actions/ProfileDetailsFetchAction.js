import axios from 'axios';

export const fetchUserName = (apiKey) => {
  return dispatch => {
    axios.get("https://api.torn.com/user/?selections=profile&key="+apiKey)
      .then(res => {
        var yourName=res.data.name;
        localStorage.setItem("YOUR_NAME",yourName);
        dispatch(success(yourName));
      })
      .catch(err => {
        dispatch(failed(err.message));
      });
  };
};

const success = (yourName) => ({
  type: "YOUR_NAME_UPDATED",
  payload: {
    loading: false,
    yourName
  }
});

const failed = (error) => ({
  type: "API_CALL_FAILED",
  payload: {
    error,
    loading: false
  }
});