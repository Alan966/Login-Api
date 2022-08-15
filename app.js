const express = require("express")
const cors = require("cors");
const jwt = require("jsonwebtoken")

const app = express();
app.use(express.json());
app.use(cors());

const TOKEN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYyMzdkMTcyMzRmYjc0ZDBiNDRjYmE2NiIsImVtYWlsIjoiam9zZXBlcmV6QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJC93REcxbUEvc3lEb0tuWHVPVjFDdWVVajJ0UlAyZWFEQkpOTnNnL1EuanR2Q3U0VjhPdmwyIiwiX192IjowfSwiaWF0IjoxNjQ3ODI1Mjc3fQ.RzjFOZNdfmltpOh43JwdbhZ4-krVdU6CH42d6EiZ25w"

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(authHeader);
    if(token == null)
        return res.status(401).send('Token requerido');
    jwt.verify(token, TOKEN_KEY, (err, user) => {
        if(err) return res.status(403).send("Token invalido");
        req.user = user;
        next();
    })
}



app.post("/usuarios/login", (req, res) => {
    const usuario = req.body.usuario;
    const clave = req.body.clave;
    if( usuario == "fmendoza" && clave == "123456"){
        const datos = {
            id: "123",
            nombre: "Felipe Mendoza",
            email: "fmendoza@gmail.com",
            codigo: "ABDE456-LK"
        };
        const token = jwt.sign(
            {
            userId: datos.id,
            email: datos.email,
            },
            TOKEN_KEY,
            {expiresIn: "2h"}
        )
        let nDatos = {... datos, token};
        res.status(200).json(nDatos);
    }else{
        res.status(400).send("Credenciales incorrectas")
    }
});

// Agregar una verificacion del token en el listado

app.get("/usuario/:id/ventas", verifyToken ,  (req, res) => {
    const datos = [
        {id: 1,
        cliente: "Empresa A",
        total: 2500,
        fecha: "2022-01-15"
        },
        {id: 2,
            cliente: "Empresa B",
            total: 200,
            fecha: "2022-01-25"
        },
        {id: 3,
            cliente: "Empresa C",
            total: 35000,
            fecha: "2022-01-23"
        }
    ];
    res.json(datos);
});

app.listen(3001, () => {
    console.log("server is running on port 3001");
})