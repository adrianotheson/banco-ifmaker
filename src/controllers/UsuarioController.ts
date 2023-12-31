import { Request, Response } from 'express'
import { criarConexao } from '../database'
import { Usuario } from '../models/Usuario'

async function getUsuarios(req: Request, res: Response) {
    try {
        const connection = await criarConexao()

        const consulta = 'SELECT * FROM usuarios'
        const [resultado] = await connection.query(consulta)

        connection.end()

        res.status(200).json(resultado)
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

async function criarUsuarios(req: Request, res: Response) {
    const { nome, senha, email, cpf, telefone } = req.body

    if (!nome || !senha || !email || !cpf || !telefone) {
        return res.status(400).json({ error: 'data is missing' })
    }

    const usuario: Usuario = {
        nome,
        senha,
        email,
        cpf,
        telefone,
    }

    try {
        const connection = await criarConexao()

        const consulta =
            'INSERT INTO usuarios (nome,senha,email,cpf,telefone) VALUES (?,?,?,?,?)'
        await connection.query(consulta, [
            usuario.nome,
            usuario.senha,
            usuario.email,
            usuario.cpf,
            usuario.telefone,
        ])

        connection.end()

        res.status(201).json({ message: 'User added succesfully!' })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

async function atualizarUsuarios(req: Request, res: Response) {
    const { nome, senha, email, cpf, telefone } = req.body
    const { id } = req.params

    if (!nome && !senha && !email && !cpf && !telefone) {
        return res.status(400).json({ error: 'You must enter a new data' })
    }

    const usuario: Usuario = {
        nome,
        senha,
        email,
        cpf,
        telefone,
    }

    try {
        const connection = await criarConexao()

        const consulta =
            'UPDATE usuarios SET nome = ?, senha = ?, email = ?, cpf = ?, telefone = ? WHERE id = ?'
        await connection.query(consulta, [
            usuario.nome,
            usuario.senha,
            usuario.email,
            usuario.cpf,
            usuario.telefone,
            id,
        ])

        connection.end()

        res.status(200).json({ message: 'User updated succesfully!' })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

async function apagarUsuarios(req: Request, res: Response) {
    const { id } = req.params

    try {
        const connection = await criarConexao()

        const consulta = 'DELETE FROM usuarios WHERE id = ?'

        await connection.query(consulta, [id])

        connection.end()

        res.status(200).json({ message: 'User removed succesfully!' })
    } catch (error) {
        // console.log(error)
        return res.status(500).json({ message: error })
    }
}

export { getUsuarios, criarUsuarios, atualizarUsuarios, apagarUsuarios }
