import express from 'express'
import con from '../utils/db.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

/* users */
router.post('/adminlogin', (req, res) => {
    console.log(req.body)
    const sql = "select * from users where email_address = ? and password = ?"
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign({ role: "admin", email: email }, "jwt_secret_key", { expiresIn: '1d' }
            );
            res.cookie('token', token)
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "wrong credentials" });
        }
    })
})

router.get('/users', (req, res) => {
    const sql = "select * from users where email_address !='admin@enmac.com'"
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

/* leads */

router.get('/leads', (req, res) => {
    const sql = "select l.*, u.employee_name from leads l, users u where l.sales_person_id = u.id"
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/lead/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const sql = "select l.*, u.employee_name from leads l, users u where l.sales_person_id = u.id and l.id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.put('/editLead/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.body)
    const sql = `update leads set project_name = ? ,sales_person_id =? , priority=?, customer_name=?, expected_closure_date=?, delivery_date=?, stage=?, source=? where id = ?`
    const values = [req.body.projectName, req.body.salesPersonId, req.body.priority, req.body.customerName, req.body.expectedClosureDate, req.body.deliveryDate, req.body.stage, req.body.source ]
    con.query(sql, [...values, id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        return res.json({ Status: true, Result: result })
    })
})

router.delete('/deleteLead/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const sql = "delete from leads where id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        return res.json({ Status: true, Result: result })
    })
})


router.post('/createLead', (req, res) => {
    console.log(req.body)
    const sql = "INSERT INTO `leads`( `project_name`, `sales_person_id`, `priority`,`customer_name`,`expected_closure_date`,`delivery_date`,`stage`,`source`) VALUES (?)"
    const values = [req.body.projectName, req.body.salesPersonId, req.body.priority, req.body.customerName, req.body.expectedClosureDate, req.body.deliveryDate, req.body.stage, req.body.source ]
    con.query(sql, [values], (err, result) => {
        if (err) { console.log(err.message); return res.json({ Status: false, Error: "Query Error"+err })}
        return res.json({ Status: true, Result: result })
    })
})

/* items */

router.get('/items', (req, res) => {
    const sql = "select * from items"
    con.query(sql, (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.get('/items/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const sql = "select * from items where item_id = ?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

/* lead items */

router.get('/leadItems/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const sql = "select l.*, i.item_name, i.price from lead_items l, items i where l.lead_id = ? and l.item_id = i.item_id"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" })
        return res.json({ Status: true, Result: result })
    })
})

router.delete('/deleteLeadItem/:id/:item_id', (req, res) => {
    const id = req.params.id;
    const item_id = req.params.item_id;

    // First, delete the lead item from the lead_items table
    const sql = "DELETE FROM lead_items WHERE lead_id = ? AND item_id = ?";
    con.query(sql, [id, item_id], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err })
        const sql1 = "update leads l set total_amount = (select sum(li.quantity * i.price) from lead_items li, items i where li.lead_id = ? and li.item_id = i.item_id) where id=?";
        con.query(sql1, [id,id], (err, result) => {
            if (err) return res.json({ Status: false, Error: "Query Error while update" + err });
        });
        return res.json({ Status: true, Result: result })
    })
});

router.post('/upsertLeadItem/:id', (req, res) => {
    const id = req.params.id;
    const leadItems = req.body;

    // Construct the SQL query with ON DUPLICATE KEY UPDATE
    const sql = "INSERT INTO `lead_items` (`item_id`, `quantity`, `lead_id`) VALUES ?";
    const values = leadItems.map(leadItem => [leadItem.item_id, leadItem.quantity, id]);
    const updateSql = "ON DUPLICATE KEY UPDATE `quantity` = VALUES(`quantity`)";
    const query = `${sql} ${updateSql}`;

    const sql1 = "update leads l set total_amount = (select sum(li.quantity * i.price) from lead_items li, items i where li.lead_id = ? and li.item_id = i.item_id) where id=?";

    con.query(query, [values], (err, result) => {
        if (err) return res.json({ Status: false, Error: "Query Error" + err });
        console.log(sql1);
        con.query(sql1, [id,id], (err, result) => {
            if (err) return res.json({ Status: false, Error: "Query Error while update" + err });
        });
        return res.json({ Status: true, Result: result });
    });
});


// router.post('/createLeadItem/:id', (req, res) => {
//     const id = req.params.id;
//     console.log(req.body)
//     const leadItems = req.body; 
//     const sql = "INSERT INTO `lead_items`( `item_id`, `quantity`, `lead_id`) VALUES (?)"
//     leadItems.forEach(leadItem => {
//         const values = [leadItem.item_id, leadItem.quantity, id];
//         con.query(sql, [values], (err, result) => {
//         if (err) return res.json({ Status: false, Error: "Query Error"+err })
//         return res.json({ Status: true, Result: result })
//         })
//     })
// })

export { router as adminRouter }