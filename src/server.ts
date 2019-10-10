import fs, { ReadStream } from 'fs'
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
    app.get("/filteredimage", async (request: Request, response: Response): Promise<any> => {
        const reasons: any = { messages: { image_url: new Array }}
        const validation: Array<string> = reasons.messages.image_url // NOTE: easy access
        const source: string = request.query.image_url || ''
        let url: URL

        if (!source.length) {
            validation.push('This query parameter is required')
        } else {
            try {
                url = new URL(source)
            } catch (e) {
                validation.push('The received value is likely a malformed URL')
            }
        }

        if (validation.length) {
            return response.status(422).send(reasons)
        }

        await filterImageFromURL(url)
            .catch((error: string): void => { validation.push(error) })
            .then((stream: ReadStream | any): ReadStream => {
                if (validation.length) throw reasons

                return stream
            })
            .then(
                (stream: ReadStream): void => { stream.pipe(response) }, 
                (errors: Object): void => { response.status(400).send(errors) }
            )
    })
    app.listen(port, (): void => {
        console.log(`server running on http://localhost:${port}`)
        console.log(`press CTRL+C to stop server`)
    })
})()