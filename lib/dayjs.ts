import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import weekOfYear from "dayjs/plugin/weekOfYear"

// Initialize dayjs plugins
dayjs.extend(weekday)
dayjs.extend(weekOfYear)

export default dayjs
