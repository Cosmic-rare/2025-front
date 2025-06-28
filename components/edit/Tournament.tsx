import draw from "@/util/draw"
import _ from "lodash"
import Edit from "@/components/edit.svg"
import cellTemplate from "@/components/data1.json"
import { TournamentCellData } from "@/pages/tournament"
import { jwtDecode } from "jwt-decode"
import InfoIcon from "@mui/icons-material/Info"

const EditTournament: React.FC<{ data: any, onModalOpen: Function, onClassEditModalOpen: Function, token: string, openModal: Function }> = ({ data, onModalOpen, onClassEditModalOpen, token, openModal }) => {
  const colors = ["#adb5bd", "#dc3545"]
  const width = 30
  const height = 50

  const template = _.cloneDeep(cellTemplate)

  const cells: Array<TournamentCellData> = draw(data, template, data.event, false)

  const onEdit = (p: number) => {
    onModalOpen(p)
  }

  const onEdit2 = (p: number, d: number) => {
    onClassEditModalOpen(p, d)
  }

  let roleType: string
  try {
    // @ts-ignore
    roleType = jwtDecode(token).roleType
  } catch (e) { console.log(e) }

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

              { // ADMIN->OK, USER->!(started & ended)ならOK
                cellData.edit !== undefined && (roleType == "ADMIN" || (roleType == "USER" && !(data[`p_${cellData.edit!}`].recordedAt)))
                  ? (
                    <div
                      onClick={() => onEdit(cellData.edit!)}
                      style={{
                        marginTop: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // backgroundColor: data[`p_${cellData.edit!}`]?.applied ? "#e22" : "#fff",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Edit width={20} height={20} stroke={"#bbb"} strokeWidth={2.5} />
                      </div>
                    </div>
                  ) : null}

              {cellData.edit2 !== undefined && "ADMIN" == roleType ? (
                <div>
                  <div
                    onClick={() => onEdit2(cellData.edit2!, cellData.edit2_data!)}
                    style={{
                      marginTop: 10,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <Edit width={20} height={20} stroke={"#bbb"} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              ) : null}

              {cellData.edit !== undefined && (data[`p_${cellData.edit!}`].recordedAt) && (roleType != "ADMIN")
                ? (
                  <div
                    onClick={() => openModal(cellData.edit!)}
                    style={{
                      marginTop: 10,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <InfoIcon width={20} height={20} style={{ color: "#777" }} />
                    </div>
                  </div>
                ) : null}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default EditTournament
