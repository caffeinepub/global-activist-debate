import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Conversation {
    id: bigint;
    participants: Array<Principal>;
    messages: Array<Message>;
    conversationType: ConversationType;
}
export interface Reply {
    id: bigint;
    parentPostId: bigint;
    content: string;
    author: Principal;
    likes: Array<Principal>;
    timestamp: Time;
}
export type Time = bigint;
export type ReportedContent = {
    __kind__: "post";
    post: bigint;
} | {
    __kind__: "userProfile";
    userProfile: Principal;
} | {
    __kind__: "reply";
    reply: bigint;
};
export interface SocialMediaLinks {
    twitter?: string;
    instagram?: string;
    pinterest?: string;
    facebook?: string;
}
export interface AvatarStyleChoice {
    id: bigint;
    styleType: AvatarStyleType;
}
export interface Report {
    id: bigint;
    status: ReportStatus;
    reportedContent: ReportedContent;
    description: string;
    timestamp: Time;
    reporter: Principal;
    violationType: ViolationType;
}
export interface AvatarCustomization {
    clothing?: AvatarStyleChoice;
    eyewear?: AvatarStyleChoice;
    skinTone: AvatarColorChoice;
    hairType: AvatarStyleChoice;
}
export interface ModerationAction {
    id: bigint;
    moderator: Principal;
    userId: Principal;
    actionType: ModerationType;
    description: string;
    timestamp: Time;
    violationType: ViolationType;
}
export interface AvatarColorChoice {
    colorType: AvatarColorType;
    colorId: bigint;
}
export interface Post {
    id: bigint;
    media?: ExternalBlob;
    content: string;
    section: SectionType;
    author: Principal;
    likes: Array<Principal>;
    pinned: boolean;
    timestamp: Time;
    replies: Array<Reply>;
}
export interface Message {
    id: bigint;
    content: string;
    author: Principal;
    timestamp: Time;
}
export interface UserProfile {
    id: Principal;
    username: string;
    interests: Array<string>;
    socialMedia?: SocialMediaLinks;
    debateStyle: DebateStyle;
    avatar: AvatarCustomization;
}
export enum AvatarColorType {
    skinToneLevel = "skinToneLevel",
    clothingColor = "clothingColor",
    hairColor = "hairColor"
}
export enum AvatarStyleType {
    hat = "hat",
    wig = "wig",
    glasses = "glasses",
    cape = "cape",
    hair = "hair",
    shirt = "shirt",
    beard = "beard"
}
export enum ConversationType {
    group = "group",
    direct = "direct"
}
export enum DebateStyle {
    aggressive = "aggressive",
    creative = "creative",
    civil = "civil",
    random = "random"
}
export enum ModerationType {
    ban = "ban",
    warning = "warning",
    strike = "strike"
}
export enum ReportStatus {
    resolved = "resolved",
    pending = "pending",
    reviewed = "reviewed"
}
export enum SectionType {
    randomDebates = "randomDebates",
    civilDebate = "civilDebate",
    quotesPoems = "quotesPoems",
    aggressiveDebate = "aggressiveDebate"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum ViolationType {
    other = "other",
    spam = "spam",
    harassment = "harassment",
    inappropriateContent = "inappropriateContent"
}
export interface backendInterface {
    addReply(postId: bigint, content: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(content: string, media: ExternalBlob | null, section: SectionType): Promise<void>;
    deletePost(postId: bigint): Promise<void>;
    followTopic(topic: string): Promise<void>;
    followUser(userId: Principal): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConversation(conversationId: bigint): Promise<Conversation | null>;
    getFollowedTopics(): Promise<Array<string>>;
    getFollowing(): Promise<Array<Principal>>;
    getModerationActions(userId: Principal): Promise<Array<ModerationAction>>;
    getMyConversations(): Promise<Array<Conversation>>;
    getPost(postId: bigint): Promise<Post | null>;
    getPosts(): Promise<Array<Post>>;
    getReports(): Promise<Array<Report>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    likePost(postId: bigint): Promise<void>;
    moderateUser(userId: Principal, actionType: ModerationType, violationType: ViolationType, description: string): Promise<void>;
    pinPost(postId: bigint): Promise<void>;
    reportContent(reportedContent: ReportedContent, violationType: ViolationType, description: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(conversationId: bigint, content: string): Promise<void>;
    startConversation(participants: Array<Principal>, convType: ConversationType): Promise<bigint>;
    unfollowTopic(topic: string): Promise<void>;
    unfollowUser(userId: Principal): Promise<void>;
    unlikePost(postId: bigint): Promise<void>;
    unpinPost(postId: bigint): Promise<void>;
    updateReportStatus(reportId: bigint, status: ReportStatus): Promise<void>;
}
