import axios from 'axios';
import FacebookLogin from 'react-facebook-login';
import Oauth from './Oauth';
 
const responseFacebook =async (response) => {
  if(response.accesstToken){
    console.log('log in with accessToken=' + response.accesstToken)
    let result = await axios.post ('http://localhost:8000/api/login', {
      token: response.accesstToken
    })
    console.log(result.data)
  }
  console.log(response);
}

function App() {
  return (
/*    <div>
      <FacebookLogin
        appId="653696369258410"
        autoLoad={true}
        fields="name,email,picture"
        callback={responseFacebook} /> 
    </div>*/
   <Oauth/>
  );
}


export default App;

