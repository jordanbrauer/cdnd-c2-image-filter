import fs from 'fs'
import express, { Response, Request } from 'express'
import bodyParser from 'body-parser'
import {filterImageFromURL, deleteLocalFiles} from './util/util'

(async () => {
    const app = express()
    const port = process.env.PORT || 8082

    app.use(bodyParser.json())
    app.get("/", async (request: Request, response: Response): Promise<void> => {
        response.send("try GET /filteredimage?image_url={{}}")
    })
    app.get("/filteredimage", async (request: Request, response: Response): Promise<void> => {
        const url: string = request.query.image_url || ''

        if (url.length <= 0) {
            response.status(422).send({ messages: { image_url: ['This query parameter is required'] }})
        }

        const fqpn = await filterImageFromURL(url)
        const stream = fs.createReadStream(fqpn).once('close', () => {
            stream.destroy()
            deleteLocalFiles([fqpn])
        })

        stream.pipe(response)
    })
    app.listen(port, (): void => {
        console.log(`server running on http://localhost:${port}`)
        console.log(`press CTRL+C to stop server`)
    })
})()