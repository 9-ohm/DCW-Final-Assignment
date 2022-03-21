
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
 
const responseFacebook = async (response) => {
  if(response.accessToken){
    console.log('log in with accesstoken=' + response.accessToken)
    let result = await axios.post('http://localhost:8000/api/login',{
      token: response.accessToken
    })
    console.log(response);
  }
}

function App() {
  return (
    <div>
      <FacebookLogin
        appId="1772502426429723"
        autoLoad={true}
        fields="name,email,picture"
        callback={responseFacebook} />
    </div>
  );
}

export default App;
