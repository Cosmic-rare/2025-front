import { APIget, APIpost } from "@/util/api"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { useTokenStore } from "@/util/store"
import { notification } from "antd"
import { ModalContent } from "@/components/record/inputs"
import { CircularProgress, Backdrop, Button } from "@mui/material"
import getClass from "@/util/cl"
import Head from "next/head"
import draw from "@/util/draw"
import data1 from "../../../data1.json"
import _ from "lodash"
import { Modal } from "antd"

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

import { TournamentCellData } from "@/pages/tournament"
import { wl } from "@/util/wl"

const Tournament: React.FC<{ cells: Record<string, TournamentCellData>, data: any }> = ({ cells, data }) => {
  const colors = ["#adb5bd", "#dc3545"]
  const width = 30
  const height = 50

  return (
    <>
      {Object.entries(cells).map(([cell, cellData]) => {
        const cellStyle: React.CSSProperties = {
          position: "absolute",
          top: `${(5 - parseFloat(cell.split("_")[1])) * height}px`,
          left: `${parseFloat(cell.split("_")[0]) * width}px`,
          height: `${height}px`,
          width: `${width}px`,
          paddingRight: cellData.align_left ? "10px" : "0",
          borderTop: cellData.border_top ? `3px solid ${colors[cellData.border_top - 1]}` : "none",
          borderLeft: cellData.border_left ? `3px solid ${colors[cellData.border_left - 1]}` : "none",
          verticalAlign: "bottom",
          display: "flex",
          alignItems: `${cell.split("_")[1] === "0" || cellData.edit !== undefined ? "" : "flex-end"}`,
        }

        return (
          <div key={cell} style={cellStyle}>
            <div className={cellData.class} style={{ fontSize: "0.8em", width: "100%", textAlign: cellData.align_left ? "left" : "center", color: cellData.color ? colors[cellData.color - 1] : "inherit", verticalAlign: "bottom" }}>
              {cellData.text}

              {/* @ts-ignore */}
              {["esport", "soccer"].includes(data.event) ? <span style={{ color: colors[1] }}>{cellData.point >= 0 ? cellData.point : ""}</span> : null}
            </div>
          </div>
        )
      })}
    </>
  )
}

type RoundValue = number | ''

const Post = () => {
  const [phase, setPhase] = useState(0)
  const [match, setMatch] = useState<any>()
  const [results, setResults] = useState<any>({
    upper: Array(3).fill(''),
    lower: Array(3).fill(''),
  });

  const router = useRouter()
  const { pId, id, p } = router.query

  const template = _.cloneDeep(data1)

  useEffect(() => {
    const fetchData = async () => {
      if (!(pId && id && p)) return
      const res = await APIget(`match/${id}`, () => { }, () => { })
      setMatch(res)
    }
    fetchData()
  }, [pId, id, p])

  useEffect(() => {
    if (!match) return
    setMatch((pMatch: any) => {
      for (let round = 1; round <= 3; round++) {
        const lKey = `l_p${round}`;
        const hKey = `h_p${round}`;

        pMatch[`p_${p}`][lKey] = results.upper[round - 1];
        pMatch[`p_${p}`][hKey] = results.lower[round - 1];
      }
      return pMatch
    })
  }, [results])

  const handleChange = (
    group: string,
    roundIndex: number,
    value: string
  ) => {
    const newValue: RoundValue = value === '' ? '' : parseInt(value, 10);

    // @ts-ignore
    if (value === '' || !isNaN(newValue)) {
      // @ts-ignore
      setResults(prev => ({
        ...prev,
        // @ts-ignore
        [group]: prev[group].map((r, i) =>
          i === roundIndex ? newValue : r
        ),
      }));
    }
  };

  if (phase == 0 && match) {
    return (
      <div>
        <p>{match.title}</p>
        <p>{match.sex}</p>
        <p>{match[`p_${2}`].scheduledAt}</p>
        {/* @ts-ignore */}
        <p>{match.match[parseInt(p ? p : "1") - 1][0]}たい{match.match[parseInt(p ? p : "1") - 1][1]}</p>
        <p>注意文</p>
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
        <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '400px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '6px' }}>ラウンド</th>
              <th style={{ border: '1px solid #ccc', padding: '6px' }}>upper</th>
              <th style={{ border: '1px solid #ccc', padding: '6px' }}>lower</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }, (_, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid #ccc', textAlign: 'center' }}>{i + 1}</td>
                <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                  <input
                    type="number"
                    value={results.upper[i]}
                    onChange={(e) => handleChange('upper', i, e.target.value)}
                    style={{ width: '100%' }}
                  />
                </td>
                <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                  <input
                    type="number"
                    value={results.lower[i]}
                    onChange={(e) => handleChange('lower', i, e.target.value)}
                    style={{ width: '100%' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <pre>{JSON.stringify(results, null, 2)}</pre>
        <code>{JSON.stringify(match, null, 2)}</code>
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
        <div style={{ width: `${30 * 15 + 10}px`, height: `${320 + 10}px`, overflowY: "hidden", position: "relative" }}>
          <Tournament
            cells={draw(match, template, match.event, true)}
            data={match}
          />
        </div>
        {/* @ts-ignore */}
        <p>{match.match[parseInt(p ? p : "1") - 1][wl(match[`p_${p}`], match.event, false, true) == 'l' ? 0 : 1]}</p>

        <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '400px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '6px' }}>ラウンド</th>
              <th style={{ border: '1px solid #ccc', padding: '6px' }}>l</th>
              <th style={{ border: '1px solid #ccc', padding: '6px' }}>h</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map(round => {
              const l = match[`p_${p}`][`l_p${round}`]
              const h = match[`p_${p}`][`h_p${round}`]
              return (
                <tr key={round}>
                  <td style={{ border: '1px solid #ccc', textAlign: 'center' }}>{round}</td>
                  <td style={{ border: '1px solid #ccc', textAlign: 'center' }}>{l}</td>
                  <td style={{ border: '1px solid #ccc', textAlign: 'center' }}>{h}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

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
        <p>完了とだけ、あとページ閉じてねメッセージ、あ、紙を会室にもってきてってのも載せる</p>
      </div>
    )
  }

  return <div>:eyes:</div>
}

export default Post

Post.getLayout = function getLayout(page: ReactNode) {
  return page
}
