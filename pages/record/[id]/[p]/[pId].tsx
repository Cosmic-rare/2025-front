import { APIget, APIpost } from "@/util/api"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { notification } from "antd"
import { CircularProgress, Backdrop } from "@mui/material"
import getClass from "@/util/cl"
import draw from "@/util/draw"
import data1 from "../../../data1.json"
import _ from "lodash"
import { TournamentCellData } from "@/pages/tournament"
import { wl } from "@/util/wl"
import { ModalContent } from '@/components/record/inputs'

function hasInvalidResults(match: any, p: any): boolean {
  const isNumber = (v: number | null | ''): v is number | null =>
    v === null || (typeof v === 'number' && Number.isInteger(v) && v >= 0)

  const getRoundOutcome = (
    u: number | '',
    l: number | '',
    fHitted?: '' | 'l' | 'h'
  ): 'l' | 'h' | 'draw' | 'incomplete' | null => {
    if (!isNumber(u) || !isNumber(l)) return 'incomplete';
    if (u > l) return 'l';
    if (l > u) return 'h';
    if (fHitted === 'l') return 'l';
    if (fHitted === 'h') return 'h';
    if (u == null && l == null) return null;
    return 'draw';
  };

  switch (match.event) {
    case 'volleyball':
    case 'badminton':
    case 'dodgeball': {
      const outcomes = [1, 2, 3].map((i: number) =>
        getRoundOutcome(match[`p_${p}`][`l_p${i}`], match[`p_${p}`][`h_p${i}`], match.event == 'dodgeball' ? match[`p_${p}`].fHitted[`p${i}`] : undefined)
      );

      const upperWins = outcomes.filter((o: any) => o === 'l').length
      const lowerWins = outcomes.filter((o: any) => o === 'h').length
      const draws = outcomes.filter((o: any) => o === 'draw').length
      const incomplete = outcomes.includes('incomplete')

      const someoneWonTwo = upperWins >= 2 || lowerWins >= 2
      const draw2oneDecided = draws === 2 && (upperWins + lowerWins === 1)

      console.log(outcomes)
      console.log(match[`p_${p}`], match.event)

      if (match.event === 'dodgeball') {
        for (let i = 0; i < 3; i++) {
          if (match[`p_${p}`][`l_p${i + 1}`] !== null && match[`p_${p}`][`l_p${i + 1}`] == match[`p_${p}`][`h_p${i + 1}`] && match[`p_${p}`].fHitted[`p${i + 1}`] == null) {
            return true
          }
        }
      }

      return !(someoneWonTwo || draw2oneDecided) || incomplete
    }

    case 'esport': {
      const u = match[`p_${p}`]['l_p1']
      const l = match[`p_${p}`]['h_p1']

      if (!isNumber(u) || !isNumber(l)) return true

      if (u !== l) {
        // 勝敗がついているならOK
        return false
      }

      // 同点の場合、eSport フラグで決着が必要
      const winnerByFlag = match[`p_${p}`].eSport
      return winnerByFlag !== 'l' && winnerByFlag !== 'h'
    }

    case 'soccer': {
      const u = match[`p_${p}`]['l_p1']
      const l = match[`p_${p}`]['h_p1']
      const valid = isNumber(u) && isNumber(l)
      return !valid
    }

    default:
      return true // 未知の競技は不備ありとする
  }
}

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

const Info = ({ isLoading, contextHolder }: any) => {
  return (
    <>
      <div style={{ position: "relative", maxWidth: 330, margin: "auto" }}>
        <Backdrop
          sx={{ color: "#fff", zIndex: 9999 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div style={{ height: 10 }} />
      </div>
      {contextHolder}
    </>
  )
}

type RoundValue = number | ''

const Post = () => {
  const [phase, setPhase] = useState(0)
  const [match, setMatch] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>({
    l: Array(3).fill(''),
    h: Array(3).fill(''),
  });

  const [api, contextHolder] = notification.useNotification()
  const eAPI = (message: string, description = "だめですごめんなさい") => {
    api.error({ message: message, description: description, duration: 6, placement: "bottomRight", className: "custom-notification" })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    if (hasInvalidResults(match, p)) { eAPI('入力に不備あり'); setIsLoading(false); return }
    await APIpost(
      `/match/${id}/${p}/${pId}`,
      { game: match[`p_${p}`] },
      () => { eAPI("記録に失敗") },
      () => { setIsLoading(false) },
      () => { },
      () => { setPhase(3) }
    )
  }

  const router = useRouter()
  const { pId, id, p } = router.query

  const template = _.cloneDeep(data1)

  const [fHitted, setFHitted] = useState<('' | 'l' | 'h')[]>(['', '', '']);
  const updateFHitted = (index: number, value: '' | 'l' | 'h') => {
    const updated = [...fHitted];
    updated[index] = value;
    setFHitted(updated);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!(pId && id && p)) return
      setIsLoading(true)
      const res = await APIget(`match/${id}`, () => { }, () => { setIsLoading(false) })
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

        pMatch[`p_${p}`][lKey] = results.l[round - 1];
        pMatch[`p_${p}`][hKey] = results.h[round - 1];
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
      setResults((prev: any) => ({
        ...prev,
        [group]: prev[group].map((r: any, i: any) =>
          i === roundIndex ? newValue : r
        ),
      }));
    }
  };

  if (phase == 0 && match) {
    return (
      <div>
        {/* @ts-ignore */}
        <h2>{match.sex == "male" ? "男" : match.sex == "female" ? "女" : "混合"} {match.title}, {getClass(match, match.event)[parseInt(p) - 1][0] ?? "未定"} - {getClass(match, match.event)[parseInt(p) - 1][1] ?? "未定"}</h2>
        <p>{new Date(match[`p_${p}`].scheduledAt).toLocaleString('en-us', { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}開始予定</p>
        <p>{match.title}</p>
        <p>{match.sex}</p>
        <p>{match[`p_${2}`].scheduledAt}</p>
        <p>注意文</p>
        <button
          onClick={() => setPhase(1)}
          disabled={match[`p_${p}`].recordedAt}
        >
          つぎ
        </button>

        <Info contextHolder={contextHolder} isLoading={isLoading} />
      </div>
    )
  }

  if (phase == 1) {
    return (
      <div>
        <p>入力画面</p>

        {/* @ts-ignore */}
        <ModalContent setGame={setMatch} game={match} p={parseInt(p)} />

        <button
          onClick={() => setPhase(2)}
        >
          つぎ
        </button>

        <Info contextHolder={contextHolder} isLoading={isLoading} />
      </div>
    )
  }

  if (phase == 2) {
    return (
      <div>
        <p>確認画面、トーナメント表がこうなるよーってやつとか時間あったらいれたい</p>
        <div style={{ width: `${30 * 15 + 10}px`, height: `${320 + 10}px`, overflowY: "hidden", position: "relative" }}>
          {hasInvalidResults(match, p) ?
            <></>
            : <Tournament
              cells={draw(match, template, match.event, true)}
              data={match}
            />
          }

        </div>
        {/* @ts-ignore */}
        {/* どっちがかったのかクライアント処理のやつ追加 */}

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

        <pre>{JSON.stringify(hasInvalidResults(match, p))}</pre>

        <button onClick={handleSubmit}>
          きろーく
        </button>
        <button onClick={() => setPhase(1)}>
          もどる
        </button>

        <Info contextHolder={contextHolder} isLoading={isLoading} />
      </div>
    )
  }

  if (phase == 3) {
    return (
      <div>
        <p>完了とだけ、あとページ閉じてねメッセージ、あ、紙を会室にもってきてってのも載せる</p>

        <Info contextHolder={contextHolder} isLoading={isLoading} />
      </div>
    )
  }

  return <div>:eyes:</div>
}

export default Post

Post.getLayout = function getLayout(page: ReactNode) {
  return page
}
