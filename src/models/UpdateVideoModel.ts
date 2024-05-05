export type UpdateVideoModel = {
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