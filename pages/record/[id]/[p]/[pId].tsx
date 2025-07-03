import { APIget, APIpost } from "@/util/api"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { notification } from "antd"
import { Row, Col } from "antd"
import { CircularProgress, Backdrop, Card, Button } from "@mui/material"
import getClass from "@/util/cl"
import draw from "@/util/draw"
import data1 from "../../../data1.json"
import _ from "lodash"
import { TournamentCellData } from "@/pages/tournament"
import { winL, wl } from "@/util/wl"
import { PointInputs, FlagInputs } from '@/components/record/inputs'
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';
import Head from "next/head"

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

      if (!isNumber(u) || !isNumber(l)) return true

      if (u !== l) {
        // 勝敗がついているならOK
        return false
      }

      // 同点の場合、pk フラグで決着が必要
      const winnerByFlag = match[`p_${p}`].pk
      return winnerByFlag !== 'l' && winnerByFlag !== 'h'
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
      <Head><title>結果記録</title></Head>

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

const width = {
  xs: 0.9, sm: 350, md: 450, lg: 450, xl: 450,
}

const Post = () => {
  const [phase, setPhase] = useState(0)
  const [match, setMatch] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    const fetchData = async () => {
      if (!(pId && id && p)) return
      setIsLoading(true)
      const res = await APIget(`match/${id}`, () => { }, () => { setIsLoading(false) })
      setMatch(res)
    }
    fetchData()
  }, [pId, id, p])

  if (phase == 0 && match) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>試合結果入力</h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <Card
            sx={{ width: width }}
            style={{ backgroundColor: "#f4f4f5", borderRadius: 9, padding: 24 }}
          >
            {/* @ts-ignore */}
            <h3>{match.gread}年, {match.title}, {getClass(match, match.event)[parseInt(p) - 1][0] ?? "未定"}組 対 {getClass(match, match.event)[parseInt(p) - 1][1] ?? "未定"}組</h3>
            <p>{new Date(match[`p_${p}`].scheduledAt).toLocaleString('en-us', { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}開始予定</p>

            <h4>記録用紙に記名した生徒会関係者が入力してください</h4>
          </Card>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <Button
            onClick={() => setPhase(1)}
            disabled={match[`p_${p}`].recordedAt}
            color="warning"
            variant="contained"
          >
            {match[`p_${p}`].recordedAt ? '入力済み' : '入力画面へ進む'}
          </Button>
        </div>

        <Info contextHolder={contextHolder} isLoading={isLoading} />
      </div>
    )
  }

  if (phase == 1) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>入力画面</h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <Card
            sx={{ width: width }}
            style={{ backgroundColor: "#f4f4f5", borderRadius: 9, padding: 24 }}
          >

            <Row justify="center" gutter={12} wrap={false}>
              <Col span={3} />
              <Col span={3.5}>
                <div style={{ textAlign: "center" }}>
                  <h2>
                    {/* @ts-ignore */}
                    {getClass(match, match.event)[parseInt(p) - 1][0] ?? "未定"}組
                  </h2>
                </div>
              </Col>
              <Col span={2}>
                <div style={{ textAlign: "center" }}>
                  <span style={{ marginTop: "22px", display: "inline-block" }}>対</span>
                </div>
              </Col>
              <Col span={3.5}>
                <div style={{ textAlign: "center" }}>
                  <h2>
                    {/* @ts-ignore */}
                    {getClass(match, match.event)[parseInt(p) - 1][1] ?? "未定"}組
                  </h2>
                </div>
              </Col>
              <Col span={4} />
            </Row>

            {/* @ts-ignore */}
            <PointInputs setGame={setMatch} game={match} p={parseInt(p)} />

            {/* @ts-ignore */}
            <FlagInputs setGame={setMatch} game={match} p={parseInt(p)} />
          </Card>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <Button
              onClick={() => setPhase(0)}
              color="success"
              variant="contained"
            >
              戻る
            </Button>
          </div>

          <div style={{ width: 20 }} />

          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <Button
              onClick={() => setPhase(2)}
              color="warning"
              variant="contained"
            >
              確認画面に進む
            </Button>
          </div>
        </div>

        <Info contextHolder={contextHolder} isLoading={isLoading} />
      </div>
    )
  }

  if (phase == 2) {
    const roundCount = ['volleyball', 'badminton', 'dodgeball'].includes(match.event) ? 3
      : ['esport', 'soccer'].includes(match.event) ? 1 : 0
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>確認画面</h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <Card
            sx={{ width: width }}
            style={{ backgroundColor: "#f4f4f5", borderRadius: 9, padding: 24 }}
          >
            <h3>入力データの確認</h3>
            <TableContainer component={Paper} sx={{ margin: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ラウンド</TableCell>
                    <TableCell align="center">l</TableCell>
                    <TableCell align="center">h</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: roundCount }, (_, i) => i).map(i => {
                    const roundKey = roundCount === 1 ? 0 : i + 1;
                    const l = match[`p_${p}`][`l_p${roundKey}`];
                    const h = match[`p_${p}`][`h_p${roundKey}`];

                    // 各種フラグ取得
                    const isDodgeball = match.event === 'dodgeball';
                    const isEsport = match.event === 'esport';
                    const isSoccer = match.event === 'soccer';

                    const fHitted = isDodgeball ? match[`p_${p}`]?.fHitted?.[`p${i + 1}`] : '';
                    const eSport = isEsport ? match[`p_${p}`]?.eSport : '';
                    const pk = isSoccer ? match[`p_${p}`]?.soccer : '';

                    // フラグが 'l' / 'h' のとき常に強調表示
                    const highlightL =
                      (isEsport && eSport === 'l') ||
                      (isDodgeball && fHitted === 'l') ||
                      (isSoccer && pk === 'l');

                    const highlightH =
                      (isEsport && eSport === 'h') ||
                      (isDodgeball && fHitted === 'h') ||
                      (isSoccer && pk === 'h');

                    return (
                      <TableRow key={i}>
                        <TableCell align="center">{roundKey}</TableCell>
                        <TableCell align="center" sx={highlightL ? { color: 'red', fontWeight: 'bold' } : {}}>{l ?? '-'}</TableCell>
                        <TableCell align="center" sx={highlightH ? { color: 'red', fontWeight: 'bold' } : {}}>{h ?? '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <p>PK,先当て,最高得点者が赤字になっています</p>
          </Card>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <Card
            sx={{ width: width }}
            style={{ backgroundColor: "#f4f4f5", borderRadius: 9, padding: 24 }}
          >
            {/* @ts-ignore */}
            <h3>{getClass(match, match.event)[parseInt(p) - 1][winL(match[`p_${p}`], match.event, false, true) ? 0 : 1]}組勝利</h3>
            <p>反映後トーナメント表</p>
            <div style={{ width: `${30 * 15 + 0}px`, height: `${320 + 10}px`, overflowY: "scroll", position: "relative" }}>
              {hasInvalidResults(match, p) ?
                <h3>入力データに不備あり</h3>
                : <Tournament
                  cells={draw(match, template, match.event, true)}
                  data={match}
                />
              }
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <Button
              onClick={() => setPhase(1)}
              color="success"
              variant="contained"
            >
              戻る
            </Button>
          </div>

          <div style={{ width: 20 }} />

          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <Button
              onClick={handleSubmit}
              color="warning"
              variant="contained"
            >
              記録する
            </Button>
          </div>
        </div>

        <Info contextHolder={contextHolder} isLoading={isLoading} />
      </div>
    )
  }

  if (phase == 3) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>保存完了</h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <p>記録用紙を生徒会室に持ってきてください</p>
        </div>

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
