const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3990


// ------------ data ----------------------------------------------------------

var data = {
    employee: {
        name: "John Smith",
        ID: 99999,
        location: "UK",
        project: "program",
        availableLeave: 7.5,
        entitledLeave: 20
    },
    leaveRequests: [
        {
            ID: 0,
            employeeID: 99999,
            type: "BUUUKHolidayLeave",
            fromDate: new Date(Date.now()),
            toDate: new Date(Date.now()),
            reason: "No reason",
            approver: "",
            status: "Approved",
            length: .5,
            contact: "...",
            dayPeriod: "PM"
        },
        {
            ID: 1,
            employeeID: 99999,
            type: "BUUUKHolidayLeave",
            fromDate: new Date(new Date("2018-11-01")),
            toDate: new Date(new Date("2018-11-05")),
            reason: "No reason",
            approver: "",
            status: "Rejected",
            length: 5,
            contact: "..."
        }
    ]
}

// ------------ Helper functions ----------------------------------------------

const statusCodes = [
    "Pending", "Approved", "Rejected", "Pending Cancelation", "Cancelled"]


function updateStatus(id) {
    let msg = ""
    if (data.leaveRequests[id].status == "Pending") {
        data.leaveRequests[id].status = "Cancelled"
        msg = `Cancelled leave request ${id}`
        data.employee.availableLeave += data.leaveRequests[id].length
    }
    else {
        data.leaveRequests[id].status = "Pending Cancelation"
        msg = `Submitted leave request ${id} for cancelation`
    }
    return msg
}

// ------------ http methods --------------------------------------------------

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// these headers are here to play nice with angular.
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    next()
})

app.get('/employee/', (req, res) => {
    console.log(`Fetching ${data.employee.ID} employee`)
    res.send(data.employee)
})

app.get('/list/', (req, res) => {
    console.log(`Fetching ${data.leaveRequests.length} leave requests`)
    res.send(data.leaveRequests)
})

app.post('/register/', (req, res) => {
    let newRequest = req.body
    newRequest.ID = data.leaveRequests.length
    data.leaveRequests.push(newRequest)
    data.employee.availableLeave -= newRequest.length
    res.send({ displayMessage: "Added data:" + JSON.stringify(newRequest) })
})

app.put('/cancel/:i', (req, res) => {
    const id = req.params.i
    let msg = ""
    if (0 <= id && id < data.leaveRequests.length) {
        msg = updateStatus(id)
    }
    else {
        msg = `ERROR: Invalid leave request ID`
    }
    console.log(msg)
    res.send({ displayMessage: msg })
})

// listen: host the APU on a specified port
app.listen(port, () => console.log(
    `Leave Request Application listening on port: ${port}!`))