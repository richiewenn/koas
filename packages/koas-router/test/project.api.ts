/**
 * Represents one team with no dead members.
 */
interface Project {
  /** Unique code of this team*/
  code: string
  /**
   * @minimum 1
   * @TJS-type integer
   */
  members: number
}
