import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Init authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Storage system
  include MixinStorage();

  // Data Types
  type UserProfile = {
    id : Principal;
    username : Text;
    avatar : AvatarCustomization;
    interests : [Text];
    debateStyle : DebateStyle;
    socialMedia : ?SocialMediaLinks;
  };

  type AvatarCustomization = {
    skinTone : AvatarColorChoice;
    hairType : AvatarStyleChoice;
    eyewear : ?AvatarStyleChoice;
    clothing : ?AvatarStyleChoice;
  };

  type AvatarStyleChoice = {
    id : Nat;
    styleType : AvatarStyleType;
  };

  type AvatarStyleType = {
    #hair;
    #beard;
    #wig;
    #hat;
    #glasses;
    #shirt;
    #cape;
    // Add more as needed
  };

  type AvatarColorChoice = {
    colorId : Nat;
    colorType : AvatarColorType;
  };

  type AvatarColorType = {
    #skinToneLevel;
    #hairColor;
    #clothingColor;
    // Add more as needed
  };

  type Post = {
    id : Nat;
    author : Principal;
    content : Text;
    media : ?Storage.ExternalBlob;
    timestamp : Time.Time;
    section : SectionType;
    pinned : Bool;
    replies : [Reply];
    likes : [Principal];
  };

  type Reply = {
    id : Nat;
    parentPostId : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
    likes : [Principal];
  };

  type Conversation = {
    id : Nat;
    participants : [Principal];
    messages : [Message];
    conversationType : ConversationType;
  };

  type Message = {
    id : Nat;
    author : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type Report = {
    id : Nat;
    reporter : Principal;
    reportedContent : ReportedContent;
    violationType : ViolationType;
    description : Text;
    status : ReportStatus;
    timestamp : Time.Time;
  };

  type ModerationAction = {
    id : Nat;
    userId : Principal;
    actionType : ModerationType;
    violationType : ViolationType;
    description : Text;
    timestamp : Time.Time;
    moderator : Principal;
  };

  type DebateStyle = { #civil; #aggressive; #creative; #random };

  type SectionType = {
    #civilDebate;
    #aggressiveDebate;
    #quotesPoems;
    #randomDebates;
  };

  type ConversationType = { #direct; #group };

  type SocialMediaLinks = {
    facebook : ?Text;
    twitter : ?Text;
    instagram : ?Text;
    pinterest : ?Text;
  };

  type ReportedContent = {
    #post : Nat;
    #reply : Nat;
    #userProfile : Principal;
  };

  type ViolationType = {
    #spam; #harassment; #inappropriateContent; #other;
  };

  type ReportStatus = {
    #pending;
    #reviewed;
    #resolved;
  };

  type ModerationType = {
    #warning;
    #strike;
    #ban;
  };

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let posts = Map.empty<Nat, Post>();
  let conversations = Map.empty<Nat, Conversation>();
  let reports = Map.empty<Nat, Report>();
  let moderationActions = Map.empty<Nat, ModerationAction>();
  let follows = Map.empty<Principal, [Principal]>();
  let topicFollows = Map.empty<Principal, [Text]>();
  var nextPostId = 0;
  var nextConversationId = 0;
  var nextReportId = 0;
  var nextModerationId = 0;

  // Profile Management
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Allow viewing any user's profile (public profiles)
    userProfiles.get(user);
  };

  // Posts
  public shared ({ caller }) func createPost(content : Text, media : ?Storage.ExternalBlob, section : SectionType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    let post : Post = {
      id = nextPostId;
      author = caller;
      content;
      media;
      timestamp = Time.now();
      section;
      pinned = false;
      replies = [];
      likes = [];
    };
    posts.add(nextPostId, post);
    nextPostId += 1;
  };

  public query func getPost(postId : Nat) : async ?Post {
    // Anyone can view posts (including guests)
    posts.get(postId);
  };

  public query func getPosts() : async [Post] {
    // Anyone can view posts (including guests)
    posts.values().toArray();
  };

  public shared ({ caller }) func pinPost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can pin posts");
    };
    switch (posts.get(postId)) {
      case (?existingPost) {
        let updatedPost = {
          existingPost with
          pinned = true
        };
        posts.add(postId, updatedPost);
      };
      case (null) { Runtime.trap("Post not found") };
    };
  };

  public shared ({ caller }) func unpinPost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can unpin posts");
    };
    switch (posts.get(postId)) {
      case (?existingPost) {
        let updatedPost = {
          existingPost with
          pinned = false
        };
        posts.add(postId, updatedPost);
      };
      case (null) { Runtime.trap("Post not found") };
    };
  };

  public shared ({ caller }) func deletePost(postId : Nat) : async () {
    switch (posts.get(postId)) {
      case (?existingPost) {
        // Only post author or admin can delete
        if (existingPost.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only post author or admin can delete posts");
        };
        posts.remove(postId);
      };
      case (null) { Runtime.trap("Post not found") };
    };
  };

  public shared ({ caller }) func addReply(postId : Nat, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can reply to posts");
    };

    let reply : Reply = {
      id = Time.now().toNat();
      parentPostId = postId;
      author = caller;
      content;
      timestamp = Time.now();
      likes = [];
    };

    switch (posts.get(postId)) {
      case (?existingPost) {
        let updatedReplies = existingPost.replies.concat([reply]);
        let updatedPost = {
          existingPost with
          replies = updatedReplies
        };
        posts.add(postId, updatedPost);
      };
      case (null) { Runtime.trap("Post not found") };
    };
  };

  public shared ({ caller }) func likePost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like posts");
    };

    switch (posts.get(postId)) {
      case (?existingPost) {
        let found = existingPost.likes.find(func(x) { x == caller });
        switch (found) {
          case (?_) {
            Runtime.trap("Already liked this post");
          };
          case (null) {
            let updatedLikes = existingPost.likes.concat([caller]);
            let updatedPost = {
              existingPost with
              likes = updatedLikes
            };
            posts.add(postId, updatedPost);
          };
        };
      };
      case (null) { Runtime.trap("Post not found") };
    };
  };

  public shared ({ caller }) func unlikePost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlike posts");
    };

    switch (posts.get(postId)) {
      case (?existingPost) {
        let updatedLikes = existingPost.likes.filter(func(p) { p != caller });
        let updatedPost = {
          existingPost with
          likes = updatedLikes
        };
        posts.add(postId, updatedPost);
      };
      case (null) { Runtime.trap("Post not found") };
    };
  };

  // Messaging
  public shared ({ caller }) func startConversation(participants : [Principal], convType : ConversationType) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create conversations");
    };

    // Caller must be in participants list
    let found = participants.find(func(x) { x == caller });
    switch (found) {
      case (null) {
        Runtime.trap("Unauthorized: You must be a participant in the conversation");
      };
      case (_) {
        let conversation : Conversation = {
          id = nextConversationId;
          participants;
          messages = [];
          conversationType = convType;
        };
        conversations.add(nextConversationId, conversation);
        nextConversationId += 1;
        nextConversationId - 1;
      };
    };
  };

  public query ({ caller }) func getConversation(conversationId : Nat) : async ?Conversation {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };

    switch (conversations.get(conversationId)) {
      case (?conv) {
        // Only participants can view the conversation
        let found = conv.participants.find(func(x) { x == caller });
        switch (found) {
          case (null) {
            Runtime.trap("Unauthorized: You are not a participant in this conversation");
          };
          case (_) { ?conv };
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getMyConversations() : async [Conversation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view conversations");
    };

    let allConversations = conversations.values().toArray();
    allConversations.filter<Conversation>(func(conv) {
      let found = conv.participants.find(func(x) { x == caller });
      switch (found) {
        case (?_) { true };
        case (null) { false };
      };
    });
  };

  public shared ({ caller }) func sendMessage(conversationId : Nat, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    switch (conversations.get(conversationId)) {
      case (?existingConversation) {
        let found = existingConversation.participants.find(func(x) { x == caller });
        switch (found) {
          case (null) {
            Runtime.trap("Unauthorized: You are not a participant in this conversation");
          };
          case (_) {
            let message : Message = {
              id = Time.now().toNat();
              author = caller;
              content;
              timestamp = Time.now();
            };
            let updatedMessages = existingConversation.messages.concat([message]);
            let updatedConversation = {
              existingConversation with
              messages = updatedMessages
            };
            conversations.add(conversationId, updatedConversation);
          };
        };
      };
      case (null) { Runtime.trap("Conversation not found") };
    };
  };

  // Reporting System
  public shared ({ caller }) func reportContent(reportedContent : ReportedContent, violationType : ViolationType, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can report content");
    };

    let report : Report = {
      id = nextReportId;
      reporter = caller;
      reportedContent;
      violationType;
      description;
      status = #pending;
      timestamp = Time.now();
    };
    reports.add(nextReportId, report);
    nextReportId += 1;
  };

  public query ({ caller }) func getReports() : async [Report] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view reports");
    };
    reports.values().toArray();
  };

  public shared ({ caller }) func updateReportStatus(reportId : Nat, status : ReportStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update report status");
    };

    switch (reports.get(reportId)) {
      case (?existingReport) {
        let updatedReport = {
          existingReport with
          status = status
        };
        reports.add(reportId, updatedReport);
      };
      case (null) { Runtime.trap("Report not found") };
    };
  };

  // Moderation System
  public shared ({ caller }) func moderateUser(userId : Principal, actionType : ModerationType, violationType : ViolationType, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can moderate users");
    };

    let action : ModerationAction = {
      id = nextModerationId;
      userId;
      actionType;
      violationType;
      description;
      timestamp = Time.now();
      moderator = caller;
    };
    moderationActions.add(nextModerationId, action);
    nextModerationId += 1;
  };

  public query ({ caller }) func getModerationActions(userId : Principal) : async [ModerationAction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view moderation actions");
    };

    let allActions = moderationActions.values().toArray();
    allActions.filter<ModerationAction>(func(action) {
      action.userId == userId
    });
  };

  // Follow System
  public shared ({ caller }) func followUser(userId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can follow other users");
    };

    if (caller == userId) {
      Runtime.trap("Cannot follow yourself");
    };

    let currentFollows = follows.get(caller).get([]);
    let found = currentFollows.find(func(x) { x == userId });
    switch (found) {
      case (?_) {
        Runtime.trap("Already following this user");
      };
      case (null) {
        let updatedFollows = currentFollows.concat([userId]);
        follows.add(caller, updatedFollows);
      };
    };
  };

  public shared ({ caller }) func unfollowUser(userId : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unfollow users");
    };

    let currentFollows = follows.get(caller).get([]);
    let updatedFollows = currentFollows.filter(func(p) { p != userId });
    follows.add(caller, updatedFollows);
  };

  public query ({ caller }) func getFollowing() : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view following list");
    };
    follows.get(caller).get([]);
  };

  public shared ({ caller }) func followTopic(topic : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can follow topics");
    };

    let currentTopics = topicFollows.get(caller).get([]);
    let found = currentTopics.find(func(x) { x == topic });
    switch (found) {
      case (?_) {
        Runtime.trap("Already following this topic");
      };
      case (null) {
        let updatedTopics = currentTopics.concat([topic]);
        topicFollows.add(caller, updatedTopics)
      };
    };
  };

  public shared ({ caller }) func unfollowTopic(topic : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unfollow topics");
    };

    let currentTopics = topicFollows.get(caller).get([]);
    let updatedTopics = currentTopics.filter(func(t) { t != topic });
    topicFollows.add(caller, updatedTopics);
  };

  public query ({ caller }) func getFollowedTopics() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view followed topics");
    };
    topicFollows.get(caller).get([]);
  };
};
