import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import {
  UserProfile,
  Post,
  Conversation,
  Report,
  ModerationAction,
  SectionType,
  ConversationType,
  ReportedContent,
  ViolationType,
  ModerationType,
  ReportStatus,
} from '../backend';
import { Principal } from '@icp-sdk/core/principal';
import { ExternalBlob } from '../backend';

// Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(userId: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useFindUserIdByUsername(username: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Principal | null>({
    queryKey: ['userIdByUsername', username],
    queryFn: async () => {
      if (!actor) return null;
      return actor.findUserIdByUsername(username);
    },
    enabled: !!actor && !isFetching && username.trim().length > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

// Post Queries
export function useGetPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      media,
      section,
    }: {
      content: string;
      media: ExternalBlob | null;
      section: SectionType;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(content, media, section);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useAddReply() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReply(postId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useLikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUnlikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unlikePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// Conversation Queries
export function useGetMyConversations() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyConversations();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useStartConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      participants,
      convType,
    }: {
      participants: Principal[];
      convType: ConversationType;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startConversation(participants, convType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(conversationId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// Report Queries
export function useReportContent() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      reportedContent,
      violationType,
      description,
    }: {
      reportedContent: ReportedContent;
      violationType: ViolationType;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.reportContent(reportedContent, violationType, description);
    },
  });
}

export function useGetReports() {
  const { actor, isFetching } = useActor();
  const { data: isAdmin } = useIsAdmin();

  return useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReports();
    },
    enabled: !!actor && !isFetching && !!isAdmin,
  });
}

export function useUpdateReportStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, status }: { reportId: bigint; status: ReportStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReportStatus(reportId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

// Moderation Queries
export function useModerateUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      actionType,
      violationType,
      description,
    }: {
      userId: Principal;
      actionType: ModerationType;
      violationType: ViolationType;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.moderateUser(userId, actionType, violationType, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderationActions'] });
    },
  });
}

export function useGetModerationActions(userId: Principal) {
  const { actor, isFetching } = useActor();
  const { data: isAdmin } = useIsAdmin();

  return useQuery<ModerationAction[]>({
    queryKey: ['moderationActions', userId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getModerationActions(userId);
    },
    enabled: !!actor && !isFetching && !!isAdmin,
  });
}

// Follow Queries
export function useFollowUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.followUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
  });
}

export function useUnfollowUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unfollowUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
  });
}

export function useGetFollowing() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Principal[]>({
    queryKey: ['following'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFollowing();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// Admin Queries
export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}
