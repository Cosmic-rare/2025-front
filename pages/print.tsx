import { ReactNode, useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import getClass, { getClass2 } from "@/util/cl"
import { TournamentCellData } from "@/pages/tournament"
import draw from "@/util/draw"
import { useTokenStore } from "@/util/store"
import dynamic from "next/dynamic"
import data1 from "./data1.json"
import _ from "lodash"
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  SxProps,
  Theme,
} from '@mui/material'
import { APIget } from "@/util/api"

const resize = () => {
  const width = window.innerWidth
  const height = Math.round(width * 1.41421)
  const height25 = height / 4
  const height50 = height - 2 * height25
  return { height: height, width: width, height25: height25, height50: height50 }
}

/* 横線だけの共通スタイル ------------------------------------ */
const hBorder: SxProps<Theme> = {
  borderLeft: 0,
  borderRight: 0,
  borderTop: 0,
  borderBottom: '1px solid',
  borderColor: 'common.black',
};

/* ヘッダー行（下線 2px） */
const headerCell: SxProps<Theme> = {
  ...hBorder,
  borderBottomWidth: 2,
  fontWeight: 'bold',
};

/* 小さめ薄め文字 */
const fadedText: SxProps<Theme> = {
  fontSize: '0.75rem',
  color: 'text.secondary',
  textAlign: 'center',
};

const BASE_URL = 'https://dev.spotai.info'

const Tournament: React.FC<{ cells: Record<string, TournamentCellData>, data: any, place: number }> = ({ cells, data, place }) => {
  const colors = ["#adb5bd", "#adb5bd"]
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

              {cellData.edit == place ? <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'red', marginLeft: 6.4, marginTop: 6 }} /> : null}
            </div>
          </div>
        )
      })}
    </>
  )
}

/* ①② ラウンド表 ------------------------------------------------ */
interface RoundTableProps {
  rounds: number[];
  l: string;          // 左側ヘッダ（デフォルト A組）
  h: string;          // 右側ヘッダ（デフォルト B組）
}
const RoundTable: React.FC<RoundTableProps> = ({
  rounds, l, h
}) => (
  <Box mb={6}>
    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ ...headerCell, width: '30%', textAlign: 'center' }}>
            ラウンド
          </TableCell>
          <TableCell sx={{ ...headerCell, width: '35%', textAlign: 'center' }}>
            {l}組
          </TableCell>
          <TableCell sx={{ ...headerCell, textAlign: 'center' }}>{h}組</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rounds.map((r) => (
          <TableRow key={r}>
            <TableCell sx={{ ...hBorder, textAlign: 'center' }}>{r}</TableCell>
            <TableCell sx={hBorder} />
            <TableCell sx={hBorder} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
);

/* ③ ラウンド + ヘッダー + l/h ---------------------------------- */
interface RoundGroupTableProps {
  headerText: string;
  rows: number[];
  l: string;          // 左側（デフォルト あ組）
  h: string;          // 右側（デフォルト い組）
}
const RoundGroupTable: React.FC<RoundGroupTableProps> = ({
  headerText,
  rows,
  l,
  h
}) => (
  <Box mb={6}>
    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ ...headerCell, width: '30%', textAlign: 'center' }}>
            ラウンド
          </TableCell>
          <TableCell
            sx={{ ...headerCell, textAlign: 'center' }}
            colSpan={2}
          >
            {headerText}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r}>
            <TableCell
              sx={{ ...hBorder, width: '30%', textAlign: 'center' }}
            >
              {r}
            </TableCell>
            <TableCell
              sx={{ ...hBorder, ...fadedText, width: '35%', textAlign: 'center' }}
            >
              {l}組
            </TableCell>
            <TableCell sx={{ ...hBorder, ...fadedText, textAlign: 'center' }}>
              {h}組
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
);

/* ④ テキスト + 選択肢（l / 該当無し / h） ----------------------- */
interface SelectGroupSplitTableProps {
  text: string;
  l: string;          // 左側（デフォルト あ組）
  h: string;          // 右側（デフォルト い組）
}
const SelectGroupSplitTable: React.FC<SelectGroupSplitTableProps> = ({
  text,
  l,
  h
}) => (
  <Box mb={6}>
    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
      <TableBody>
        {/* 上段：見出し */}
        <TableRow>
          <TableCell
            colSpan={3}
            sx={{
              borderBottom: '2px solid',
              borderColor: 'common.black',
              verticalAlign: 'middle',
              fontWeight: 'bold',
              height: 40,
            }}
          >
            {text}
          </TableCell>
        </TableRow>

        {/* 下段：選択肢 */}
        <TableRow>
          {[l + '組', '該当無し', h + '組'].map((label) => (
            <TableCell
              key={label}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'common.black',
                textAlign: 'center',
                verticalAlign: 'middle',
                fontSize: '0.75rem',
                color: 'text.secondary',
                height: 32,
              }}
            >
              {label}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  </Box>
);


const Tables = ({ match, p }: any) => {
  const l = getClass(match, match.event)[p][0] ?? getClass2(match)[p][0].join(' , ') + ' '
  const h = getClass(match, match.event)[p][1] ?? getClass2(match)[p][1].join(' , ') + ' '

  switch (match.event) {
    case 'volleyball':
    case 'badminton':
      return (
        <>
          <RoundTable rounds={[1, 2, 3]} l={l} h={h} />
        </>
      )
    case 'soccer':
      return (
        <>
          <RoundTable rounds={[1]} l={l} h={h} />
          <SelectGroupSplitTable text="同点時のPK" l={l} h={h} />
        </>
      )
    case 'dodgeball':
      return (
        <>
          <RoundTable rounds={[1, 2, 3]} l={l} h={h} />
          <RoundGroupTable
            headerText="先に当てた組"
            rows={[1, 2, 3]}
            l={l} h={h}
          />
        </>
      )
    case 'esport':
      return (
        <>
          <RoundTable rounds={[1]} l={l} h={h} />
          <SelectGroupSplitTable text="最高得点者の組" l={l} h={h} />
        </>
      )
    default:
      return (<></>)
  }
}

export async function getStaticProps() {
  const res = await APIget(`get/seet`, () => { }, () => { })
  
  return {
    props: {
      datas: res.data
    },
    revalidate: 10
  };
}

const Print = ({ datas }: any) => {
  const [innerSize, setInnerSize] = useState({ height: 0, width: 0, height25: 0, height50: 0 })
  const handleResize = () => {
    setInnerSize(resize())
  }

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)
  }, [])

  return (
    <div>
      {/* @ts-ignore */}
      {datas.map((v, i) => {
        return (
          <>
            {
              [...Array(6)].map((a, j) => {
                return (
                  <>
                    <div style={{ width: innerSize.width, height: innerSize.height25, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <div style={{ width: '60%', paddingLeft: "5%", marginTop: "5%" }}>
                        <h3>入力者氏名(学籍番号)</h3>
                        <div style={{
                          width: "60%",
                          height: "50px",
                          border: "2px solid black",
                          display: "flex",
                          alignItems: "center",
                          padding: "0 10px",
                          fontSize: "16px"
                        }}>
                          <div style={{ flexGrow: 1, height: "20px" }}></div>
                          <span style={{ margin: "0 6px" }}>(</span>
                          <div style={{ width: "80px", height: "20px" }}></div>
                          <span>)</span>
                        </div>
                        <p>試合終了後すぐにQRコードを読み取り入力し、自身又は相方のシフト終了時に記録用紙を生徒会室に持ってきてください</p>
                        <p>一度入力するど再入力、上書きなどができない仕様です。入力ミスがあった場合にはDiscordなどで伝えてください。修正するか入力できるようにします。</p>
                        <p>不明なことがあった場合もDiscordなどで伝えてください</p>
                      </div>
                      <div style={{ width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingRight: "5%" }}>
                        <div>
                          <QRCodeSVG
                            // @ts-ignore
                            value={`${BASE_URL}/${v.id}/${j + 1}/${v[`p_${j + 1}`].placeId}`}
                            size={128 + 64}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"H"}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ width: innerSize.width, height: innerSize.height25, borderTop: "1px black dashed", borderBottom: '1px dashed black', boxSizing: 'border-box' }}></div>

                    <div style={{ width: innerSize.width, height: innerSize.height50, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                      <div style={{ width: '10%', writingMode: 'vertical-lr', paddingLeft: '5%', paddingTop: '15%' }}>
                        生徒会役員以外ホチキス開封禁止
                      </div>
                      <div style={{ width: '45%', paddingTop: '3%', paddingRight: '0%' }}>
                        <h3>注意事項・指示(バド、バレー)</h3>
                        <p>生徒会役員から記録用紙を受け取ったら下の試合についての情報を確認し、記録者の欄に記名し、初戦以外では表の試合に該当するクラスに丸をつけてください。表の通りに結果を書き込み、最終的に勝利したクラスを書き、試合が終了したら生徒会役員に返却してください。</p>
                        <p>不明なことがあった場合、生徒会役員に質問してください</p>
                        <h5>他種目は事前の指示通り</h5>

                        {/* @ts-ignore */}
                        <h3>{v.gread}年, {v.title}, {getClass(v, v.event)[j][0] ?? getClass2(v)[j][0].join(',')}組 対 {getClass(v, v.event)[j][1] ?? getClass2(v)[j][1].join(',')}組</h3>
                        {/* @ts-ignore */}
                        <p>{new Date(v[`p_${j + 1}`].scheduledAt).toLocaleString('en-us', { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}開始予定</p>

                        <div style={{ width: `${30 * 15 + 0}px`, height: `${320 + 10}px`, overflowY: "scroll", position: "relative" }}>
                          <Tournament
                            // @ts-ignore
                            cells={draw(v, _.cloneDeep(data1), v.event, true)}
                            data={v}
                            place={j + 1}
                          />
                        </div>
                      </div>
                      <div style={{ width: '35%', marginLeft: '3%', paddingTop: '3%' }}>
                        <h3>記録者氏名(学籍番号)</h3>
                        <div style={{
                          width: "90%",
                          height: "50px",
                          border: "2px solid black",
                          display: "flex",
                          alignItems: "center",
                          padding: "0 10px",
                          fontSize: "16px"
                        }}>
                          <div style={{ flexGrow: 1, height: "20px" }}></div>
                          <span style={{ margin: "0 6px" }}>(</span>
                          <div style={{ width: "80px", height: "20px" }}></div>
                          <span>)</span>
                        </div>

                        <div style={{ width: '90%', marginTop: '5%' }}>
                          <Tables match={v} p={j} />
                        </div>

                        <h3>勝利クラス:&emsp;&emsp;&emsp;&emsp;組</h3>
                      </div>
                      <div style={{ width: '10%', writingMode: 'vertical-lr', paddingRight: '5%', paddingTop: '15%' }}>
                        生徒会役員以外ホチキス開封禁止
                      </div>
                    </div>
                  </>
                )
              })
            }
          </>
        )
      })}
    </div>
  )

}

export default Print