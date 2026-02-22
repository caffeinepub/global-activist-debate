import { Report, ModerationType, ViolationType, ReportStatus } from '../backend';
import { Button } from '@/components/ui/button';
import { useModerateUser, useUpdateReportStatus, useGetModerationActions } from '../hooks/useQueries';
import { Principal } from '@icp-sdk/core/principal';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ModerationActionsProps {
  report: Report;
}

export default function ModerationActions({ report }: ModerationActionsProps) {
  const moderateUser = useModerateUser();
  const updateReportStatus = useUpdateReportStatus();

  let userId: Principal | null = null;
  if (report.reportedContent.__kind__ === 'userProfile') {
    userId = report.reportedContent.userProfile;
  }

  const { data: moderationHistory = [] } = useGetModerationActions(userId || Principal.anonymous());

  const warningCount = moderationHistory.filter((a) => a.actionType === ModerationType.warning).length;
  const strikeCount = moderationHistory.filter((a) => a.actionType === ModerationType.strike).length;

  const handleModerate = async (actionType: ModerationType) => {
    if (!userId) {
      toast.error('Cannot moderate: No user associated with this report');
      return;
    }

    await moderateUser.mutateAsync({
      userId,
      actionType,
      violationType: report.violationType,
      description: report.description,
    });

    await updateReportStatus.mutateAsync({
      reportId: report.id,
      status: ReportStatus.reviewed,
    });

    toast.success(`${actionType} issued successfully`);
  };

  const handleResolve = async () => {
    await updateReportStatus.mutateAsync({
      reportId: report.id,
      status: ReportStatus.resolved,
    });
    toast.success('Report resolved');
  };

  return (
    <div className="space-y-4">
      {userId && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            User history: {warningCount} warning(s), {strikeCount} strike(s)
            {warningCount >= 3 && strikeCount === 0 && ' - Ready for strike'}
            {strikeCount > 0 && ' - Next warning will result in ban'}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-2">
        {userId && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModerate(ModerationType.warning)}
              disabled={moderateUser.isPending}
            >
              Issue Warning
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleModerate(ModerationType.strike)}
              disabled={moderateUser.isPending || warningCount < 3}
            >
              Issue Strike
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleModerate(ModerationType.ban)}
              disabled={moderateUser.isPending || strikeCount === 0}
            >
              Ban User
            </Button>
          </>
        )}
        <Button variant="secondary" size="sm" onClick={handleResolve} disabled={updateReportStatus.isPending}>
          Mark Resolved
        </Button>
      </div>
    </div>
  );
}
