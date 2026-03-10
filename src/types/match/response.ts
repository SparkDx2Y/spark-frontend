export interface MatchActionResponse {
  isMatch: boolean;
  matchId?: string;
}

export interface MatchUser {
  _id: string;
  name: string;
  profilePhoto?: string;
}

export interface MatchAction {
  _id: string;
  fromUserId: MatchUser;
  toUserId: MatchUser;
  action: 'like' | 'pass' | 'view';
  createdAt: string;
}

export interface ActivityResponse {
  liked: MatchAction[];
  passed: MatchAction[];
  received: MatchAction[];
  passedBy: MatchAction[];
  viewedYou: MatchAction[];
}
