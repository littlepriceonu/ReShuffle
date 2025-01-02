// ! This file is taken from my sveltekit util folder, I use it basically all the time so it should work in this context (i have no idea how vue works lmao)

let loggerIDs: {[id: string]: boolean} = {} 

const loggerIndexMatch: {[index: string | symbol]: boolean} = {
    "warn": true,
    "log": true,
    "error": true,
    "info": true,
}

const ALLOW_SAME_ID = true

// disabled for marketplace release
const ENABLE_LOGGERS = false

// dont need this to clutter the Cider console
// if (ENABLE_LOGGERS) console.log("[logger.ts] Loggers enabled, prepare for the flood of messages.")

export function createLogger(loggerID: string): Console {
    if (loggerIDs[loggerID] && !ALLOW_SAME_ID) throw Error(`Cannot create a logger with an ID that already exists (Attempted ID: '${loggerID}')`)

    if (loggerID.includes("[") || loggerID.includes("]")) throw Error("A logger ID cannot contain any square brackets")

    if (!ALLOW_SAME_ID) {loggerIDs[loggerID] = true}

    return new Proxy(console, {
        get: (target, index) => {
            if (((typeof (target as any)[index]) as string) == "function") {
                if (loggerIndexMatch[index]) {
                    return (sub: any, ...args: any[]) => {
                        if (!ENABLE_LOGGERS) return

                        if (typeof(sub) == "string" && sub.startsWith("(*)")) {
                            (target as any)[index](`[${loggerID}|${sub.split("(*)")[1]}]`, ...args)

                            return;
                        }

                        (target as any)[index](`[${loggerID}]`, sub, ...args)

                    } 
                }

                if (index == "assert") {
                    return (...args: any[]) => {
                        if (!ENABLE_LOGGERS) return

                        // too lazy to add sub ids to this ill do it later

                        (target as any)[index](args.splice(1), `[${loggerID}]`, ...args)
                    }
                }

                return (target as any)[index]
            }

            return (target as any)[index]
        }
    })
}