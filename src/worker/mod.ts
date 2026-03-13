/* sw * activation * * * * * * * * * * * * */ 
addEventListener('install', () => {        //
    // @ts-ignore                          //
    self.skipWaiting()                     //
})                                         //
addEventListener('activate', (ev) => {     //
    // @ts-ignore                          //
    ev.waitUntil(self.clients.claim())     //
})                                         //
/* * * * * * * * * * * * * * * * * * * * * */

import setup, { type SetupInput } from "./setup"
import setup_offline from "./offline"
export const MAX_PER_BOTTLE = 6

interface SetupMessage {
    type: 'setup',
    input: SetupInput
}

type Message = SetupMessage

setup_offline()
addEventListener('message', async ev => {
    const data: Message = ev.data
    switch(data.type) {
        case 'setup': 
            // @ts-ignore
            ev.source?.postMessage({
                type: 'setup:output',
                output: await setup(data.input)
            })
            break;
        default:
            break;
    }
})