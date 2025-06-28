import { APIget, APIpost } from "@/util/api"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { useTokenStore } from "@/util/store"
import { notification } from "antd"
import { ModalContent } from "@/components/record/inputs"
import { CircularProgress, Backdrop, Button } from "@mui/material"
import getClass from "@/util/cl"
import Head from "next/head"

// const Post = () => {
//   const router = useRouter()
//   const { id, p } = router.query
//   const [d, sD] = useState<null | any>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const token = useTokenStore((s) => s.token)
//   const updateToken = useTokenStore((s) => s.setToken)
//   const [api, contextHolder] = notification.useNotification()

//   const eAPI = (message: string, description = "だめですごめんなさい") => {
//     api.error({ message: message, description: description, duration: 6, placement: "bottomRight", className: "custom-notification" })
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!(id && p)) { return }
//       const r = await APIget(
//         `/match/${id}`,
//         () => { },
//         () => { }
//       )
//       sD(r)
//     }
//     fetchData()
//   }, [id, p])

//   const handleStartEnd = async () => {
//     if (d[`p_${p}`].startedAt == null && d[`p_${p}`].endedAt == null) {
//       await APIpost(
//         `/match/${id}/${p}/start`,
//         { token: token, recorderId: localStorage.getItem("id") },
//         () => { eAPI("Faild to start game") },
//         async () => {
//           const r = await APIget(
//             `/match/${id}`,
//             () => { eAPI("Faild to fetch game") },
//             () => { }
//           )
//           sD(r)
//         },
//         () => updateToken("")
//       )
//     }
//     if (d[`p_${p}`].startedAt != null && d[`p_${p}`].endedAt == null) {
//       setIsLoading(true)
//       await APIpost(
//         `/match/${id}/${p}/end`,
//         { token: token, recorderId: localStorage.getItem("id"), game: d[`p_${p}`] },
//         () => { eAPI("Faild to stop game") },
//         async () => {
//           const r = await APIget(
//             `/match/${id}`,
//             () => { eAPI("Faild to fetch game") },
//             () => { setIsLoading(false) }
//           )
//           sD(r)
//         },
//         () => updateToken("")
//       )
//     }
//   }

//   const Header = () => {
//     return (
//       <Head>
//         {/* @ts-ignore */}
//         <title>記録ページ: {d.title}, {getClass(d, d.event)[p - 1][0] ?? "未定"} - {getClass(d, d.event)[p - 1][1] ?? "未定"}</title>
//       </Head>
//     )
//   }

//   if (d) {
//     return (
//       <div>
//         <Header />
//         <div style={{ position: "relative", maxWidth: 330, margin: "auto" }}>
//           <Backdrop
//             sx={{ color: "#fff", zIndex: 9999 }}
//             open={isLoading}
//           >
//             <CircularProgress color="inherit" />
//           </Backdrop>
//           <div style={{ height: 10 }} />
//         </div>
//         {contextHolder}

//         {/* <h2>{d.sex == "male" ? "男" : d.sex == "female" ? "女" : "混合"} {d.title}, {getClass(d, d.event)[p - 1][0] ?? "未定"} - {getClass(d, d.event)[p - 1][1] ?? "未定"}</h2> */}
//         {/* @ts-ignore */}
//         <h2>{d.title}, {getClass(d, d.event)[p - 1][0] ?? "未定"} - {getClass(d, d.event)[p - 1][1] ?? "未定"}</h2>
//         <p>{new Date(d[`p_${p}`].scheduledAt).toLocaleString('en-us', { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}開始予定</p>
//         <Button variant="contained" color="warning" onClick={handleStartEnd} disabled={d[`p_${p}`].startedAt != null && d[`p_${p}`].endedAt != null}>
//           {d[`p_${p}`].startedAt == null ? "試合を開始" : d[`p_${p}`].endedAt == null ? "試合を終了し記録" : "-"}
//         </Button>
//         {
//           d[`p_${p}`].startedAt != null && d[`p_${p}`].endedAt == null ?
//             <ModalContent setGame={sD} p={p} game={d} />
//             : null
//         }

//       </div>
//     )
//   } else {
//     <><Header />{contextHolder}</>
//   }
// }

const Post = () => {
  const [phase, setPhase] = useState(0)

  if (phase == 0) {
    return (
      <div>
        <p>どこどこの試合、あと注意文</p>
        <button
          onClick={() => setPhase(1)}
        >
          つぎ
        </button>
      </div>
    )
  }

  if (phase == 1) {
    return (
      <div>
        <p>入力画面</p>
        <button
          onClick={() => setPhase(2)}
        >
          つぎ
        </button>
      </div>
    )
  }

  if (phase == 2) {
    return (
      <div>
        <p>確認画面、トーナメント表がこうなるよーってやつとか時間あったらいれたい</p>
        <button
          onClick={() => setPhase(3)}
        >
          きろーく
        </button>
      </div>
    )
  }

  if (phase == 3) {
    return (
      <div>
        <p>完了とだけ、あとページ閉じてねメッセージ</p>
      </div>
    )
  }

  return <div>:eyes:</div>
}

export default Post

Post.getLayout = function getLayout(page: ReactNode) {
  return page
}
