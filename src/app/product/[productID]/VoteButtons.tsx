"use client";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpIcon, Flag } from "lucide-react";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import Vote from "./ReviewVoteAction";
import { abbrNum, cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { Vote as VoteType } from "@prisma/client";

function VoteButtons({
  reviewId,
  userId,
  vote,
  voteCount,
  className,
}: {
  reviewId: string;
  userId: string | null;
  vote: VoteType | undefined;
  voteCount: number;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [voteState, setVoteState] = useState({
    hasVotedUp: true,
    hasVotedDown: true,
    voteCount,
  });
  useEffect(() => {
    setVoteState((prevState) => ({
      ...prevState,
      hasVotedUp: vote ? vote.isVoteUp : false,
      hasVotedDown: vote ? !vote.isVoteUp : false,
    }));
  }, []);
  function handleVote(isVoteUp: boolean) {
    if (userId === null) {
      // #TODO pop sign in modal instead maybe
      toast.info(
        <div>
          You are not <Link href="/sign-in">Logged In!</Link>
        </div>,
      );
      return;
    }
    const stateSnapshot = voteState;
    setVoteState((prevState) => ({
      ...prevState,
      voteCount: isVoteUp
        ? prevState.hasVotedDown
          ? prevState.voteCount + 2
          : ++prevState.voteCount
        : prevState.hasVotedUp
          ? prevState.voteCount - 2
          : --prevState.voteCount,
      hasVotedUp: isVoteUp,
      hasVotedDown: !isVoteUp,
    }));

    startTransition(async () => {
      const result = await Vote(isVoteUp, reviewId, userId);
      if (!result.success) {
        setVoteState(stateSnapshot);
        toast.error(result.cause);
      }
    });
  }

  return (
    <div
      className={cn(
        "flex h-full w-fit flex-col items-center gap-1 overflow-clip text-zinc-800 dark:text-zinc-300 ",
        className,
      )}
    >
      <Button
        disabled={voteState.hasVotedUp}
        className={voteState.hasVotedUp ? "text-opacity-90" : ""}
        variant="ghostHoverLess"
        size="icon"
        onClick={() => handleVote(true)}
      >
        <ArrowUp />
      </Button>
      <span className="font-bold">{abbrNum(voteState.voteCount, 1)}</span>
      <Button
        disabled={voteState.hasVotedDown}
        className={voteState.hasVotedDown ? "text-opacity-90" : ""}
        variant="ghostHoverLess"
        size="icon"
        onClick={() => handleVote(false)}
      >
        <ArrowDown />
      </Button>
    </div>
  );
}

export default VoteButtons;
