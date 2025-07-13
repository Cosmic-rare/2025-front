import axios from "axios"

// const BASEURL = "0.0.0.0:9011/"
const BASEURL = "https://spotai-info.tani-exe.net/"

export const APIget = async (path: string, e: Function, f: Function) => {
  try {
    const res = await axios.get(new URL(path, BASEURL).href)
    f()
    return res.data
  } catch (err) {
    e(err)
  }
  f()
}

export const APIpost = async (path: string, body: any, e: Function, f: Function, updateToken = () => { }, s?: Function) => {
  try {
    const res = await axios.post(new URL(path, BASEURL).href, body)
    if (s) s()
    f()
    return res.data
  } catch (err: any) {
    if (err.response && (err.response.status === 403 ||err.response.status === 401) ) {
      if (["TokenExpired", "PermissionError", "NoToken"].includes(err.response.data.m)) {
        updateToken()
      }
    }
    e(err)
  }
  f()
}
