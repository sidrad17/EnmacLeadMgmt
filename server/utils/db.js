import mysql from 'mysql'

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "enmacdb",
    port: 3306
})

// con.connect(function(err){
//     if(err)
//         console.log("connection failed")
//     else
//         console.log("connected")

// })

export default con;