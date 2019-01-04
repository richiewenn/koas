/**
 * Represents one team with no dead members.
 */
export interface Team {
  /** Unique code of this team*/
  code: string
  /**
   * @minimum 1
   * @TJS-type integer
   */
  members: number
}

export interface DeadTeam {
  /** Unique code of this team*/
  code: string
  /**
   * @minimum 1
   * @TJS-type integer
   */
  deadMembers: number
}
