import axios from "axios"

export const login = async (username:string,password:string)=>{
    const res = await axios.post('http://localhost:8082/api/login',{
        username,
        password
    })
    let userData:any = null;
    if(res.data.data){
        userData = parseToken(res.data.data)
    }
    console.log(userData)
    return {
        userData:userData,
        token:res.data.data
    }
}

//token解析函数
export function parseToken(token: string) {
  const payload = token.split('.')[1];
  const decoded = atob(payload || '');
  console.log(JSON.parse(decoded))
  return JSON.parse(decoded);
}
