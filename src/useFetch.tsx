import axios from 'axios';

// user/auth
// {
//     "email": "user@user.ru",
//     "password": "pass123"
// }
//Ответ:
// {
//     "id": 1,
//     "email": "user@user.ru",
//     "password": "pass123",
//     "name": "Антон"
// }




function useFetch(url: string, method: string, requestData:{email:string, password:string}) {
  if(method === "POST"){
    const fetchPost = async (url: string, data:{email:string, password:string}) => {
      try {
        const response = await axios.post(url, {
          // Здесь вы можете передать данные, которые нужно отправить на сервер
          email: data.email,
          password: data.password
        });
        
        console.log(response);
        return response;
      } catch (error) {
        console.error('Error occurred during POST request:', error);
      }
    };
    fetchPost(url, requestData)
  }
  else if (method === "POST"){
    //get method
  }

  
}




export default useFetch;














