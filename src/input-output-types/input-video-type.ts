export type InputVideoType = {
    /**
 * videos title, author and availableResolutions
 */
    title: string
    author: string
    availableResolutions: string[] | null
}

export type InputUpdateVideoType = {
    /**
 * videos title, author and availableResolutions
 */
    title: string
    author: string
    availableResolutions: string[] | null
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    publicationDate: string
}