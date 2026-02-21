import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldUserProfile = {
    id : Principal;
    username : Text;
    avatar : ?Storage.ExternalBlob;
    interests : [Text];
    debateStyle : { #civil; #aggressive; #creative; #random };
    socialMedia : ?OldSocialMediaLinks;
  };

  type OldSocialMediaLinks = {
    facebook : ?Text;
    twitter : ?Text;
    instagram : ?Text;
  };

  type NewUserProfile = {
    id : Principal;
    username : Text;
    avatar : ?Storage.ExternalBlob;
    interests : [Text];
    debateStyle : { #civil; #aggressive; #creative; #random };
    socialMedia : ?NewSocialMediaLinks;
  };

  type NewSocialMediaLinks = {
    facebook : ?Text;
    twitter : ?Text;
    instagram : ?Text;
    pinterest : ?Text;
  };

  // Define state types
  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_key, oldProfile) {
        {
          oldProfile with
          socialMedia = mapSocialMedia(oldProfile.socialMedia)
        }
      }
    );
    { userProfiles = newUserProfiles };
  };

  func mapSocialMedia(oldLinks : ?OldSocialMediaLinks) : ?NewSocialMediaLinks {
    switch (oldLinks) {
      case (null) { null };
      case (?old) {
        ?{
          old with
          pinterest = null; // Default value for new field
        };
      };
    };
  };
};
