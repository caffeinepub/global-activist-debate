import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";

module {
  // Old types
  type OldUserProfile = {
    id : Principal;
    username : Text;
    avatar : {
      skinTone : {
        colorId : Nat;
        colorType : { #skinToneLevel; #hairColor; #clothingColor };
      };
      hairType : {
        id : Nat;
        styleType : {
          #hair;
          #beard;
          #wig;
          #hat;
          #glasses;
          #shirt;
          #cape;
          #hijab;
          #culturalHeadCovering;
          #culturalClothing;
        };
      };
      hijab : ?{
        id : Nat;
        styleType : {
          #hair;
          #beard;
          #wig;
          #hat;
          #glasses;
          #shirt;
          #cape;
          #hijab;
          #culturalHeadCovering;
          #culturalClothing;
        };
      };
      culturalHeadCovering : ?{
        id : Nat;
        styleType : {
          #hair;
          #beard;
          #wig;
          #hat;
          #glasses;
          #shirt;
          #cape;
          #hijab;
          #culturalHeadCovering;
          #culturalClothing;
        };
      };
      eyewear : ?{
        id : Nat;
        styleType : {
          #hair;
          #beard;
          #wig;
          #hat;
          #glasses;
          #shirt;
          #cape;
          #hijab;
          #culturalHeadCovering;
          #culturalClothing;
        };
      };
      clothing : ?{
        id : Nat;
        styleType : {
          #hair;
          #beard;
          #wig;
          #hat;
          #glasses;
          #shirt;
          #cape;
          #hijab;
          #culturalHeadCovering;
          #culturalClothing;
        };
      };
      culturalClothing : ?{
        id : Nat;
        styleType : {
          #hair;
          #beard;
          #wig;
          #hat;
          #glasses;
          #shirt;
          #cape;
          #hijab;
          #culturalHeadCovering;
          #culturalClothing;
        };
      };
      accessories : [{
        id : Nat;
        styleType : {
          #hair;
          #beard;
          #wig;
          #hat;
          #glasses;
          #shirt;
          #cape;
          #hijab;
          #culturalHeadCovering;
          #culturalClothing;
        };
      }];
    };
    interests : [Text];
    debateStyle : { #civil; #aggressive; #creative; #random };
    socialMedia : ?{
      facebook : ?Text;
      twitter : ?Text;
      instagram : ?Text;
      pinterest : ?Text;
    };
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
    posts : Map.Map<Nat, {
      id : Nat;
      author : Principal;
      content : Text;
      media : ?Storage.ExternalBlob;
      timestamp : Time.Time;
      section : {
        #civilDebate;
        #aggressiveDebate;
        #quotesPoems;
        #randomDebates;
      };
      pinned : Bool;
      replies : [{
        id : Nat;
        parentPostId : Nat;
        author : Principal;
        content : Text;
        timestamp : Time.Time;
        likes : [Principal];
      }];
      likes : [Principal];
    }>;
    conversations : Map.Map<Nat, {
      id : Nat;
      participants : [Principal];
      messages : [{
        id : Nat;
        author : Principal;
        content : Text;
        timestamp : Time.Time;
      }];
      conversationType : { #direct; #group };
    }>;
    reports : Map.Map<Nat, {
      id : Nat;
      reporter : Principal;
      reportedContent : {
        #post : Nat;
        #reply : Nat;
        #userProfile : Principal;
      };
      violationType : {
        #spam;
        #harassment;
        #inappropriateContent;
        #other;
      };
      description : Text;
      status : {
        #pending;
        #reviewed;
        #resolved;
      };
      timestamp : Time.Time;
    }>;
    moderationActions : Map.Map<Nat, {
      id : Nat;
      userId : Principal;
      actionType : {
        #warning;
        #strike;
        #ban;
      };
      violationType : {
        #spam;
        #harassment;
        #inappropriateContent;
        #other;
      };
      description : Text;
      timestamp : Time.Time;
      moderator : Principal;
    }>;
    follows : Map.Map<Principal, [Principal]>;
    topicFollows : Map.Map<Principal, [Text]>;
    nextPostId : Nat;
    nextConversationId : Nat;
    nextReportId : Nat;
    nextModerationId : Nat;
  };

  // New types
  type NewUserProfile = {
    id : Principal;
    username : Text;
    interests : [Text];
    debateStyle : { #civil; #aggressive; #creative; #random };
    socialMedia : ?{
      facebook : ?Text;
      twitter : ?Text;
      instagram : ?Text;
      pinterest : ?Text;
    };
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
    posts : Map.Map<Nat, {
      id : Nat;
      author : Principal;
      content : Text;
      media : ?Storage.ExternalBlob;
      timestamp : Time.Time;
      section : {
        #civilDebate;
        #aggressiveDebate;
        #quotesPoems;
        #randomDebates;
      };
      pinned : Bool;
      replies : [{
        id : Nat;
        parentPostId : Nat;
        author : Principal;
        content : Text;
        timestamp : Time.Time;
        likes : [Principal];
      }];
      likes : [Principal];
    }>;
    conversations : Map.Map<Nat, {
      id : Nat;
      participants : [Principal];
      messages : [{
        id : Nat;
        author : Principal;
        content : Text;
        timestamp : Time.Time;
      }];
      conversationType : { #direct; #group };
    }>;
    reports : Map.Map<Nat, {
      id : Nat;
      reporter : Principal;
      reportedContent : {
        #post : Nat;
        #reply : Nat;
        #userProfile : Principal;
      };
      violationType : {
        #spam;
        #harassment;
        #inappropriateContent;
        #other;
      };
      description : Text;
      status : {
        #pending;
        #reviewed;
        #resolved;
      };
      timestamp : Time.Time;
    }>;
    moderationActions : Map.Map<Nat, {
      id : Nat;
      userId : Principal;
      actionType : {
        #warning;
        #strike;
        #ban;
      };
      violationType : {
        #spam;
        #harassment;
        #inappropriateContent;
        #other;
      };
      description : Text;
      timestamp : Time.Time;
      moderator : Principal;
    }>;
    follows : Map.Map<Principal, [Principal]>;
    topicFollows : Map.Map<Principal, [Text]>;
    nextPostId : Nat;
    nextConversationId : Nat;
    nextReportId : Nat;
    nextModerationId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          oldProfile with
          interests = oldProfile.interests;
          debateStyle = oldProfile.debateStyle;
          socialMedia = oldProfile.socialMedia;
        };
      }
    );

    {
      old with
      userProfiles = newUserProfiles;
    };
  };
};
