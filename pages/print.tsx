import { ReactNode, useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import getClass from "@/util/cl"
import { TournamentCellData } from "@/pages/tournament"
import draw from "@/util/draw"
import data1 from "./data1.json"
import _ from "lodash"

const resize = () => {
  const width = window.innerWidth
  const height = Math.round(width * 1.41421)
  const height25 = height / 4
  const height50 = height - 2 * height25
  return { height: height, width: width, height25: height25, height50: height50 }
}

const BASE_URL = 'http://localhost:3000'

const Tournament: React.FC<{ cells: Record<string, TournamentCellData>, data: any, place: number }> = ({ cells, data, place }) => {
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

              {cellData.edit == place ? <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'red', marginLeft: 6.4, marginTop: 6 }} /> : null}
            </div>
          </div>
        )
      })}
    </>
  )
}

const RecordTable = ({ match }: any) => {
  switch (match.event) {
    case 'volleyball':
    case 'badminton':
      return (
        <>
          table3
        </>
      )
    case 'soccer':
      return (
        <>
          table1, pk-flag1
        </>
      )
    case 'dodgeball':
      return (
        <>
          table3, fhitted-flag3
        </>
      )
    case 'esport':
      return (
        <>
          table1, flag1
        </>
      )
    default:
      return (<></>)
  }
}

const Print = () => {
  const [innerSize, setInnerSize] = useState({ height: 0, width: 0, height25: 0, height50: 0 })
  const handleResize = () => {
    setInnerSize(resize())
  }

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)
  }, [])

  const template = _.cloneDeep(data1)

  const datas = [
    {
      "id": "cmcfvk60p002507rot2tkxam5",
      "title": "女バドミントン",
      "gread": 3,
      "sex": "female",
      "order": 1,
      "event": "badminton",
      "c_1": 4,
      "c_2": 3,
      "c_3": 7,
      "c_4": 1,
      "c_5": 6,
      "c_6": 5,
      "c_7": 2,
      "p_1": {
        "l_p1": null,
        "h_p1": null,
        "l_p2": null,
        "h_p2": null,
        "l_p3": null,
        "h_p3": null,
        "fHitted": {
          "p1": null,
          "p2": null,
          "p3": null
        },
        "eSport": null,
        "soccer": null,
        "place": "a2",
        "placeId": "cmcfvk60p002607ro0796u34g",
        "scheduledAt": 1752711600000,
        "recordedAt": null,
        "applied": true
      },
      "p_2": {
        "l_p1": null,
        "h_p1": null,
        "l_p2": null,
        "h_p2": null,
        "l_p3": null,
        "h_p3": null,
        "fHitted": {
          "p1": null,
          "p2": null,
          "p3": null
        },
        "eSport": null,
        "soccer": null,
        "place": "a2",
        "placeId": "cmcfvk60p002707roldm89qrl",
        "scheduledAt": 1752630600000,
        "recordedAt": null,
        "applied": true
      },
      "p_3": {
        "l_p1": null,
        "h_p1": null,
        "l_p2": null,
        "h_p2": null,
        "l_p3": null,
        "h_p3": null,
        "fHitted": {
          "p1": null,
          "p2": null,
          "p3": null
        },
        "eSport": null,
        "soccer": null,
        "place": "a2",
        "placeId": "cmcfvk60p002807rok403qyf5",
        "scheduledAt": 1752709200000,
        "recordedAt": null,
        "applied": true
      },
      "p_4": {
        "l_p1": null,
        "h_p1": null,
        "l_p2": null,
        "h_p2": null,
        "l_p3": null,
        "h_p3": null,
        "fHitted": {
          "p1": null,
          "p2": null,
          "p3": null
        },
        "eSport": null,
        "soccer": null,
        "place": "c2",
        "placeId": "cmcfvk60p002907ro0zivxe0a",
        "scheduledAt": 1752716400000,
        "recordedAt": null,
        "applied": true
      },
      "p_5": {
        "l_p1": null,
        "h_p1": null,
        "l_p2": null,
        "h_p2": null,
        "l_p3": null,
        "h_p3": null,
        "fHitted": {
          "p1": null,
          "p2": null,
          "p3": null
        },
        "eSport": null,
        "soccer": null,
        "place": "d2",
        "placeId": "cmcfvk60p002a07rorkpzucbl",
        "scheduledAt": 1752716400000,
        "recordedAt": null,
        "applied": true
      },
      "p_6": {
        "l_p1": null,
        "h_p1": null,
        "l_p2": null,
        "h_p2": null,
        "l_p3": null,
        "h_p3": null,
        "fHitted": {
          "p1": null,
          "p2": null,
          "p3": null
        },
        "eSport": null,
        "soccer": null,
        "place": "b2",
        "placeId": "cmcfvk60p002b07rostpsss8o",
        "scheduledAt": 1752723600000,
        "recordedAt": null,
        "applied": true
      }
    }
  ]

  return (
    <div>
      {datas.map((v, i) => {
        return (
          <>
            {
              [...Array(6)].map((_, j) => {
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
                      <div style={{ width: '45%', paddingTop: '5%', paddingRight: '0%' }}>
                        <h3>注意事項・指示(バド、バレー)</h3>
                        <p>生徒会役員から記録用紙を受け取ったら下の試合についての情報を確認し、記録者の欄に記名し、初戦以外では表の試合に該当するクラスに丸をつけてください。表の通りに結果を書き込み、試合が終了したら生徒会役員に返却してください。</p>
                        <h5>他種目は事前の指示通り</h5>

                        {/* @ts-ignore */}
                        <h3>{v.gread}年, {v.title}, {getClass(v, v.event)[j][0] ?? "未定"}組 対 {getClass(v, v.event)[j][1] ?? "未定"}組</h3>
                        {/* @ts-ignore */}
                        <p>{new Date(v[`p_${j + 1}`].scheduledAt).toLocaleString('en-us', { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })}開始予定</p>

                        <div style={{ width: `${30 * 15 + 0}px`, height: `${320 + 10}px`, overflowY: "scroll", position: "relative" }}>
                          <Tournament
                            cells={draw(v, template, v.event, true)}
                            data={v}
                            place={j + 1}
                          />
                        </div>
                      </div>
                      <div style={{ width: '35%', marginLeft: '3%', paddingTop: '5%' }}>
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

                        <div>
                          <RecordTable match={v} />
                        </div>
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

Print.getLayout = function getLayout(page: ReactNode) {
  return page
}
