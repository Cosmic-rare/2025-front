export interface dataType {
  data1: Array<any>
  data2: Array<any>
  data3: Array<any>
}

export interface gameType {
  l_p1: number | null
  h_p1: number | null
  l_p2: number | null
  h_p2: number | null
  l_p3: number | null
  h_p3: number | null
  fHitted: any
  eSport?: string
  soccer?: string
  recordedAt?: number
  recorderId?: string
  applied: boolean
  scheduledAt?: number
  placeId: string
}