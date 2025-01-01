"use client";

import React, { FormEvent, useOptimistic, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageCircleIcon, Share2Icon, ClockIcon } from "./Icons";
import { likeAction } from "@/lib/actions";
import { useAuth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

interface LikeState {
    likeCount: number;
    isLiked: boolean;
}

type PostInteractionProps = {
    postId: string;
    initialLikes: string[];
    commentNumber: number;
};
    
const PostInteraction = ({postId, initialLikes, commentNumber}: PostInteractionProps) => {
    const { userId } =  useAuth();
    const initialState = {
        likeCount: initialLikes.length,
        isLiked: userId ? initialLikes.includes(userId) : false,
    };

    const [optimisticLike, addOptimisticLike] = useOptimistic<LikeState,void>(initialState, (currentState) => ({
        likeCount: currentState.likeCount + (currentState.isLiked ? -1 : 1),
        isLiked: !currentState.isLiked,
    }));

    // const [likeState, setLikeState] = useState({ 
    //     likeCount: initialLikes.length, 
    //     isLiked: userId ? initialLikes.includes(userId) : false,
    //  });

    const handleLikeSubmit = async () => {
        try {
            addOptimisticLike();
            // setLikeState((prevState) => ({
            //     likeCount: prevState.likeCount + (prevState.isLiked ? -1 : 1),
            //     isLiked: !prevState.isLiked,
            // }));
            await likeAction(postId);
        } catch (error) {
            // setLikeState((prevState) => ({
            //     likeCount: prevState.likeCount + (prevState.isLiked ? 1 : -1),
            //     isLiked: !prevState.isLiked,
            // }));
            console.error(error);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <form action={handleLikeSubmit}>
                <Button variant="ghost" size="icon">
                    <HeartIcon className={`h-5 w-5 text-muted-foreground ${optimisticLike.isLiked ? "text-destructive" : "text-muted-foreground"}`} />
                </Button>
            </form>
            <span className="-ml-1">{optimisticLike.likeCount}</span>
            <Button variant="ghost" size="icon">
                <MessageCircleIcon className={`"h-5 w-5 text-muted-foreground${optimisticLike.isLiked ? "text-destructive" : "text-muted-foreground"}`} />
            </Button>
            <span>{commentNumber}</span>
            <Button variant="ghost" size="icon">
                <Share2Icon className="h-5 w-5 text-muted-foreground" />
            </Button>
        </div>
    );
}

export default PostInteraction;