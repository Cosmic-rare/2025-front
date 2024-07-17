import { Modal } from "antd"
import { Grid } from "@mui/material"
import { places } from "@/pages/schedule/[targetGrade]/[targetClass]"

interface Props {
  isModalOpen: boolean
  setIsModalOpen: Function
  data: any
  event: string
}

const Point = ({ l, h, t }: any) => {
  if (l >= 0 && h >= 0) {
  return (
    <Grid container spacing={2} style={{ justifyContent: "center", textAlign: "center", fontSize: "1.1em" }}>
      <Grid item xs={2}>
        <div>{t}</div>
      </Grid>
      <Grid item xs={4}>
        <div>{l}</div>
      </Grid>
      <Grid item xs={2}>
        <div>-</div>
      </Grid>
      <Grid item xs={4}>
        <div>{h}</div>
      </Grid>
    </Grid>
  )
}else {
  return (
    <Grid container spacing={2} style={{ justifyContent: "center", textAlign: "center", fontSize: "1.1em" }}>
    <Grid item xs={2}>
      <div>{t}</div>
    </Grid>
    <Grid item xs={4}>
      <div></div>
    </Grid>
    <Grid item xs={2}>
      <div>-</div>
    </Grid>
    <Grid item xs={4}>
      <div></div>
    </Grid>
  </Grid>
  )
}
}

const PointModal: React.FC<Props> = ({ isModalOpen, setIsModalOpen, data, event }) => {
  return (
    <Modal
      open={isModalOpen}
      closable={false}
      style={{ maxWidth: 300 }}
      onCancel={() => setIsModalOpen(false)}
      zIndex={9997}
      footer={[]}
    >
      <div style={{ position: "relative" }}>
        {!(data?.endedAt) && !(data?.applied) ?
          <>
            <h4>{data?.startedAt ? "開催中" : "予定"}</h4>
            <p>
              開始時刻: {
              data?.scheduledAt ?
                new Date(data.scheduledAt).toLocaleString('en-us', { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })
                : "-"
            }
            </p>
            <p>
              場所: {/* @ts-ignore */}
              {data?.place ? places[data.place] : "-"}
            </p>
          </>
          :
          <>
            {/* eventで分けながらdata表示 */}
            <h4>得点</h4>
            <Point l={data?.l_p1} h={data?.h_p1} t="1st" />

            {
              !["soccer", "esport"].includes(event) ?
                <>
                  <Point l={data?.l_p2} h={data?.h_p2} t="2nd" />
                  <Point l={data?.l_p3} h={data?.h_p3} t="3rd" />
                </> : null
            }
          </>
        }
      </div>
    </Modal>
  )
}

export default PointModal
